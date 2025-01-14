const fs = require("fs");
const path = require("path");

// Define folder paths
const facesFolder = path.join(__dirname, "../uploads/faces");
const reelsFolder = path.join(__dirname, "../uploads/reels");
const outputsFolder = path.join(__dirname, "../uploads/outputs");

// Function to delete old files
const deleteOldFiles = (folderPath, ageLimitInMinutes) => {
  const now = Date.now();

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Error reading folder ${folderPath}:`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for file ${filePath}:`, err);
          return;
        }

        const fileAgeInMinutes = (now - stats.mtimeMs) / (1000 * 60); // Convert from ms to minutes
        if (fileAgeInMinutes > ageLimitInMinutes) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filePath}:`, err);
            } else {
              console.log(`Deleted old file: ${filePath}`);
            }
          });
        }
      });
    });
  });
};

// Function to schedule periodic cleanup
const startCleanupTask = () => {
  const cleanupInterval = 5 * 60 * 1000; // Run every 5 minutes

  setInterval(() => {
    console.log("Running cleanup task...");
    deleteOldFiles(facesFolder, 1); // Delete files older than 10 minutes
    deleteOldFiles(reelsFolder, 1);
    deleteOldFiles(outputsFolder, 1);
  }, cleanupInterval);
};

module.exports = { startCleanupTask };
