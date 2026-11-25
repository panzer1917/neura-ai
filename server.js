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

    let interaction;
    let attempts = 0;

    while (attempts < 3) {
      try {
        interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          input: message,
          system_instruction:
            "Sən NEURA adlı süni intellektsən. Azərbaycan dilində səmimi, ağıllı və aydın danış. İstifadəçinin suallarını diqqətlə cavablandır.",
          generation_config: {
            max_output_tokens: 4096,
            thinking_level: "high"
          }
        });

        break;

      } catch (error) {
        attempts++;

        if (attempts >= 3 || error.status !== 503) {
          throw error;
        }

        await new Promise(resolve =>
          setTimeout(resolve, 2000 * attempts)
        );
      }
    }

    if (!interaction || !interaction.output_text) {
      throw new Error("Gemini cavab qaytarmadı.");
    }

    res.json({
      reply: interaction.output_text
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