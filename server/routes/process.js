const express = require("express");
const { processFile } = require("../controllers/processController");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/process", authenticateUser, processFile);

module.exports = router;
