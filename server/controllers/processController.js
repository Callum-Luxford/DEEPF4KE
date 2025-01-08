const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const File = require("../models/File");

exports.processFile = async (req, res) => {
  console.log("Request received at /process");
  console.log("Request body:", req.body);

  try {
    const { imageIds, videoIds } = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized. User not logged in." });
    }

    if (!Array.isArray(imageIds) || !Array.isArray(videoIds)) {
      return res
        .status(400)
        .json({ error: "Image IDs and Video IDs must be arrays" });
    }

    const images = await File.find({ _id: { $in: imageIds } });
    const videos = await File.find({ _id: { $in: videoIds } });

    if (images.length === 0 || videos.length === 0) {
      return res.status(404).json({ error: "Files not found" });
    }

    const outputDirectory = path.join(__dirname, "../uploads/outputs");
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
      console.log("Output directory created.");
    }

    const downloadLinks = [];

    for (const image of images) {
      for (const video of videos) {
        const uniqueFilename = `output_${Date.now()}_${image._id}_${
          video._id
        }.mp4`;
        const outputPath = path.join(outputDirectory, uniqueFilename);

        console.log("Spawning Python process...");
        console.log("Source Image Path:", image.path);
        console.log("Input Video Path:", video.path);
        console.log("Output Path:", outputPath);

        await new Promise((resolve, reject) => {
          const pythonProcess = spawn("python", [
            path.join(__dirname, "../../roop/run.py"),
            "-s",
            image.path,
            "-t",
            video.path,
            "-o",
            outputPath,
            "--execution-provider",
            "cuda",
          ]);

          pythonProcess.stdout.on("data", (data) =>
            console.log(`Python stdout: ${data}`)
          );
          pythonProcess.stderr.on("data", (data) =>
            console.error(`Python stderr: ${data}`)
          );

          pythonProcess.on("close", async (code) => {
            if (code !== 0) {
              console.error("Python script exited with code:", code);
              return reject(new Error("Error processing file"));
            }

            if (!fs.existsSync(outputPath)) {
              console.error("Output file was not created at:", outputPath);
              return reject(new Error("Output file not found"));
            }

            // Save metadata and add download link
            try {
              const outputFile = await File.create({
                originalName: uniqueFilename,
                filename: uniqueFilename,
                path: outputPath,
                mimetype: "video/mp4",
                size: fs.statSync(outputPath).size,
                uploadedBy: req.user.id, // Ensure this is defined
                type: "output",
              });

              const downloadLink = `${req.protocol}://${req.get(
                "host"
              )}/uploads/outputs/${uniqueFilename}`;

              downloadLinks.push(downloadLink);

              // Schedule file deletion after 10 minutes
              setTimeout(() => {
                try {
                  fs.unlinkSync(outputPath);
                  console.log(
                    "Temporary file deleted after timeout:",
                    outputPath
                  );
                } catch (err) {
                  console.error(
                    "Error deleting temporary file after timeout:",
                    err
                  );
                }
              }, 10 * 60 * 1000); // 10 minutes

              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    }

    // Respond with all download links
    res.status(200).json({
      message: "Files processed successfully",
      downloadLinks,
    });
  } catch (error) {
    console.error("Error processing files:", error.message, error.stack);
    res.status(500).json({ error: "Error processing files" });
  }
};
