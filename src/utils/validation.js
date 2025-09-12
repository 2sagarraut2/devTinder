const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!(firstName || lastName)) {
    throw new Error("Invaid name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email povided");
  } else if (!validator.isStrongPassword(password))
    throw new Error("Please enter a wrong password");
};

module.exports = {
  validateSignUpData,
};
