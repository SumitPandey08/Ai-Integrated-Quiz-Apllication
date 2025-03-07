import express from 'express';
import { register, login } from '../controllers/authController.js';
import {createQuizWithAI , getAllQuizzes} from '../controllers/quiz.controller.js'
import { logOut } from '../controllers/authController.js';
import { verifyJWT }  from '../middlewares/auth.middleware.js';



const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.route("/logout").post( verifyJWT , logOut) ;



router.get('/quizzes', getAllQuizzes); // Route to get all quizzes
router.post('/quizzes/ai', createQuizWithAI); // New route for AI-generated quizzes


export default router;
