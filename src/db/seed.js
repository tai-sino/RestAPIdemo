const bcrypt = require('bcryptjs');

function nowIso() {
  return new Date().toISOString();
}

function seedDatabase({ query, run }) {
  const usersCount = query('SELECT COUNT(*) AS count FROM users')[0]?.count || 0;
  if (usersCount > 0) {
    return;
  }

  const adminPassword = bcrypt.hashSync('admin123', 10);
  const userPassword = bcrypt.hashSync('123456', 10);
  const now = nowIso();

  run(
    `
      INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, 'admin', ?, ?)
    `,
    ['Library Admin', 'admin@library.local', adminPassword, now, now]
  );

  run(
    `
      INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, 'user', ?, ?)
    `,
    ['User One', 'user1@example.com', userPassword, now, now]
  );

  const sampleBooks = [
    ['Clean Code', 'Robert C. Martin', '9780132350884', 2008, 6, 6],
    ['Refactoring', 'Martin Fowler', '9780201485677', 1999, 4, 4],
    ['Design Patterns', 'Erich Gamma', '9780201633610', 1994, 5, 5],
    ['The Pragmatic Programmer', 'Andrew Hunt', '9780201616224', 1999, 7, 7],
    ['Code Complete', 'Steve McConnell', '9780735619678', 2004, 3, 3],
    ['Domain-Driven Design', 'Eric Evans', '9780321125217', 2003, 2, 2],
  ];

  sampleBooks.forEach((book) => {
    run(
      `
        INSERT INTO books (
          title, author, isbn, published_year, total_copies, available_copies, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [...book, now, now]
    );
  });
}

module.exports = {
  seedDatabase,
};
