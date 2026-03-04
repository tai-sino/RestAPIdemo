const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const { applyMigrations } = require('./migrations');
const { seedDatabase } = require('./seed');

let SQL;
let db;
let dbFilePath;

function ensureDirectory(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function ensureInitialized() {
  if (!db) {
    throw new Error('Database not initialized.');
  }
}

function persist() {
  if (!db || !dbFilePath) {
    return;
  }
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbFilePath, buffer);
}

function runPrepared(sql, params = []) {
  ensureInitialized();
  const stmt = db.prepare(sql);
  stmt.run(params);
  stmt.free();
  return {
    changes: db.getRowsModified(),
    lastInsertId: query('SELECT last_insert_rowid() AS id')[0]?.id || null,
  };
}

function query(sql, params = []) {
  ensureInitialized();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function run(sql, params = []) {
  const result = runPrepared(sql, params);
  persist();
  return result;
}

function transaction(work) {
  ensureInitialized();
  try {
    db.run('BEGIN TRANSACTION;');
    const tx = {
      query: (sql, params = []) => query(sql, params),
      run: (sql, params = []) => runPrepared(sql, params),
    };
    const result = work(tx);
    db.run('COMMIT;');
    persist();
    return result;
  } catch (error) {
    try {
      db.run('ROLLBACK;');
    } catch (rollbackError) {
      // no-op
    }
    throw error;
  }
}

function getDatabaseHealth() {
  try {
    query('SELECT 1 AS ok');
    return 'ok';
  } catch (error) {
    return 'error';
  }
}

function getDbFilePath() {
  return dbFilePath;
}

function bootstrapSchemaAndSeed() {
  applyMigrations(db);
  seedDatabase({ query, run });
}

async function initDatabase() {
  if (db) {
    return;
  }

  dbFilePath = path.resolve(process.cwd(), process.env.DB_FILE || './data/library.db');
  ensureDirectory(dbFilePath);

  SQL = await initSqlJs({
    locateFile: (file) => path.join(__dirname, '../../node_modules/sql.js/dist', file),
  });

  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    db = new SQL.Database(fileBuffer);
    db.run('PRAGMA foreign_keys = ON;');
    applyMigrations(db);
  } else {
    db = new SQL.Database();
    bootstrapSchemaAndSeed();
    persist();
  }
}

async function resetDatabase() {
  if (!SQL) {
    await initDatabase();
  }
  db = new SQL.Database();
  bootstrapSchemaAndSeed();
  persist();
}

module.exports = {
  initDatabase,
  resetDatabase,
  getDatabaseHealth,
  getDbFilePath,
  query,
  run,
  transaction,
};
