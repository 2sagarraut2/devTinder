const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.json({ message: "User saved successfully!" });
  } catch (err) {
    res.status(400).send("Error occured while saving user " + err.message);
  }
});

app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log(userId);

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(400).send({ message: "User not found", user });
    } else {
      res.json({ message: "Found the user!", user });
    }
  } catch (err) {
    console.log("Something went wrong", err);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });

    if (users.length === 0) {
      res.status(404).send({ message: "User not found!" });
    } else {
      res.json({ message: "User record found!", users });
    }
  } catch (err) {
    console.log("Something went wrong ", err);
  }

  res.json;
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.json({ message: "User record found!", users });
  } catch (err) {
    console.log("Something went wrong ", err);
  }
});

app.patch("/update", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(402).send("Invalid user id");
  }

  try {
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });

    console.log(updatedUser);

    if (!updatedUser) {
      res.status(400).send("User not found");
    } else {
      res.json({ message: "User updated successfully", updatedUser });
    }
  } catch (err) {
    console.log("Something went wrong ", err);
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
    console.error("Database connection failed");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Full error:", err);
  });
