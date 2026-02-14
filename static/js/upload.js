// ===== Upload & Preview Logic =====
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const preview = document.getElementById("preview");
const dropText = document.getElementById("drop-text");

// Click on drop area to trigger file input
dropArea.addEventListener("click", () => fileInput.click());

// Handle file selection
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) showPreview(file);
});

// Drag & drop functionality
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#009acd";
});

dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#00bfff";
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
        fileInput.files = e.dataTransfer.files;
        showPreview(file);
    }
});

// Preview function
function showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = "block";
        dropText.style.display = "none";
    };
    reader.readAsDataURL(file);
}

// Show image if already uploaded (Flask variable)
if (typeof image_url !== 'undefined' && image_url) {
    preview.style.display = "block";
    dropText.style.display = "none";
    preview.src = image_url;
}
