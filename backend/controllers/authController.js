import bcrypt from 'bcryptjs';
import User from '../model/usermodels.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// Register controller: creates a new user, generates tokens, and returns them
export const register = async (req, res) => {
  const { name, email, username, password } = req.body;

  console.log("Request Body (Register):", req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log("User with this email already exists");
      return res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
    }

    user = await User.findOne({ username });
    if (user) {
      console.log("User with this username already exists");
      return res.status(400).json({ errors: [{ msg: 'Username already exists' }] });
    }

    user = new User({
      name,
      email,
      password,
      username,
    });

    await user.save();
    console.log("User registered successfully:", user);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      accessToken,
      refreshToken,
      user: { _id: user._id, name: user.name, email: user.email, username: user.username },
    });
  } catch (err) {
    if (err.code === 11000) {
      console.error("Duplicate key error (Register):", err.message);
      if (err.keyPattern && err.keyPattern.email) {
        return res.status(400).json({ errors: [{ msg: 'Email already registered' }] });
      } else if (err.keyPattern && err.keyPattern.username) {
        return res.status(400).json({ errors: [{ msg: 'Username already registered' }] });
      }
    }
    console.error("Server error during registration:", err.message);
    console.error("Error Stack Trace (Register):", err.stack);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login controller: authenticates user credentials and returns new access and refresh tokens
export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Request Body (Login):", req.body);
  console.log("Email (Login):", email);
  console.log("ACCESS_TOKEN_SECRET (Login):", process.env.ACCESS_TOKEN_SECRET);
  console.log("REFRESH_TOKEN_SECRET (Login):", process.env.REFRESH_TOKEN_SECRET);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found (Login)");
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    console.log("User found (Login):", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result (Login):", isMatch);

    if (!isMatch) {
      console.error("Password does not match (Login)");
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: { _id: user._id, name: user.name, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("Server error during login:", err.message);
    console.error("Error Stack Trace (Login):", err.stack);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Logout controller: clears the stored refresh token and clears cookies
export const logOut = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const options = { httpOnly: true, secure: true };

    res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error during logout" });
  }
};

// Refresh token controller: generates a new access token using a valid refresh token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = user.generateAccessToken();
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};