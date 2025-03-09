import express from 'express';
import { register, login, logOut } from '../controllers/authController.js';
import { createQuizWithAI, getAllQuizzes } from '../controllers/quiz.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.js';
import { updateProfile, getProfile } from '../controllers/profile.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.route('/logout').post(verifyJWT, logOut);

// Profile Routes
router.route('/profile')
  .post(verifyJWT, upload.single('avatar'), updateProfile)
  .get(verifyJWT, getProfile); //added get profile route.

router.get('/quizzes', getAllQuizzes);
router.post('/quizzes/ai', createQuizWithAI);

export default router;