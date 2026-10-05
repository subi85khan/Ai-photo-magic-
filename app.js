const API_URL = "https://ai-photo-magic-1-7n3d.onrender.com";

const upload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");

if (upload) {
  upload.addEventListener("change", () => {
    const file = upload.files[0];
    if (file && preview) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });
}

if (generateBtn) {
  generateBtn.addEventListener("click", async () => {
    const file = upload?.files[0];

    if (!file) {
      alert("पहले फोटो upload करें");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("prompt", promptInput?.value || "");

    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";

    try {
      const response = await fetch(`${API_URL}/api/edit`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      if (data.image) {
        preview.src = data.image;
      } else {
        alert("AI model अभी connect नहीं है।");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate AI Photo";
    }
  });
}
