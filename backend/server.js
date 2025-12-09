const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("./database");

const app = express();
const PORT = 5000;

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());

/* ---------- Ensure uploads folder ---------- */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ---------- Multer Configuration ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"), false);
    }
  }
});

/* ---------- ROUTES ---------- */

/* Upload PDF */
app.post("/documents/upload", upload.single("file"), (req, res) => {
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

/* List all documents */
app.get("/documents", (req, res) => {
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
});

/* Download document */
app.get("/documents/:id", (req, res) => {
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
});

/* Delete document */
app.delete("/documents/:id", (req, res) => {
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
});

/* ---------- Server Start ---------- */
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
