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

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "about",
    "age",
    "gender",
    "photoUrl",
    "skills",
  ];

  const keys = Object.keys(req.body);
  const isEditAllowed =
    keys.length > 0 && keys.every((field) => allowedEditFields.includes(field));

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
