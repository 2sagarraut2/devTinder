const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validatePassword = require("../models/user");
const User = require("../models/user");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.json({ message: "User retrieved successfully.", data: user });
  } catch (err) {
    res.status(400).send({
      error: "An unexpected error occurred. Please try again later. " + err,
    });
    console.log(err);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: loggedInUser.firstName + ", your profile updated successfuly",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send({
      error: "An unexpected error occurred. Please try again later. " + err,
    });
    console.log(err);
  }
});

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    // Check if entered password is strong
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ message: "Please use a strong password" });
    }

    // Check if new password and confirm password is same
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Password update failed. Please choose a different password.",
      });
    }

    const user = await User.findById(req.user.id);

    // Checking if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Checking if current password and new password are same
    const sameNewPassword = await bcrypt.compare(newPassword, user.password);
    if (sameNewPassword) {
      return res.status(400).json({
        message: "Password update failed. Please choose a different password.",
      });
    } else {
      // Encrypt the data
      const newHashedPassword = await bcrypt.hash(password, 10);
      user.password = newHashedPassword;

      await user.save();

      res.cookie("token", null, {
        expires: new Date(Date.now()),
      });
      return res.json({ message: "Password update successful" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
});

module.exports = profileRouter;
