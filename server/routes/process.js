const express = require("express");
const { processFile } = require("../controllers/processController");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// Process route
router.post("/process", authenticateUser, processFile);

module.exports = router;
