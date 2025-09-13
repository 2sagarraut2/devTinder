const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
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

module.exports = profileRouter;
