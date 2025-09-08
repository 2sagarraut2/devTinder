const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  // creating new instance of user model
  const user = new User({
    firstName: "Komal",
    lastName: "Raut",
    emailId: "komal@gmail.com",
    password: "Komal@123",
  });

  try {
    await user.save();
    res.json({ message: "User saved successfully!" });
  } catch (err) {
    res.status(400).send("Error occured while saving user " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established!");
    app.listen(7777, () => {
      console.log("Server started on port 7777");
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Full error:", err);
  });
