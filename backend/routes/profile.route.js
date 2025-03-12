// profile.route.js
import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.js';
import { updateProfile, getProfile } from '../controllers/profile.controller.js';

const router = express.Router();

router.route('/') 
  .post(verifyJWT, upload.single('avatar'), updateProfile)
  .get(verifyJWT, getProfile);

export default router;