// profile.controller.js
import User from '../model/usermodels.js';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import Joi from 'joi'; // Import Joi for validation

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const getProfile = async (req, res) => {
  try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
          return res.status(401).json({ message: 'Unauthorized: No token provided.' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // Add this line for debugging
      const userId = decoded.id;
      console.log("Extracted User ID:", userId); //Add this line for debugging

      const user = await User.findById(userId).select('-password');

      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json(user);
  } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
      }
      res.status(500).json({ message: 'Server error: Failed to fetch profile.' });
  }
};

// Update user profile (ES module export)
export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Validation schema using Joi
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
    if (username) user.username = username;
    if (email) user.email = email;

    if (req.file) {
      // File validation
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxFileSize = 2 * 1024 * 1024; // 2MB

      if (!allowedFileTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' });
      }

      if (req.file.size > maxFileSize) {
        return res.status(400).json({ message: 'File size exceeds the limit of 2MB.' });
      }

      // Delete old avatar from Cloudinary if it exists
      if (user.avatar) {
        const publicId = user.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new avatar to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatars',
      });

      user.avatar = result.secure_url;
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
    res.status(500).json({ message: 'Server error: Failed to update profile.' });
  }
};