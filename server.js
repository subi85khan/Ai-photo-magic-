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

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({
        error: "HF_TOKEN missing hai."
      });
    }

    const prompt =
      req.body.prompt || "Enhance this photo naturally.";

    const imageBase64 = req.file.buffer.toString("base64");
   const client = new InferenceClient({
  provider: "auto",
  apiKey: process.env.HF_TOKEN
});

const result = await client.imageToImage(
  req.file.buffer,
  {
    model: "Qwen/Qwen-Image-Edit",
    prompt: prompt
  }
);
const resultBuffer = Buffer.from(await result.arrayBuffer());

const outputImage =
  `data:image/png;base64,${resultBuffer.toString("base64")}`;

res.json({
  image: outputImage
});
    if (!response.ok) {
      const errorText = await response.text();

      console.error("Hugging Face ERROR:", errorText);

      return res.status(response.status).json({
        error: `Hugging Face error: ${errorText}`
      });
    }

    const resultBuffer = Buffer.from(
      await response.arrayBuffer()
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
