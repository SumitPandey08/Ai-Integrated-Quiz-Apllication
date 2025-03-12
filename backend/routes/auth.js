// auth.route.js
import express from 'express';
import { register, login, logOut } from '../controllers/authController.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createQuizWithAI, getAllQuizzes } from '../controllers/quiz.controller.js'; // Import quiz controllers

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyJWT, logOut);


router.get('/quizzes', getAllQuizzes);
router.post('/quizzes/ai', verifyJWT, createQuizWithAI); // Added verifyJWT

export default router;