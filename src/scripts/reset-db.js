require('dotenv').config();
const { initDatabase, resetDatabase, getDbFilePath } = require('../db/sqlite');

async function main() {
  await initDatabase();
  await resetDatabase();
  // eslint-disable-next-line no-console
  console.log(`Database reset successfully: ${getDbFilePath()}`);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to reset database:', error.message);
  process.exit(1);
});
