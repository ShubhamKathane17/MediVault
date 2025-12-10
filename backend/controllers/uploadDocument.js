const upload = require("../accessor/diskAccessor");
const db = require("../accessor/databaseAccessor");

module.exports = function uploadDocument(req, res) {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { filename, path: filepath, size } = req.file;

    db.run(
      `INSERT INTO documents (filename, filepath, filesize) VALUES (?, ?, ?)`,
      [filename, filepath, size],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "File uploaded successfully" });
      }
    );
  });
};
