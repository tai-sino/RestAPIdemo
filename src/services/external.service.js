const axios = require('axios');
const AppError = require('../utils/app-error');

function normalizeBook(doc) {
  return {
    title: doc.title || null,
    author: doc.author_name?.[0] || null,
    first_publish_year: doc.first_publish_year || null,
    isbn: doc.isbn?.[0] || null,
  };
}

async function searchOpenLibraryBooks({ title, limit = 10 }) {
  const baseUrl = process.env.OPEN_LIBRARY_BASE_URL || 'https://openlibrary.org';

  try {
    const response = await axios.get(`${baseUrl}/search.json`, {
      params: {
        title,
        limit,
      },
      timeout: 8000,
    });

    const docs = response.data?.docs || [];
    return docs.map(normalizeBook);
  } catch (error) {
    throw new AppError('Failed to fetch data from external API.', 502);
  }
}

module.exports = {
  searchOpenLibraryBooks,
};
