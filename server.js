const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://panzer1917.github.io");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/", (req, res) => {
  res.send("NEURA AI Server is running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "API key is missing"
      });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction:
          "Sən NEURA adlı süni intellektsən. İstifadəçi ilə Azərbaycan dilində səmimi, ağıllı və aydın danış. Sualı diqqətlə cavablandır."
      }
    });

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error("NEURA AI Error:", error);

    res.status(500).json({
      error: "NEURA hazırda cavab verə bilmir."
    });
  }
});

app.listen(PORT, () => {
  console.log("NEURA server started on port " + PORT);
});