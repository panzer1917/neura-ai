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

app.post("/api/chat", (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({
      error: "Message is required"
    });
  }

  res.json({
    reply: "NEURA mesajını qəbul etdi: " + message
  });
});

app.listen(PORT, () => {
  console.log("NEURA server started on port " + PORT);
});