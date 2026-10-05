const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.send("AI Photo Magic Backend is Live!");
});

app.post("/api/edit", upload.single("image"), async (req, res) => {
  res.status(501).json({
    error: "AI model is not connected yet."
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Photo Magic running on port ${PORT}`);
});
