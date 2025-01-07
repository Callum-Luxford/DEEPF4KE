const { spawn } = require("child_process");
const path = require("path");
const File = require("../models/File");
const fs = require("fs");

exports.processFile = async (req, res) => {
  console.log("Request received at /process");
  console.log("Request body:", req.body);

  try {
    const { imageId, videoId } = req.body;

    // Find the input files in MongoDB
    const sourceImage = await File.findById(imageId);
    const inputVideo = await File.findById(videoId);

    if (!sourceImage || !inputVideo) {
      return res.status(404).json({ error: "Files not found" });
    }

    const outputDirectory = path.join(__dirname, "../uploads/outputs");
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
      console.log("Output directory created.");
    }

    const outputPath = path.join(__dirname, "../uploads/outputs/output.mp4");

    console.log("Spawning Python process...");
    console.log("Source Image Path:", sourceImage.path);
    console.log("Input Video Path:", inputVideo.path);
    console.log("Output Path:", outputPath);

    // Spawn the Python process
    const pythonProcess = spawn("python", [
      path.join(__dirname, "../../roop/run.py"),
      "-s",
      sourceImage.path,
      "-t",
      inputVideo.path,
      "-o",
      outputPath,
      "--execution-provider",
      "cuda",
    ]);

    // Monitor Python script execution
    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error("Python script exited with code:", code);
        return res.status(500).json({ error: "Error processing file" });
      }

      if (!fs.existsSync(outputPath)) {
        console.error("Output file was not created at:", outputPath);
        return res.status(500).json({ error: "Output file not found" });
      }

      // Save metadata and respond
      try {
        const outputFile = await File.create({
          originalName: "output.mp4",
          filename: "output.mp4",
          path: outputPath,
          mimetype: "video/mp4",
          size: fs.statSync(outputPath).size,
          uploadedBy: req.user.id,
          type: "output",
        });

        const downloadLink = `${req.protocol}://${req.get(
          "host"
        )}/uploads/outputs/${outputFile.filename}`;
        res.status(200).json({
          message: "File processed successfully",
          downloadLink,
          file: outputFile,
        });
      } catch (error) {
        console.error("Error saving file metadata:", error);
        res.status(500).json({ error: "Error saving file metadata" });
      }
    });
  } catch (error) {
    console.error("Error processing file:", error.message, error.stack);
    res.status(500).json({ error: "Error processing file" });
  }
};
