const Database = require("better-sqlite3");
const db = new Database("./documents.db");

// Create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_name TEXT,
    stored_name TEXT,
    path TEXT,
    filesize INTEGER,
    created_at TEXT
  )
`).run();

module.exports = db;
