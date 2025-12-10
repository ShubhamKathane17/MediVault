const express = require("express");
const upload = require("../accessor/diskAccessor");
const downloadDocument= require("../controllers/downloadDocument");
const uploadDocument = require("../controllers/uploadDocument");
const listDocuments = require("../controllers/listDocuments");
const deleteDocument = require("../controllers/deleteDocument");

const router = express.Router();

router.post("/upload", uploadDocument);
router.get("/", listDocuments);
router.get("/:id", downloadDocument);
router.delete("/:id", deleteDocument);

module.exports = router;
