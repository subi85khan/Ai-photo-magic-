const API_URL = "https://ai-photo-magic-1-7n3d.onrender.com";

const upload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const clothesBtn = document.getElementById("clothesBtn");
const backgroundBtn = document.getElementById("backgroundBtn");
const enhanceBtn = document.getElementById("enhanceBtn");

// Photo preview
if (upload) {
  upload.addEventListener("change", () => {
    const file = upload.files[0];

    if (file && preview) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });
}

// AI Generate
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
        preview.style.display = "block";
      } else {
        alert("AI model अभी connect नहीं है।");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = "✨ Generate AI Photo";
    }
  });
}

// Clothes Change
if (clothesBtn) {
  clothesBtn.addEventListener("click", async () => {
    const file = upload?.files[0];

    if (!file) {
      alert("पहले फोटो upload करें");
      return;
    }

    const userPrompt =
      promptInput?.value || "stylish modern clothes";

    const formData = new FormData();
    formData.append("image", file);
    formData.append(
      "prompt",
      `Change only the person's clothes to: ${userPrompt}. Keep the face, body, hair, pose and background the same. Make the clothing realistic and natural.`
    );

    clothesBtn.disabled = true;
    clothesBtn.textContent = "Changing Clothes...";

    try {
      const response = await fetch(`${API_URL}/api/edit`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Clothes change failed");
      }

      if (data.image) {
        preview.src = data.image;
        preview.style.display = "block";
      }
    } catch (error) {
      alert(error.message);
    } finally {
      clothesBtn.disabled = false;
      clothesBtn.textContent = "👗 Clothes Change";
    }
  });
}

// Background Change
if (backgroundBtn) {
  backgroundBtn.addEventListener("click", async () => {
    const file = upload?.files[0];

    if (!file) {
      alert("पहले फोटो upload करें");
      return;
    }

    const userPrompt =
      promptInput?.value || "beautiful natural background";

    const formData = new FormData();
    formData.append("image", file);
    formData.append(
      "prompt",
      `Change only the background to: ${userPrompt}. Keep the person, face, hair, clothes, body and pose exactly the same. Make the new background realistic and natural.`
    );

    backgroundBtn.disabled = true;
    backgroundBtn.textContent = "Changing Background...";

    try {
      const response = await fetch(`${API_URL}/api/edit`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Background change failed");
      }

      if (data.image) {
        preview.src = data.image;
        preview.style.display = "block";
      }
    } catch (error) {
      alert(error.message);
    } finally {
      backgroundBtn.disabled = false;
      backgroundBtn.textContent = "🌄 Background Change";
    }
  });
}

// AI Enhance
if (enhanceBtn) {
  enhanceBtn.addEventListener("click", async () => {
    const file = upload?.files[0];

    if (!file) {
      alert("पहले फोटो upload करें");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append(
      "prompt",
      "Enhance this photo. Improve quality, sharpness, clarity and details. Keep the face, clothes, body, hair, pose and background exactly the same."
    );

    enhanceBtn.disabled = true;
    enhanceBtn.textContent = "✨ Enhancing...";

    try {
      const response = await fetch(`${API_URL}/api/edit`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI Enhance failed");
      }

      if (data.image) {
        preview.src = data.image;
        preview.style.display = "block";
      }
    } catch (error) {
      alert(error.message);
    } finally {
      enhanceBtn.disabled = false;
      enhanceBtn.textContent = "🔍 AI Enhance";
    }
  });
  
