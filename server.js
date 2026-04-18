const express = require("express");
const fetch = require('node-fetch');
const multer = require("multer");
const cors = require("cors");

const upload = multer();
const app = express();

app.use(cors());
app.use(express.json());

// 🔐 SAFE KEYS
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OCR_API_KEY = process.env.OCR_API_KEY;

// 🔹 TEXT SOLVE
app.post("/solve", async (req, res) => {
  const question = req.body.question;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Solve step by step:\n${question}` }] }]
        })
      }
    );

    const data = await response.json();

    if (!data.candidates) {
      return res.json({ answer: "❌ API Error" });
    }

    const answer = data.candidates[0].content.parts[0].text;
    res.json({ answer });

  } catch (err) {
    res.json({ answer: "❌ Error solving problem" });
  }
});

// 🔹 IMAGE OCR + SOLVE
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const base64 = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    // OCR
    const ocrRes = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: { "apikey": OCR_API_KEY },
      body: new URLSearchParams({
        base64Image: `data:${mimeType};base64,${base64}`
      })
    });

    const ocrData = await ocrRes.json();
    const text = ocrData.ParsedResults?.[0]?.ParsedText || "";

    if (!text) {
      return res.json({ answer: "❌ No text found in image" });
    }

    // AI Solve
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Solve step by step:\n${text}` }] }]
        })
      }
    );

    const aiData = await aiRes.json();

    if (!aiData.candidates) {
      return res.json({ answer: "❌ AI Error" });
    }

    const answer = aiData.candidates[0].content.parts[0].text;
    res.json({ answer });

  } catch (err) {
    res.json({ answer: "❌ Error processing image" });
  }
});

// ✅ CORRECT PORT
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log("✅ Server running on port " + PORT);
// });

// ✅ ADD THIS
module.exports = app;
