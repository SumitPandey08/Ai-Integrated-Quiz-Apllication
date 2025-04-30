// profile.controller.js
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
 * GET /profile/:userId
 * Retrieves the profile of the specified user, including their quiz history.
 */
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId; // Get userId from the route parameter

        const user = await User.findById(userId).select('-password').populate({
            path: 'history.quizId',
            select: 'title category difficulty',
            model: 'Quiz' // Ensure 'Quiz' matches your Quiz model name
        });

        if (!user) {
            console.log(`Profile fetch failed: User with ID ${userId} not found.`);
            return res.status(404).json({ message: 'User not found.' });
        }

        // Log the user object on the backend to confirm it has all the data
        console.log("Full User Object Sent (in response):", user);

        res.status(200).json(user); // <---- ENSURE YOU ARE SENDING THE ENTIRE 'user' OBJECT
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error: Failed to fetch profile.' });
    }
};

/**
 * PUT /profile/:userId
 * Updates the profile of the specified user (name, username, email, profileImage).
 */
export const updateProfile = async (req, res) => {
    const userId = req.params.userId;
    const updateSchema = Joi.object({
        name: Joi.string().trim().min(3).max(50).optional(),
        username: Joi.string().trim().alphanum().min(3).max(30).optional(),
        email: Joi.string().trim().email().optional(),
        profileImage: Joi.string().optional(), // Assuming you might send a Cloudinary URL or similar
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const user = await User.findByIdAndUpdate(userId, value, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'Profile updated successfully.', user });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Server error: Failed to update profile.' });
    }
};

/**
 * POST /profile/upload-image/:userId
 * Uploads a new profile image for the specified user.
 */
export const uploadProfileImage = async (req, res) => {
    const userId = req.params.userId;

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        await fs.unlink(req.file.path); // Remove the temporary file

        const user = await User.findByIdAndUpdate(userId, { profileImage: result.secure_url }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'Profile image uploaded successfully.', profileImage: user.profileImage });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ message: 'Server error: Failed to upload profile image.' });
    }
};