const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello from server!");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello!");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
