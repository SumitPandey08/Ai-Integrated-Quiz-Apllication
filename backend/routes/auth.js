// auth.route.js
import express from 'express';
import { register, login, logOut } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createQuizWithAI, getAllQuizzes } from '../controllers/quiz.controller.js'; // Import quiz controllers

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logOut);


router.get('/quizzes', getAllQuizzes);
router.post('/quizzes/ai', authMiddleware, createQuizWithAI); // Added verifyJWT

export default router;