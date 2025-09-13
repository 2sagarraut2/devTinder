const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

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

module.exports = profileRouter;
