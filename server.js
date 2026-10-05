const express = require("express");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.get("/", (req, res) => {
  res.send("Ai Photo Magic Backend is Live!");
});

app.post("/api/edit", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Photo upload nahi hui."
      });
    }

    const prompt = req.body.prompt || "Enhance this photo naturally.";

    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(500).json({
        error: "REPLICATE_API_TOKEN missing hai."
      });
    }

    // Replicate package load
    const { default: Replicate } = await import("replicate");

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN
    });

    // Uploaded photo ko data URL mein convert karna
    const mimeType = req.file.mimetype || "image/jpeg";
    const imageData =
      `data:${mimeType};base64,${req.file.buffer.toString("base64")}`;

    // AI image edit
    const output = await replicate.run(
      "black-forest-labs/flux-kontext-pro",
      {
        input: {
          prompt: prompt,
          input_image: imageData,
          aspect_ratio: "match_input_image",
          output_format: "jpg",
          safety_tolerance: 2
        }
      }
    );

    let imageUrl;

    if (output && typeof output.url === "function") {
      imageUrl = output.url();
    } else if (typeof output === "string") {
      imageUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      imageUrl =
        typeof output[0]?.url === "function"
          ? output[0].url()
          : output[0];
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: "AI image ka result nahi mila."
      });
    }

    res.json({
      image: imageUrl
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      error: error.message || "AI image generation failed."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Ai Photo Magic Backend running on port ${PORT}`);
});
