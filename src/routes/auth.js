const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const validator = require("validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

module.exports = authRouter;
