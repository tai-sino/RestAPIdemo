const externalService = require('../services/external.service');
const AppError = require('../utils/app-error');
const { sendSuccess } = require('../utils/response');

async function searchBooks(req, res, next) {
  try {
    const title = String(req.query.title || '').trim();
    if (!title) {
      throw new AppError('Query param "title" is required.', 422, {
        title: ['Query param "title" is required.'],
      });
    }

    const rawLimit = req.query.limit ? Number(req.query.limit) : 10;
    const limit = Number.isInteger(rawLimit) ? Math.max(1, Math.min(20, rawLimit)) : 10;
    const books = await externalService.searchOpenLibraryBooks({ title, limit });
    return sendSuccess(res, 'External books fetched.', books, 200, {
      source: 'openlibrary',
      total: books.length,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  searchBooks,
};
