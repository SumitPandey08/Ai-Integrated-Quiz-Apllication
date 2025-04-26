// profile.route.js
import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.js';
import { updateProfile, getProfile } from '../controllers/profile.controller.js';

const router = express.Router();

router.route('/')
  .post(authMiddleware, upload.single('avatar'), updateProfile)
  .get(authMiddleware, getProfile);

export default router;