const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send({ message: user.firstName + " sent the connection request" });
  } catch (err) {
    res
      .status(400)
      .send("An unexpected error occurred. Please try again later. " + err);
    console.log(err);
  }
});

module.exports = requestRouter;
