const db = require("../accessor/databaseAccessor");

module.exports = function listDocuments(req, res) {
  db.all(
    `SELECT id, filename, filesize, created_at FROM documents ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(rows);
    }
  );
};
