import User from '../model/usermodels.js';
import { v2 as cloudinary } from 'cloudinary';
import Joi from 'joi';
import fs from 'fs/promises';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * GET /profile
 * Retrieves the profile of the authenticated user (assuming user info is in req.user).
 */
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      console.log("Profile fetch failed: No user object found in request.");
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      console.log(`Profile fetch failed: User with ID ${req.user._id} not found.`);
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error: Failed to fetch profile.' });
  }
};

/**
 * PUT /profile
 * Updates the profile details of the authenticated user (assuming user info is in req.user).
 */
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      console.log("Profile update failed: No user object found in request.");
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user._id;

    const schema = Joi.object({
      name: Joi.string().min(3).max(255).optional(),
      username: Joi.string().alphanum().min(3).max(30).optional(),
      email: Joi.string().email().optional(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, username, email } = value;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name;
    if (username && username !== user.username) {
      const existingUserWithUsername = await User.findOne({ username: username, _id: { $ne: userId } });
      if (existingUserWithUsername) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }
      user.username = username;
    }
    if (email && email !== user.email) {
      const existingUserWithEmail = await User.findOne({ email: email, _id: { $ne: userId } });
      if (existingUserWithEmail) {
        return res.status(400).json({ message: 'Email is already taken.' });
      }
      user.email = email;
    }

    if (req.file) {
      // ... (Cloudinary avatar upload logic - unchanged) ...
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error: Failed to update profile.' });
  }
};