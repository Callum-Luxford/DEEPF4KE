const express = require("express");
const { uploadFace, uploadReel } = require("../controllers/uploadController");
const multer = require("multer");
const path = require("path");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.mimetype.startsWith("image")
      ? path.resolve(__dirname, "..", "uploads", "faces")
      : path.resolve(__dirname, "..", "uploads", "reels");

    // Ensure the folder exists before saving the file
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/face",
  authenticateUser,
  (req, res, next) => {
    console.log("Incoming fields:", req.body, req.file);
    next();
  },
  upload.single("face"),
  uploadFace
);

// PROTECTED ROUTES
router.post("/face", authenticateUser, upload.single("face"), uploadFace);
router.post("/reel", authenticateUser, upload.single("reel"), uploadReel);

module.exports = router;
