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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create a JWT token
      const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

      // Add token to cookie and send response back to user

      // return token
      res.cookie("token", token);
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

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid token");
    }

    // validate the token
    const decodedMessage = await jwt.verify(token, process.env.SECRET_KEY);

    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!token) {
      throw new Error("User doesn't exists");
    }

    res.send("Welcome " + user);
  } catch (err) {
    res
      .status(400)
      .send("An unexpected error occurred. Please try again later. " + err);
    console.log(err);
  }
});

app.get("/user/:userId", async (req, res) => {
  const userId = req?.params?.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(400).send({
        message: "No user account found with the provided details.",
        user,
      });
    } else {
      res.json({ message: "User retrieved successfully.", user });
    }
  } catch (err) {
    res
      .status(400)
      .send("An unexpected error occurred. Please try again later. ", err);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req?.body?.emailId;

  try {
    const users = await User.find({ emailId: userEmail });

    if (users.length === 0) {
      res
        .status(404)
        .send({ message: "No user account found with the provided details.!" });
    } else {
      res.json({ message: "User record retrieved successfully.", users });
    }
  } catch (err) {
    console.log("An unexpected error occurred. Please try again later. " + err);
  }

  res.json;
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.json({ message: "User record retrieved successfully.", users });
  } catch (err) {
    console.log("An unexpected error occurred. Please try again later. " + err);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req?.params?.userId;
  const data = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    const ALLOWED_UPDATES = ["photoUrl", "age", "about", "gender", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("This update action is not permitted.");
    }

    if (data?.skills?.length > 10) {
      throw new Error("A maximum of 10 skills can be added.");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(402).send("Invalid user id");
    }

    if (!updatedUser) {
      res.status(400).send("No user account found with the provided details.");
    } else {
      res.json({ message: "User updated successfully", updatedUser });
    }
  } catch (err) {
    res
      .status(400)
      .send(
        "Failed to update user details. Please try again later. " + err.message
      );
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
