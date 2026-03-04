const bookService = require('../services/book.service');
const AppError = require('../utils/app-error');
const { sendSuccess } = require('../utils/response');

function validateBookPayload(payload, isCreate = true) {
  const errors = {};

  if (isCreate && !payload.title) {
    errors.title = ['Title is required.'];
  }
  if (payload.title !== undefined && String(payload.title).trim().length === 0) {
    errors.title = ['Title cannot be empty.'];
  }

  if (isCreate && !payload.author) {
    errors.author = ['Author is required.'];
  }
  if (payload.author !== undefined && String(payload.author).trim().length === 0) {
    errors.author = ['Author cannot be empty.'];
  }

  if (isCreate && payload.total_copies === undefined) {
    errors.total_copies = ['total_copies is required.'];
  }

  if (
    payload.total_copies !== undefined &&
    (!Number.isInteger(Number(payload.total_copies)) || Number(payload.total_copies) < 0)
  ) {
    errors.total_copies = ['total_copies must be an integer >= 0.'];
  }

  if (
    payload.available_copies !== undefined &&
    (!Number.isInteger(Number(payload.available_copies)) || Number(payload.available_copies) < 0)
  ) {
    errors.available_copies = ['available_copies must be an integer >= 0.'];
  }

  const total =
    payload.total_copies !== undefined ? Number(payload.total_copies) : Number.MAX_SAFE_INTEGER;
  const available =
    payload.available_copies !== undefined ? Number(payload.available_copies) : undefined;

  if (available !== undefined && available > total) {
    errors.available_copies = ['available_copies cannot be greater than total_copies.'];
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError('Validation failed.', 422, errors);
  }
}

function getBooks(req, res, next) {
  try {
    const result = bookService.listBooks({
      page: req.query.page,
      limit: req.query.limit,
      keyword: req.query.keyword || '',
    });
    return sendSuccess(res, 'Books fetched.', result.items, 200, result.meta);
  } catch (error) {
    return next(error);
  }
}

function getBookById(req, res, next) {
  try {
    const bookId = Number(req.params.id);
    if (!Number.isInteger(bookId) || bookId <= 0) {
      throw new AppError('Book id must be a positive integer.', 422);
    }

    const book = bookService.getBookById(bookId);
    if (!book) {
      throw new AppError('Book not found.', 404);
    }

    return sendSuccess(res, 'Book fetched.', book);
  } catch (error) {
    return next(error);
  }
}

function createBook(req, res, next) {
  try {
    validateBookPayload(req.body, true);
    const book = bookService.createBook({
      title: String(req.body.title).trim(),
      author: String(req.body.author).trim(),
      isbn: req.body.isbn ? String(req.body.isbn).trim() : null,
      published_year: req.body.published_year ? Number(req.body.published_year) : null,
      total_copies: Number(req.body.total_copies),
      available_copies:
        req.body.available_copies === undefined ? undefined : Number(req.body.available_copies),
    });
    return sendSuccess(res, 'Book created.', book, 201);
  } catch (error) {
    return next(error);
  }
}

function updateBook(req, res, next) {
  try {
    const bookId = Number(req.params.id);
    if (!Number.isInteger(bookId) || bookId <= 0) {
      throw new AppError('Book id must be a positive integer.', 422);
    }

    validateBookPayload(req.body, false);
    const payload = {};

    if (req.body.title !== undefined) {
      payload.title = String(req.body.title).trim();
    }
    if (req.body.author !== undefined) {
      payload.author = String(req.body.author).trim();
    }
    if (req.body.isbn !== undefined) {
      payload.isbn = req.body.isbn ? String(req.body.isbn).trim() : null;
    }
    if (req.body.published_year !== undefined) {
      payload.published_year = req.body.published_year ? Number(req.body.published_year) : null;
    }
    if (req.body.total_copies !== undefined) {
      payload.total_copies = Number(req.body.total_copies);
    }
    if (req.body.available_copies !== undefined) {
      payload.available_copies = Number(req.body.available_copies);
    }

    const book = bookService.updateBook(bookId, payload);
    return sendSuccess(res, 'Book updated.', book);
  } catch (error) {
    return next(error);
  }
}

function deleteBook(req, res, next) {
  try {
    const bookId = Number(req.params.id);
    if (!Number.isInteger(bookId) || bookId <= 0) {
      throw new AppError('Book id must be a positive integer.', 422);
    }

    bookService.deleteBook(bookId);
    return sendSuccess(res, 'Book deleted.', {});
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
