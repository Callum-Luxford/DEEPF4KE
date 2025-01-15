const faceUploadArea = document.getElementById("face-upload-area");
const reelUploadArea = document.getElementById("reel-upload-area");
const processBtn = document.getElementById("process-btn");
const processStatus = document.getElementById("process-status");
const outputsContainer = document.getElementById("outputs");

let faceFile = null;
let faceId = "";
let reelFiles = [];
let reelIds = [];

const renderFaceUpload = () => {
  const container = faceUploadArea.querySelector(
    ".content-input-container.container-img"
  );
  const imgElement = container.querySelector("img");
  const buttonContainer = container.querySelector(".swap-remove-container");
  const notificationContainer = faceUploadArea.querySelector(
    ".content-description-container .content-description-text"
  );

  if (faceFile) {
    imgElement.src = URL.createObjectURL(faceFile);
    buttonContainer.style.display = "flex";
    if (notificationContainer)
      notificationContainer.querySelector(".upload-message")?.remove();

    const swapBtn = buttonContainer.querySelector(".swap");
    swapBtn.replaceWith(swapBtn.cloneNode(true));
    buttonContainer.querySelector(".swap").addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.addEventListener("change", (e) => {
        faceFile = null; // Reset the existing file
        handleFaceUpload(e.target.files[0]);
      });
      input.click();
    });

    const removeBtn = buttonContainer.querySelector(".remove");
    removeBtn.replaceWith(removeBtn.cloneNode(true));
    buttonContainer.querySelector(".remove").addEventListener("click", () => {
      faceFile = null;
      faceId = "";
      renderFaceUpload();
    });
  } else {
    imgElement.src = "../images/image.png";
    buttonContainer.style.display = "none";
  }
};

const handleFaceUpload = async (file) => {
  const notificationContainer = faceUploadArea.querySelector(
    ".content-description-container .content-description-text"
  );
  if (faceFile) {
    if (notificationContainer) {
      notificationContainer.querySelector(".upload-message")?.remove();
      const message = document.createElement("p");
      message.className = "upload-message";
      message.style.color = "red";
      message.style.marginTop = "2rem";
      message.textContent = "You can only upload one face image at a time.";
      notificationContainer.appendChild(message);

      setTimeout(() => {
        message.remove();
      }, 5000); // Remove message after 5 seconds
    }
    return;
  }

  faceFile = file;
  renderFaceUpload();

  const formData = new FormData();
  formData.append("face", file);

  try {
    const response = await fetch("/upload/face", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to upload face image");

    const result = await response.json();
    faceId = result.file._id;
    console.log("Uploaded Face ID:", faceId);
  } catch (error) {
    console.error("Error uploading face image:", error);
  }
};

const renderReelUploads = () => {
  const container = reelUploadArea.querySelector(
    ".content-input-container.container-vid"
  );
  container.innerHTML = ""; // Clear existing content

  reelFiles.forEach((file, index) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.controls = true;
    video.className = "uploaded-video"; // Ensure class for styling

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "swap-remove-container";

    const removeBtnBorder = document.createElement("div");
    removeBtnBorder.className = "swap-remove-btn-border";

    const removeBtn = document.createElement("div");
    removeBtn.className = "remove btn dashboard-btn";
    removeBtn.textContent = "Remove";
    removeBtnBorder.appendChild(removeBtn);

    removeBtn.addEventListener("click", () => {
      reelFiles.splice(index, 1);
      reelIds.splice(index, 1); // Remove corresponding reel ID
      renderReelUploads();
    });

    const swapBtnBorder = document.createElement("div");
    swapBtnBorder.className = "swap-remove-btn-border";

    const swapBtn = document.createElement("div");
    swapBtn.className = "swap btn dashboard-btn";
    swapBtn.textContent = "Swap";
    swapBtnBorder.appendChild(swapBtn);

    swapBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";
      input.addEventListener("change", (e) => {
        handleReelSwap(e.target.files[0], index);
      });
      input.click();
    });

    buttonContainer.appendChild(swapBtnBorder);
    buttonContainer.appendChild(removeBtnBorder);
    container.appendChild(video);
    container.appendChild(buttonContainer);
  });

  if (reelFiles.length === 0) {
    const placeholder = document.createElement("img");
    placeholder.src = "../images/reel.png";
    placeholder.alt = "Reel Placeholder";
    placeholder.className = "reel-icon"; // Consistent with styling
    container.appendChild(placeholder);
  }
};

const handleReelUpload = async (newFiles) => {
  reelFiles = reelFiles.concat(newFiles);
  renderReelUploads();

  for (const file of newFiles) {
    const formData = new FormData();
    formData.append("reel", file);

    try {
      const response = await fetch("/upload/reel", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to upload reel video");

      const result = await response.json();
      reelIds.push(result.file._id);
      console.log("Uploaded Reel ID:", result.file._id);
    } catch (error) {
      console.error("Error uploading reel video:", error);
    }
  }
};

const handleReelSwap = async (file, index) => {
  reelFiles[index] = file;
  renderReelUploads();

  const formData = new FormData();
  formData.append("reel", file);

  try {
    const response = await fetch("/upload/reel", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to upload reel video");

    const result = await response.json();
    reelIds[index] = result.file._id;
    console.log("Swapped Reel ID:", result.file._id);
  } catch (error) {
    console.error("Error swapping reel video:", error);
  }
};

const renderOutput = (processedReel, link, isReady) => {
  const outputContainer = document.createElement("div");
  outputContainer.className = "output-reel";

  const reelVideoContainer = document.createElement("div");
  reelVideoContainer.className = "reel-video";

  // Replace placeholder with processed reel video
  reelVideoContainer.innerHTML = "";
  if (isReady) {
    const video = document.createElement("video");
    video.src = link; // Use the processed video URL
    video.controls = true;
    video.className = "output-reel-video"; // Class for CSS control
    reelVideoContainer.appendChild(video);
  } else {
    const placeholder = document.createElement("img");
    placeholder.src = "../images/reel.png";
    placeholder.alt = "Reel Placeholder";
    placeholder.className = "reel-icon";
    reelVideoContainer.appendChild(placeholder);
  }

  // Spinner and Download Icon
  const loadingSpinner = document.createElement("div");
  loadingSpinner.className = "loading-spinner";
  loadingSpinner.style.display = isReady ? "none" : "block"; // Hide spinner if ready

  const anchor = document.createElement("a");
  anchor.href = isReady ? link : "#";
  anchor.download = "output-video.mp4"; // Force download on click
  anchor.className = "download-icon";
  anchor.style.display = isReady ? "block" : "none"; // Show download icon if ready

  if (isReady) {
    const icon = document.createElement("img");
    icon.src = "../images/download.png";
    icon.alt = "Download Icon";
    anchor.appendChild(icon);
  }

  outputContainer.appendChild(reelVideoContainer);
  outputContainer.appendChild(loadingSpinner);
  outputContainer.appendChild(anchor);
  outputsContainer.appendChild(outputContainer);
};

const processFiles = async () => {
  if (!faceId || reelIds.length === 0) {
    processStatus.textContent =
      "Please upload exactly one face image and at least one reel video.";
    return;
  }

  processStatus.style.display = "block";
  processStatus.textContent = "Processing...";

  // Move the processStatus to the dashboard-title
  const dashboardTitle = document.querySelector(".dashboard-title");
  if (dashboardTitle) {
    dashboardTitle.appendChild(processStatus);
  }

  try {
    const response = await fetch("/process/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageIds: [faceId], videoIds: reelIds }),
    });

    if (!response.ok) throw new Error("Processing failed");

    const result = await response.json();
    outputsContainer.innerHTML = "";

    result.downloadLinks.forEach((link, index) => {
      renderOutput(reelFiles[index], link, true);
    });

    processStatus.textContent = "Processing completed!";
  } catch (error) {
    console.error("Error during processing:", error);
    processStatus.textContent = "Error during processing.";
  } finally {
    processStatus.style.display = "none";
  }
};

processBtn.addEventListener("click", () => {
  if (!faceFile || reelFiles.length === 0) {
    const notificationContainer = document.querySelector(".dashboard-title");

    if (notificationContainer) {
      notificationContainer.querySelector(".generate-message")?.remove();

      const message = document.createElement("p");
      message.className = "generate-message";
      message.style.color = "red";
      message.textContent =
        "Both the face image and at least one reel must be uploaded.";
      notificationContainer.appendChild(message);

      setTimeout(() => {
        message.remove();
      }, 5000);
    }

    processStatus.textContent =
      "Please upload exactly one face image and at least one reel video.";
    processStatus.style.color = "red";
    setTimeout(() => {
      processStatus.textContent = "";
    }, 5000);

    return;
  }

  const spinnerElements = document.querySelectorAll(".loading-spinner");
  spinnerElements.forEach((spinner) => {
    spinner.style.display = "block";
  });

  const downloadIcons = document.querySelectorAll(".download-icon");
  downloadIcons.forEach((icon) => {
    icon.style.display = "none";
  });

  // Show loading-bar
  const loadingBars = document.querySelectorAll(".loading-bar");
  loadingBars.forEach((loadingBar) => {
    loadingBar.style.display = "block"; // Make loading-bar visible
    loadingBar.style.setProperty("--width", 0); // Reset progress

    // Animate the progress bar
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      loadingBar.style.setProperty("--width", progress);
      if (progress >= 100) {
        clearInterval(interval); // Stop when full
      }
    }, 300); // Adjust speed as needed
  });
});

processBtn.addEventListener("click", processFiles);

document.querySelector(".upload-btn.btn").addEventListener("click", () => {
  const notificationContainer = faceUploadArea.querySelector(
    ".content-description-container .content-description-text"
  );

  // Check if a face image is already uploaded
  if (faceFile) {
    if (notificationContainer) {
      notificationContainer.querySelector(".upload-message")?.remove();

      const message = document.createElement("p");
      message.className = "upload-message";
      message.style.color = "red";
      message.style.marginTop = "2rem";
      message.textContent = "You can only upload one face image at a time.";
      notificationContainer.appendChild(message);

      setTimeout(() => {
        message.remove();
      }, 5000);
    }
    return;
  }

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", (e) => handleFaceUpload(e.target.files[0]));
  input.click();
});

document
  .querySelector("#reel-upload-area .upload-btn.btn")
  .addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.multiple = true;
    input.addEventListener("change", (e) =>
      handleReelUpload(Array.from(e.target.files))
    );
    input.click();
  });

// Link "choose-gallery" functionality for both face and reel sections
document.querySelectorAll(".choose-gallery").forEach((galleryBtn) => {
  galleryBtn.addEventListener("click", (event) => {
    const isFaceSection = event.target.closest("#face-upload-area") !== null;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = isFaceSection ? "image/*" : "video/*"; // Accept images for face, videos for reels
    input.addEventListener("change", (e) => {
      if (isFaceSection) {
        handleFaceUpload(e.target.files[0]);
      } else {
        handleReelUpload(Array.from(e.target.files));
      }
    });
    input.click();
  });
});

// Link "take-photo" functionality for both face and reel sections
document.querySelectorAll(".take-photo").forEach((photoBtn) => {
  photoBtn.addEventListener("click", (event) => {
    const isFaceSection = event.target.closest("#face-upload-area") !== null;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = isFaceSection ? "image/*" : "video/*"; // Accept images for face, videos for reels
    input.capture = isFaceSection ? "environment" : null; // For face, open camera; reels default
    input.addEventListener("change", (e) => {
      if (isFaceSection) {
        handleFaceUpload(e.target.files[0]);
      } else {
        handleReelUpload(Array.from(e.target.files));
      }
    });
    input.click();
  });
});

const loading_bar = document.getElementsByClassName("loading-bar")[0];
setInterval(() => {
  const computedStlye = getComputedStyle(loading_bar);
  const width = parseFloat(computedStlye.getPropertyValue("--width")) || 0;
  loading_bar.style.setProperty("--width", width + 0.1);
}, 5);

renderFaceUpload();
renderReelUploads();
