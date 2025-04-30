import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.js';
import { updateProfile, getProfile } from '../controllers/profile.controller.js';
// import { getUserHistory } from '../controllers/quiz.controller.js'; // Remove this import if not needed here

const router = express.Router();

router.route('/')
    .post(authMiddleware, upload.single('avatar'), updateProfile)
    .get(authMiddleware, getProfile); // This might be for fetching the logged-in user's profile

// Route to get the profile and history of a specific user by ID using the getProfile controller
router.get('/:userId', authMiddleware, getProfile);

export default router;