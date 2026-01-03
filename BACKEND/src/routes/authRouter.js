const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const authRouter = express.Router();

// Signup Route - for new users
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the incoming data
    validateSignUpData(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      about,
      photoUrl,
      age,
      skills,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      emailId: emailId.toLowerCase().trim(),
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists please log in to continue" });
    }

    // Encrypt the password before saving
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      about,
      ...(photoUrl && { photoUrl }),
      ...(age && { age }),
      ...(skills && skills.length > 0 && { skills }),
    });

    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    // Handle MongoDB duplicate key error (E11000)
    if (err.code === 11000 || err.keyPattern?.emailId) {
      return res
        .status(400)
        .json({ message: "User already exists please log in to continue" });
    }
    res.status(400).json({ message: err.message });
  }
});

// Login Route - for existing users
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Generate token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const isProd = process.env.NODE_ENV === "production";

      // Add the token to Cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// Logout Route - end the user session
authRouter.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
  });

  res.status(200).json({ message: "Logout successful" });
});

// Forgot Password Route - to reset password
authRouter.post("/forgotPassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update the existing password field
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = authRouter;
