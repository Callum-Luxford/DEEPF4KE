// Modules
const File = require("../models/File");

exports.uploadFace = async (req, res) => {
  try {
    // Check file was uploaded
    if (!req.file) {
      console.log("No face image uploaded");
      return res.status(400).json({ error: "No face image uploaded" });
    }
    // Log for debugging
    console.log("Uploaded Face File:", req.file);

    // Save metadata to MongoDB
    const file = new File({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      type: "input",
    });

    const savedFile = await file.save();
    console.log("Saved Metadata to MongoDB:", savedFile);

    // Respond success
    res.status(200).json({
      message: "Face image uploaded and metadata saved successfully",
      file: savedFile,
    });
  } catch (error) {
    console.error("error uploading face image:", error);
    res.status(500).json({ error: "Error uploading face image" });
  }
};

exports.uploadReel = async (req, res) => {
  try {
    // Ensure file was uploaded
    if (!req.file) {
      console.log("No video reel uploaded");
      return res.status(400).json({ error: "No video reel uploaded" });
    }

    // Log for debugging
    console.log("Uploaded Reel File:", req.file);

    // Save metadata to MongoDb
    const file = new File({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      type: "input",
    });

    const savedFile = await file.save();
    console.log("Saved Metadata to MongoDB:", savedFile);

    // Respond success
    res.status(200).json({
      message: "Video reel uploaded and metadata saved successfully",
      file: savedFile,
    });
  } catch (error) {
    console.error("Error uploading video reel:", error);
    res.status(500).json({ error: "Error uploading video reel" });
  }
};
