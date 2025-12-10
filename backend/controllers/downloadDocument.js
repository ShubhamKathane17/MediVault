const db = require("../accessor/databaseAccessor");

module.exports = function downloadDocument(req, res) {
  const { id } = req.params;

  db.get(
    `SELECT * FROM documents WHERE id = ?`,
    [id],
    (err, row) => {
      if (!row) {
        return res.status(404).json({ error: "File not found" });
      }
      res.download(row.filepath, row.filename);
    }
  );
};
