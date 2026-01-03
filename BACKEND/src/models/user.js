const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Create user schema => A design plan for how your documents should be stored
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, // user must give their firstName otherwise mongoose doesn't allow the insertion  in the database
      minLength: 5,
      maxLength: 35,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true, // user must login with emailId
      unique: true, // emailid must be unique
      lowercase: true, // convert upper case into lower case
      trim: true, // To avoid wide spaces
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 14,
      max: 85,
    },
    gender: {
      type: String,
      enum: {
        // enum : {} => restricted for some values
        values: ["male", "female", "others"],
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://i.pinimg.com/736x/c0/a7/76/c0a776ee66443d838aeff236d1d8721b.jpg",
    },
    about: {
      type: String,
      maxlength: 500,
    },
    skills: {
      type: [String], // array of skills
    },
  },
  {
    timestamps: true, // MongoDB will automatically add when the data was created and when it was last updated.
  }
);

// Adding a custom method called getJWT to the user schema
userSchema.methods.getJWT = async function () {
  // 'this' refers to the current user document
  const user = this;

  // Creating a JWT token containing the user's ID
  // Use the same secret as in auth middleware (JWT_SECRET from .env)
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Returning the created token
  return token;
};

// Adding a custom method to the userSchema called "validatePassword"
// This method will check if the entered password is correct
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  // "this" refers to the current user document from the database
  const user = this;
  const passwordHash = user.password;

  // bcrypt.compare() compares the plain password with the hashed password
  // It returns true if both match, otherwise false
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  // Returning whether the password is valid or not
  return isPasswordValid;
};

// Create a mongoose model so you can store and fetch data from your schema
const User = mongoose.model("User", userSchema);
module.exports = User;
