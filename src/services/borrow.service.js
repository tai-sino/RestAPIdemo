const { query, transaction } = require('../db/sqlite');
const AppError = require('../utils/app-error');

function nowIso() {
  return new Date().toISOString();
}

function getBorrowById(id) {
  return query(
    `
      SELECT
        b.id,
        b.user_id,
        b.book_id,
        b.borrowed_at,
        b.due_date,
        b.returned_at,
        b.status,
        b.created_at,
        b.updated_at,
        u.name AS user_name,
        u.email AS user_email,
        bk.title AS book_title,
        bk.author AS book_author
      FROM borrows b
      INNER JOIN users u ON u.id = b.user_id
      INNER JOIN books bk ON bk.id = b.book_id
      WHERE b.id = ?
    `,
    [id]
  )[0];
}

function listMyBorrows(userId) {
  return query(
    `
      SELECT
        b.id,
        b.book_id,
        bk.title AS book_title,
        bk.author AS book_author,
        b.borrowed_at,
        b.due_date,
        b.returned_at,
        b.status
      FROM borrows b
      INNER JOIN books bk ON bk.id = b.book_id
      WHERE b.user_id = ?
      ORDER BY b.id DESC
    `,
    [userId]
  );
}

function listAllBorrows() {
  return query(
    `
      SELECT
        b.id,
        b.user_id,
        u.name AS user_name,
        u.email AS user_email,
        b.book_id,
        bk.title AS book_title,
        bk.author AS book_author,
        b.borrowed_at,
        b.due_date,
        b.returned_at,
        b.status
      FROM borrows b
      INNER JOIN users u ON u.id = b.user_id
      INNER JOIN books bk ON bk.id = b.book_id
      ORDER BY b.id DESC
    `
  );
}

function borrowBook({ userId, bookId, dueDate }) {
  const due = dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return transaction((tx) => {
    const book = tx.query('SELECT * FROM books WHERE id = ?', [bookId])[0];
    if (!book) {
      throw new AppError('Book not found.', 404);
    }

    if (Number(book.available_copies) <= 0) {
      throw new AppError('Book is out of stock.', 400);
    }

    const timestamp = nowIso();
    tx.run(
      `
        INSERT INTO borrows (user_id, book_id, borrowed_at, due_date, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'borrowing', ?, ?)
      `,
      [userId, bookId, timestamp, due, timestamp, timestamp]
    );
    const borrowId = tx.query('SELECT last_insert_rowid() AS id')[0]?.id;

    tx.run(
      `
        UPDATE books
        SET available_copies = available_copies - 1, updated_at = ?
        WHERE id = ?
      `,
      [timestamp, bookId]
    );

    return getBorrowById(borrowId);
  });
}

function returnBook({ borrowId, user }) {
  return transaction((tx) => {
    const borrow = tx.query('SELECT * FROM borrows WHERE id = ?', [borrowId])[0];
    if (!borrow) {
      throw new AppError('Borrow record not found.', 404);
    }

    if (user.role !== 'admin' && Number(borrow.user_id) !== Number(user.id)) {
      throw new AppError('Forbidden. You can only return your own borrow record.', 403);
    }

    if (borrow.returned_at) {
      throw new AppError('This borrow record was already returned.', 400);
    }

    const timestamp = nowIso();
    tx.run(
      `
        UPDATE borrows
        SET returned_at = ?, status = 'returned', updated_at = ?
        WHERE id = ?
      `,
      [timestamp, timestamp, borrowId]
    );

    tx.run(
      `
        UPDATE books
        SET available_copies = available_copies + 1, updated_at = ?
        WHERE id = ?
      `,
      [timestamp, borrow.book_id]
    );

    return getBorrowById(borrowId);
  });
}

module.exports = {
  borrowBook,
  returnBook,
  listMyBorrows,
  listAllBorrows,
  getBorrowById,
};
