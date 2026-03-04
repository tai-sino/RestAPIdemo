require('dotenv').config();
const app = require('../app');
const { initDatabase, resetDatabase } = require('../db/sqlite');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function httpCall(baseUrl, method, path, body, token) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }

  return {
    status: response.status,
    payload,
  };
}

async function run() {
  await initDatabase();
  await resetDatabase();

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;

  try {
    const health = await httpCall(baseUrl, 'GET', '/health');
    assert(health.status === 200, `Health check failed. Status: ${health.status}`);

    const adminLogin = await httpCall(baseUrl, 'POST', '/auth/login', {
      email: 'admin@library.local',
      password: 'admin123',
    });
    assert(adminLogin.status === 200, `Admin login failed. Status: ${adminLogin.status}`);
    const adminToken = adminLogin.payload?.data?.access_token;
    assert(adminToken, 'Admin token missing.');

    const createBook = await httpCall(
      baseUrl,
      'POST',
      '/books',
      {
        title: 'API Testing for Beginners',
        author: 'Demo Author',
        total_copies: 3,
      },
      adminToken
    );
    assert(createBook.status === 201, `Create book failed. Status: ${createBook.status}`);
    const bookId = createBook.payload?.data?.id;
    assert(bookId, 'Created book id missing.');

    const userLogin = await httpCall(baseUrl, 'POST', '/auth/login', {
      email: 'user1@example.com',
      password: '123456',
    });
    assert(userLogin.status === 200, `User login failed. Status: ${userLogin.status}`);
    const userToken = userLogin.payload?.data?.access_token;
    assert(userToken, 'User token missing.');

    const borrow = await httpCall(
      baseUrl,
      'POST',
      '/borrows',
      {
        book_id: bookId,
      },
      userToken
    );
    assert(borrow.status === 201, `Borrow failed. Status: ${borrow.status}`);
    const borrowId = borrow.payload?.data?.id;
    assert(borrowId, 'Borrow id missing.');

    const returnBook = await httpCall(baseUrl, 'PATCH', `/borrows/${borrowId}/return`, null, userToken);
    assert(returnBook.status === 200, `Return failed. Status: ${returnBook.status}`);

    const external = await httpCall(
      baseUrl,
      'GET',
      '/external/books/search?title=harry+potter&limit=2'
    );
    assert(
      external.status === 200 || external.status === 502,
      `External API endpoint unexpected status: ${external.status}`
    );

    const unauthorizedCreate = await httpCall(baseUrl, 'POST', '/books', {
      title: 'No Token Book',
      author: 'None',
      total_copies: 1,
    });
    assert(
      unauthorizedCreate.status === 401,
      `Unauthorized check failed. Expected 401, got ${unauthorizedCreate.status}`
    );

    // eslint-disable-next-line no-console
    console.log('Smoke test passed.');
  } finally {
    server.close();
  }
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Smoke test failed:', error.message);
  process.exit(1);
});
