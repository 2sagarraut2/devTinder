const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const { default: isEmail } = require("validator/lib/isEmail");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the data
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.json({ message: "User has been created successfully." });
  } catch (err) {
    res.status(400).send("Error occured while saving user " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("The email address provided is not valid.");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("The email or password you entered is incorrect.");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 12 * 36000000),
      });
      res.send("Login successful");
    } else {
      throw new Error("The email or password you entered is incorrect.");
    }
  } catch (err) {
    res
      .status(400)
      .send("An unexpected error occurred. Please try again later. " + err);
    console.log(err);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send({ message: "User retrieved successfully.", user });
  } catch (err) {
    res
      .status(400)
      .send("An unexpected error occurred. Please try again later. " + err);
    console.log(err);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send({ message: user.firstName + " send the connection request" });
  } catch (err) {
    res
      .status(400)
      .send("An unexpected error occurred. Please try again later. " + err);
    console.log(err);
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
