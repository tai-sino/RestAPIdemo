const borrowService = require('../services/borrow.service');
const AppError = require('../utils/app-error');
const { sendSuccess } = require('../utils/response');

function borrowBook(req, res, next) {
  try {
    const bookId = Number(req.body.book_id);
    if (!Number.isInteger(bookId) || bookId <= 0) {
      throw new AppError('book_id must be a positive integer.', 422, {
        book_id: ['book_id must be a positive integer.'],
      });
    }

    if (req.body.due_date !== undefined && String(req.body.due_date).trim().length === 0) {
      throw new AppError('Validation failed.', 422, {
        due_date: ['due_date cannot be empty if provided.'],
      });
    }

    const borrow = borrowService.borrowBook({
      userId: req.user.id,
      bookId,
      dueDate: req.body.due_date ? String(req.body.due_date) : undefined,
    });

    return sendSuccess(res, 'Borrow created.', borrow, 201);
  } catch (error) {
    return next(error);
  }
}

function returnBook(req, res, next) {
  try {
    const borrowId = Number(req.params.id);
    if (!Number.isInteger(borrowId) || borrowId <= 0) {
      throw new AppError('Borrow id must be a positive integer.', 422);
    }

    const borrow = borrowService.returnBook({
      borrowId,
      user: req.user,
    });

    return sendSuccess(res, 'Book returned.', borrow);
  } catch (error) {
    return next(error);
  }
}

function getMyBorrows(req, res, next) {
  try {
    const borrows = borrowService.listMyBorrows(req.user.id);
    return sendSuccess(res, 'My borrows fetched.', borrows);
  } catch (error) {
    return next(error);
  }
}

function getAllBorrows(_req, res, next) {
  try {
    const borrows = borrowService.listAllBorrows();
    return sendSuccess(res, 'All borrows fetched.', borrows);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  borrowBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
};
