const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ error: "Invalid status type: " + status });
      }

      // if there is an existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists" });
      }

      // Checking if to user exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // status messages
      const statusMessages = {
        interested: "is interested in",
        ignored: "ignored",
      };

      return res.json({
        message: `${req.user.firstName} ${statusMessages[status] || status} ${
          toUser.firstName
        }`,
        data,
      });
    } catch (err) {
      res.status(400).send({
        error: "An unexpected error occurred. Please try again later. " + err,
      });
      console.log(err);
    }
  }
);

module.exports = requestRouter;
