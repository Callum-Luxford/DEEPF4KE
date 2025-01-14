// const faceUploadArea = document.getElementById("face-upload-area");
// const reelUploadArea = document.getElementById("reel-upload-area");
// const processBtn = document.getElementById("process-btn");
// const processStatus = document.getElementById("process-status");
// const outputsContainer = document.getElementById("outputs");

// // Store uploaded files and IDs
// let faceFile = null; // Single face file
// let faceId = ""; // Single face ID
// let reelFiles = []; // Multiple reel files
// let reelIds = []; // Uploaded reel IDs from the server

// // Render Face Upload
// const renderFaceUpload = () => {
//   faceUploadArea.innerHTML = ""; // Clear the upload area
//   if (faceFile) {
//     const wrapper = document.createElement("div");
//     wrapper.className = "uploaded-item face-wrapper";

//     const img = document.createElement("img");
//     img.src = URL.createObjectURL(faceFile);
//     img.className = "uploaded-image";

//     const buttonContainer = document.createElement("div");
//     buttonContainer.className = "button-container";

//     const removeBtn = document.createElement("button");
//     removeBtn.textContent = "Remove";
//     removeBtn.className = "remove-btn";
//     removeBtn.addEventListener("click", () => {
//       faceFile = null;
//       faceId = "";
//       renderFaceUpload(); // Re-render
//     });

//     const swapBtn = document.createElement("button");
//     swapBtn.textContent = "Swap";
//     swapBtn.className = "swap-btn";
//     swapBtn.addEventListener("click", () => {
//       const input = document.createElement("input");
//       input.type = "file";
//       input.accept = "image/*";
//       input.addEventListener("change", (e) =>
//         handleFaceUpload(e.target.files[0])
//       );
//       input.click();
//     });

//     buttonContainer.appendChild(removeBtn);
//     buttonContainer.appendChild(swapBtn);

//     wrapper.appendChild(img);
//     wrapper.appendChild(buttonContainer);
//     faceUploadArea.appendChild(wrapper);
//   } else {
//     const uploadButtonWrapper = document.createElement("div");
//     uploadButtonWrapper.className = "upload-more";
//     uploadButtonWrapper.innerHTML = `
//       <p>Click to upload a face image</p>
//       <input type="file" id="face-upload" accept="image/*" />
//     `;
//     uploadButtonWrapper
//       .querySelector("input")
//       .addEventListener("change", (e) => handleFaceUpload(e.target.files[0]));
//     faceUploadArea.appendChild(uploadButtonWrapper);
//   }
// };

// // Render Reel Uploads
// const renderReelUploads = () => {
//   reelUploadArea.innerHTML = ""; // Clear the upload area
//   reelFiles.forEach((file, index) => {
//     const wrapper = document.createElement("div");
//     wrapper.className = "uploaded-item reel-wrapper";

//     const video = document.createElement("video");
//     video.src = URL.createObjectURL(file);
//     video.controls = true;
//     video.className = "uploaded-video";

//     const buttonContainer = document.createElement("div");
//     buttonContainer.className = "button-container";

//     const removeBtn = document.createElement("button");
//     removeBtn.textContent = "Remove";
//     removeBtn.className = "remove-btn";
//     removeBtn.addEventListener("click", () => {
//       reelFiles.splice(index, 1);
//       reelIds.splice(index, 1); // Remove the corresponding ID
//       renderReelUploads(); // Re-render
//     });

//     const swapBtn = document.createElement("button");
//     swapBtn.textContent = "Swap";
//     swapBtn.className = "swap-btn";
//     swapBtn.addEventListener("click", () => {
//       const input = document.createElement("input");
//       input.type = "file";
//       input.accept = "video/*";
//       input.addEventListener("change", (e) =>
//         handleReelSwap(e.target.files[0], index)
//       );
//       input.click();
//     });

//     buttonContainer.appendChild(removeBtn);
//     buttonContainer.appendChild(swapBtn);

//     wrapper.appendChild(video);
//     wrapper.appendChild(buttonContainer);
//     reelUploadArea.appendChild(wrapper);
//   });

//   // Add upload button for more reels
//   const uploadButtonWrapper = document.createElement("div");
//   uploadButtonWrapper.className = "upload-more";
//   uploadButtonWrapper.innerHTML = `
//     <p>Click to upload reel videos</p>
//     <input type="file" id="reel-upload" accept="video/*" multiple />
//   `;
//   uploadButtonWrapper
//     .querySelector("input")
//     .addEventListener("change", (e) =>
//       handleReelUpload(Array.from(e.target.files))
//     );
//   reelUploadArea.appendChild(uploadButtonWrapper);
// };

// // Handle Face Upload
// const handleFaceUpload = async (file) => {
//   faceFile = file;
//   renderFaceUpload();

//   const formData = new FormData();
//   formData.append("face", file);

//   try {
//     const response = await fetch("/upload/face", {
//       method: "POST",
//       body: formData,
//       credentials: "include",
//     });

//     if (!response.ok) throw new Error("Failed to upload face image");

//     const result = await response.json();
//     faceId = result.file._id;
//     console.log("Uploaded Face ID:", faceId);
//   } catch (error) {
//     console.error("Error uploading face image:", error);
//   }
// };

// // Handle Reel Upload
// const handleReelUpload = async (newFiles) => {
//   reelFiles = reelFiles.concat(newFiles);
//   renderReelUploads();

//   for (const file of newFiles) {
//     const formData = new FormData();
//     formData.append("reel", file);

//     try {
//       const response = await fetch("/upload/reel", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       if (!response.ok) throw new Error("Failed to upload reel video");

//       const result = await response.json();
//       reelIds.push(result.file._id);
//       console.log("Uploaded Reel ID:", result.file._id);
//     } catch (error) {
//       console.error("Error uploading reel video:", error);
//     }
//   }
// };

// // Handle Reel Swap
// const handleReelSwap = async (file, index) => {
//   reelFiles[index] = file; // Replace the file
//   renderReelUploads();

//   const formData = new FormData();
//   formData.append("reel", file);

//   try {
//     const response = await fetch("/upload/reel", {
//       method: "POST",
//       body: formData,
//       credentials: "include",
//     });

//     if (!response.ok) throw new Error("Failed to upload reel video");

//     const result = await response.json();
//     reelIds[index] = result.file._id; // Update the ID
//     console.log("Swapped Reel ID:", result.file._id);
//   } catch (error) {
//     console.error("Error swapping reel video:", error);
//   }
// };

// // Process Button Logic
// processBtn.addEventListener("click", async () => {
//   console.log("Generate button clicked!");

//   if (!faceId || reelIds.length === 0) {
//     processStatus.textContent =
//       "Please upload exactly one face image and at least one reel video.";
//     return;
//   }

//   processStatus.style.display = "block";
//   processStatus.textContent = "Processing...";

//   try {
//     const response = await fetch("/process/process", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ imageIds: [faceId], videoIds: reelIds }),
//     });

//     if (!response.ok) throw new Error("Processing failed");

//     const result = await response.json();
//     outputsContainer.innerHTML = "";

//     // Display outputs
//     result.downloadLinks.forEach((link) => {
//       const wrapper = document.createElement("div");
//       wrapper.className = "output-item";

//       const video = document.createElement("video");
//       video.src = link;
//       video.controls = true;

//       const downloadBtn = document.createElement("a");
//       downloadBtn.href = link;
//       downloadBtn.textContent = "Download Video";
//       downloadBtn.download = link.split("/").pop();

//       wrapper.appendChild(video);
//       wrapper.appendChild(downloadBtn);
//       outputsContainer.appendChild(wrapper);
//     });

//     processStatus.textContent = "Processing completed!";
//   } catch (error) {
//     console.error("Error during processing:", error);
//     processStatus.textContent = "Error during processing.";
//   } finally {
//     processStatus.style.display = "none";
//   }
// });

// // Initial Render
// renderFaceUpload();
// renderReelUploads();
