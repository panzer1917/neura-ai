const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("NEURA AI Server is running!");
});

app.listen(3000, () => {
  console.log("NEURA server started!");
});
