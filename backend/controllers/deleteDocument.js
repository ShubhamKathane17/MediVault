const db = require("../accessor/databaseAccessor");
const fs = require("fs");

module.exports = function deleteDocument(req, res) {
  const { id } = req.params;

  db.get(
    `SELECT * FROM documents WHERE id = ?`,
    [id],
    (err, row) => {
      if (!row) {
        return res.status(404).json({ error: "File not found" });
      }

      fs.unlink(row.filepath, (err) => {
        if (err) {
          return res.status(500).json({ error: "File delete failed" });
        }

        db.run(
          `DELETE FROM documents WHERE id = ?`,
          [id],
          () => {
            res.json({ message: "File deleted successfully" });
          }
        );
      });
    }
  );
};
