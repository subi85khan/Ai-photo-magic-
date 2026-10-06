const express = require("express");
const multer = require("multer");
const { InferenceClient } = require("@huggingface/inference");

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

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({
        error: "HF_TOKEN missing hai."
      });
    }

    const prompt =
      req.body.prompt || "Enhance this photo naturally.";

    const client = new InferenceClient(
      process.env.HF_TOKEN
    );

    const result = await client.imageToImage({
      model: "black-forest-labs/FLUX.2-klein-9B",
      inputs: req.file.buffer,
      prompt: prompt
    });

    const resultBuffer = Buffer.from(
      await result.arrayBuffer()
    );

    const outputImage =
      `data:image/png;base64,${resultBuffer.toString("base64")}`;

    res.json({
      image: outputImage
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      error: error.message || "AI image generation failed."
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Ai Photo Magic Backend running on port ${PORT}`
  );
});
