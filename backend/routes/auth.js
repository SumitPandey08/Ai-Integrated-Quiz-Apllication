import express from 'express';
import { register, login, logOut } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createQuizWithAI, getAllQuizzes, submitQuiz } from '../controllers/quiz.controller.js'; // Removed getUserHistory import

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logOut);

// Quiz routes
router.get('/quizzes', getAllQuizzes);
router.post('/quizzes/ai', authMiddleware, createQuizWithAI);
router.post('/submit-quiz', authMiddleware, submitQuiz);

export default router;