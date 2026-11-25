const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("NEURA AI Server is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`NEURA server started on port ${PORT}`);
});