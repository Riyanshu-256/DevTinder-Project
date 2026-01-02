// Import express to create router
const express = require("express");

// Create router instance for authentication routes
const authRouter = express.Router();

// Import signup validation function
const { validateSignUpData } = require("../utils/validation");

// Import User model (MongoDB schema)
const User = require("../models/user");

// Import bcrypt for password hashing
const bcrypt = require("bcrypt");

// =======================
// SIGNUP ROUTE
// =======================
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate incoming signup data
    validateSignUpData(req);

    // Destructure user data from request body
    const { firstName, lastName, emailId, password } = req.body;

    // Hash the password before saving to DB
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    // Save user to database
    await user.save();

    // Send success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    // Handle validation or DB errors
    res.status(400).json({ error: err.message });
  }
});

// =======================
// LOGIN ROUTE
// =======================
authRouter.post("/login", async (req, res) => {
  try {
    // Get login credentials from request body
    const { emailId, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token using model method
    const token = await user.getJWT();

    // Store token in HTTP-only cookie (secure from JS access)
    res.cookie("token", token, {
      httpOnly: true, // Prevent XSS attacks
      sameSite: "lax", // Required for CORS cookies
      secure: false, // true only in production (HTTPS)
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Send login success response
    res.status(200).json(user);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ error: err.message });
  }
});

// =======================
// LOGOUT ROUTE
// =======================
authRouter.post("/logout", (req, res) => {
  // Clear token cookie immediately
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  // Send logout confirmation
  res.json({ message: "Logout successful" });
});

// Export router to use in app.js
module.exports = authRouter;
