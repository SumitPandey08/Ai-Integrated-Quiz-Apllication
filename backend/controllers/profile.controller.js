
import User from '../model/usermodels.js';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import fs from 'fs/promises';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
    throw error;
  }
};

export const getProfile = async (req, res) => {
  try {
    const decoded = verifyToken(req, res);
    if (res.statusCode === 401) return;
    console.log("Decoded Token:", decoded);
    const userId = decoded.id;
    console.log("Extracted User ID:", userId);
    const user = await User.findById(userId).select('-password');
    if (!user) {
      console.log(`Profile fetch failed: User with ID ${userId} not found.`);
      return res.status(404).json({ message: 'User not found.' });
    }
    console.log(`Profile fetched successfully for user ID: ${userId}`);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    console.log('Profile fetch failed due to server error.');
    res.status(500).json({ message: 'Server error: Failed to fetch profile.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const decoded = verifyToken(req, res);
    if (res.statusCode === 401) return;
    const userId = decoded.id;

    const schema = Joi.object({
      name: Joi.string().min(3).max(255).optional(),
      username: Joi.string().alphanum().min(3).max(30).optional(),
      email: Joi.string().email().optional(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      console.log(`Profile update failed: Validation error - ${error.details[0].message}`);
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, username, email } = value;
    const user = await User.findById(userId);
    if (!user) {
      console.log(`Profile update failed: User with ID ${userId} not found.`);
      return res.status(404).json({ message: 'User not found.' });
    }
    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;

    if (req.file) {
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxFileSize = 2 * 1024 * 1024;
      if (!allowedFileTypes.includes(req.file.mimetype)) {
        console.log(`Profile update failed: Invalid file type - ${req.file.mimetype}`);
        return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' });
      }
      if (req.file.size > maxFileSize) {
        console.log(`Profile update failed: File size exceeded limit - ${req.file.size}`);
        return res.status(400).json({ message: 'File size exceeds the limit of 2MB.' });
      }
      if (user.avatar) {
        const publicId = user.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatars',
      });
      user.avatar = result.secure_url;
      await fs.unlink(req.file.path);
    }
    await user.save();
    console.log(`Profile updated successfully for user ID: ${userId}`);
    res.status(200).json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    console.log('Profile update failed due to server error.');
    res.status(500).json({ message: 'Server error: Failed to update profile.' });
  }
};