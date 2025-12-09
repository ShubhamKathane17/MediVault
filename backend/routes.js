const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const router = express.Router();

// Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDFs allowed"));
    }
    cb(null, true);
  }
});

// --------------------
// Upload Route
// --------------------
router.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ error: "No file" });

  const stmt = db.prepare(`
    INSERT INTO documents (original_name, stored_name, path, filesize, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);

  stmt.run(
    file.originalname,
    file.filename,
    file.path,
    file.size,
    function () {
      return res.json({
        id: this.lastID,
        filename: file.originalname,
        filesize: file.size
      });
    }
  );
});

// --------------------
// List Route
// --------------------
router.get("/", (req, res) => {
  db.all("SELECT * FROM documents ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

// --------------------
// Download Route
// --------------------
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM documents WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ error: "Not found" });

    res.download(path.resolve(row.path), row.original_name);
  });
});

// --------------------
// Delete Route
// --------------------
router.delete("/:id", (req, res) => {
  db.get("SELECT * FROM documents WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ error: "Not found" });

    fs.unlink(row.path, () => {
      db.run("DELETE FROM documents WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    });
  });
});

module.exports = router;
