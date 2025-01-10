const faceInput = document.getElementById("face-upload");
const reelInput = document.getElementById("reel-upload");
const processBtn = document.getElementById("process-btn");
const processStatus = document.getElementById("process-status");

// Dynamically fetched IDs after file upload
let faceId = ""; // Initially empty
let reelId = ""; // Initially empty

// Upload Face Image
faceInput.addEventListener("change", async (e) => {
  console.log("Face input changed:", e.target.files[0]);

  const formData = new FormData();
  formData.append("face", e.target.files[0]);

  try {
    const response = await fetch("/upload/face", {
      method: "POST",
      body: formData,
      credentials: "include", // Include cookies/session
    });

    if (!response.ok) throw new Error("Failed to upload face image");

    const result = await response.json();
    faceId = result.file._id; // Capture the returned ID
    console.log("Uploaded Face ID:", faceId);
  } catch (error) {
    console.error("Error uploading face image:", error);
    processStatus.textContent = "Error uploading face image.";
  }
});

// Upload Reel Video
reelInput.addEventListener("change", async (e) => {
  console.log("Reel input changed:", e.target.files[0]);

  const formData = new FormData();
  formData.append("reel", e.target.files[0]);

  try {
    const response = await fetch("/upload/reel", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to upload reel video");

    const result = await response.json();
    reelId = result.file._id; // Capture the returned ID
    console.log("Uploaded Reel ID:", reelId);
  } catch (error) {
    console.error("Error uploading reel video:", error);
    processStatus.textContent = "Error uploading reel video.";
  }
});

// Process Button Click
processBtn.addEventListener("click", async () => {
  console.log("Generate button clicked!");

  if (!faceId || !reelId) {
    console.error("Missing faceId or reelId");
    processStatus.textContent = "Please upload both face image and reel video.";
    return;
  }

  processStatus.style.display = "block";
  processStatus.textContent = "Processing...";

  try {
    const response = await fetch("/process/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageIds: [faceId], videoIds: [reelId] }),
    });

    if (!response.ok) {
      throw new Error("Processing failed");
    }

    const result = await response.json();
    console.log("Processing result:", result);

    // Clear existing outputs
    const outputsContainer = document.getElementById("outputs");
    outputsContainer.innerHTML = "";

    // Populate outputs dynamically
    result.downloadLinks.forEach((link) => {
      // Create a wrapper for each output
      const outputWrapper = document.createElement("div");
      outputWrapper.className = "output-item"; // Use for individual styling

      // Create a video element
      const videoElement = document.createElement("video");
      videoElement.src = link;
      videoElement.controls = true;
      videoElement.className = "output-video"; // Optional for styling

      // Create a download button
      const downloadButton = document.createElement("a");
      downloadButton.href = link;
      downloadButton.textContent = "Download Video";
      downloadButton.download = link.split("/").pop();
      downloadButton.className = "output-download"; // Optional for styling

      // Append video and download button to wrapper
      outputWrapper.appendChild(videoElement);
      outputWrapper.appendChild(downloadButton);

      // Append wrapper to outputs container
      outputsContainer.appendChild(outputWrapper);
    });

    processStatus.textContent =
      "Processing completed! Outputs are displayed below.";
  } catch (error) {
    console.error("Error during processing:", error);
    processStatus.textContent = "Error during processing.";
  } finally {
    processStatus.style.display = "none";
  }
});

