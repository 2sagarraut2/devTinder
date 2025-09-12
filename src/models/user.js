const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Please enter valid Gender");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/05/66/32/22/360_F_566322207_Fa1DSykWMr5IjvNFFdgKapoCHJn36RgV.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid photo url: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user",
      maxLength: 50,
    },
    skills: {
      type: [String],
      validate(value) {
        return value.length <= 10;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
