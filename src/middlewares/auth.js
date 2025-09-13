const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // read token from req cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }

    const decodedObj = await jwt.verify(token, process.env.SECRET_KEY);

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send({
      error:
        "An unexpected error occurred. Please try again later. " + err.message,
    });
  }
};

module.exports = {
  userAuth,
};
