const { query, run } = require('../db/sqlite');
const AppError = require('../utils/app-error');

function nowIso() {
  return new Date().toISOString();
}

function normalizeBookRow(book) {
  if (!book) {
    return null;
  }
  return {
    id: Number(book.id),
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    published_year: book.published_year,
    total_copies: Number(book.total_copies),
    available_copies: Number(book.available_copies),
    created_at: book.created_at,
    updated_at: book.updated_at,
  };
}

function listBooks({ page = 1, limit = 10, keyword = '' }) {
  const safePage = Number.isNaN(Number(page)) ? 1 : Math.max(1, Number(page));
  const safeLimit = Number.isNaN(Number(limit)) ? 10 : Math.min(100, Math.max(1, Number(limit)));
  const offset = (safePage - 1) * safeLimit;
  const searchTerm = `%${String(keyword).trim()}%`;

  const total = query(
    `
      SELECT COUNT(*) AS count
      FROM books
      WHERE title LIKE ? OR author LIKE ?
    `,
    [searchTerm, searchTerm]
  )[0]?.count || 0;

  const rows = query(
    `
      SELECT *
      FROM books
      WHERE title LIKE ? OR author LIKE ?
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `,
    [searchTerm, searchTerm, safeLimit, offset]
  );

  return {
    items: rows.map(normalizeBookRow),
    meta: {
      page: safePage,
      limit: safeLimit,
      total: Number(total),
    },
  };
}

function getBookById(id) {
  const book = query('SELECT * FROM books WHERE id = ?', [id])[0];
  return normalizeBookRow(book);
}

function createBook(payload) {
  const now = nowIso();
  const totalCopies = Number(payload.total_copies);
  const availableCopies =
    payload.available_copies === undefined || payload.available_copies === null
      ? totalCopies
      : Number(payload.available_copies);

  if (availableCopies > totalCopies) {
    throw new AppError('available_copies cannot be greater than total_copies.', 422, {
      available_copies: ['available_copies cannot be greater than total_copies.'],
    });
  }

  const result = run(
    `
      INSERT INTO books (
        title, author, isbn, published_year, total_copies, available_copies, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.title,
      payload.author,
      payload.isbn || null,
      payload.published_year || null,
      totalCopies,
      availableCopies,
      now,
      now,
    ]
  );

  return getBookById(result.lastInsertId);
}

function updateBook(id, payload) {
  const existing = getBookById(id);
  if (!existing) {
    throw new AppError('Book not found.', 404);
  }

  const updatedBook = {
    title: payload.title ?? existing.title,
    author: payload.author ?? existing.author,
    isbn: payload.isbn ?? existing.isbn,
    published_year: payload.published_year ?? existing.published_year,
    total_copies:
      payload.total_copies === undefined ? existing.total_copies : Number(payload.total_copies),
    available_copies:
      payload.available_copies === undefined
        ? existing.available_copies
        : Number(payload.available_copies),
  };

  if (updatedBook.available_copies > updatedBook.total_copies) {
    throw new AppError('available_copies cannot be greater than total_copies.', 422, {
      available_copies: ['available_copies cannot be greater than total_copies.'],
    });
  }

  run(
    `
      UPDATE books
      SET title = ?, author = ?, isbn = ?, published_year = ?,
          total_copies = ?, available_copies = ?, updated_at = ?
      WHERE id = ?
    `,
    [
      updatedBook.title,
      updatedBook.author,
      updatedBook.isbn,
      updatedBook.published_year,
      updatedBook.total_copies,
      updatedBook.available_copies,
      nowIso(),
      id,
    ]
  );

  return getBookById(id);
}

function deleteBook(id) {
  const existing = getBookById(id);
  if (!existing) {
    throw new AppError('Book not found.', 404);
  }

  try {
    run('DELETE FROM books WHERE id = ?', [id]);
  } catch (error) {
    throw new AppError('Book cannot be deleted because it is referenced by borrow records.', 409);
  }
}

module.exports = {
  listBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
