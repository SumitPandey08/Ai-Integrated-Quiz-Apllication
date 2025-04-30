// controllers/quiz.controller.js
import Quiz from '../model/quiz.module.js';
import User from '../model/usermodels.js';
import { generateQuizContent } from '../config/genrativeAiService.js';

// Create a new quiz with AI-generated content
export const createQuizWithAI = async (req, res) => {
    try {
        const { topic, maxQuestions, category, difficulty } = req.body;

        const quizDataString = await generateQuizContent(topic, maxQuestions);

        if (!quizDataString) {
            console.error("Failed to generate quiz content for topic:", topic);
            return res.status(500).json({ message: "Failed to generate quiz content." });
        }

        const questions = parseQuizString(quizDataString, category, difficulty);

        if (!questions || questions.length === 0) {
            console.error("Failed to parse quiz content for topic:", topic);
            return res.status(500).json({ message: "Failed to parse quiz content." });
        }

        const newQuiz = new Quiz({
            title: topic,
            category: category || 'General',
            difficulty: difficulty || 'Medium',
            questions: questions,
            createdBy: req.user.id,
            createdAt: new Date(),
        });

        const savedQuiz = await newQuiz.save();
        console.log("AI Quiz created:", savedQuiz); // LOG: Check the saved quiz document
        res.status(201).json(savedQuiz);

    } catch (error) {
        console.error("Error creating quiz with AI:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function parseQuizString(quizDataString, category, difficulty) {
    const quizzes = [];
    const questionBlocks = quizDataString.split(/\n\d+\./);
    questionBlocks.shift();

    questionBlocks.forEach((block, index) => {
        const lines = block.trim().split('\n');
        const question = lines[0].trim();
        const options = [];
        let correctAnswer = null;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('Correct Answer:')) {
                correctAnswer = line.split(':')[1].trim();
                break;
            }
            options.push(line);
        }

        if (question && options.length >= 2 && options.length <= 4 && correctAnswer) {
            quizzes.push({
                question,
                options,
                correctAnswer,
                questionNumber: index + 1,
                category: category || 'General',
                difficulty: difficulty || 'Medium',
            });
        } else {
            console.warn("Skipping malformed question:", { question, options, correctAnswer });
        }
    });

    console.log("Parsed Quizzes:", quizzes); // LOG: Check the parsed quizzes
    return quizzes;
}


export const submitQuiz = async (req, res) => {
    try {
        const { userId, quizId, answers } = req.body;
        const outOfRating = 10;

        const user = await User.findById(userId);
        const quiz = await Quiz.findById(quizId);

        if (!user || !quiz) {
            return res.status(404).json({ message: 'User or Quiz not found.' });
        }

        const { correctCount, questionsData } = evaluateQuizSubmission(quiz.questions, answers);
        const totalQuestions = quiz.questions.length;
        const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
        const userRatingForQuiz = totalQuestions > 0 ? (correctCount / totalQuestions) * outOfRating : 0;
        const dateTaken = new Date();

        user.history.push({
            quizId: quiz._id,
            score: correctCount,
            accuracy: accuracy,
            category: quiz.category,
            difficulty: quiz.difficulty,
            ratingOutOf: outOfRating,
            userRating: userRatingForQuiz,
            questions: questionsData.map(q => ({
                questionId: q.questionId,
                userAnswer: answers[q.questionId],
                isCorrect: q.isCorrect,
                timeTaken: req.body.timeTaken && req.body.timeTaken[q.questionId] ? req.body.timeTaken[q.questionId] : 0,
                questionDifficulty: quiz.questions.find(qq => qq._id.toString() === q.questionId.toString())?.difficulty,
            })),
            dateTaken: dateTaken,
            totalQuestions: totalQuestions,
        });

        await user.save();
        console.log("Quiz submitted. User history updated:", user.history.slice(-1)[0]);
        res.status(200).json({ message: 'Quiz submitted successfully.', score: correctCount, accuracy, rating: userRatingForQuiz, outOf: outOfRating });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getUserHistory = async (req, res) => {
    try {
        const userId = req.params.userId;

        console.log("Fetching user history for userId:", userId);

        const user = await User.findById(userId).populate({
            path: 'history.quizId',
            select: 'title category difficulty',
            model: 'Quiz' // Explicitly specify the model
        });

        console.log("Fetched user:", user);
        console.log("User history after populate:", user ? user.history : null);

        if (!user) {
            console.log("User not found with ID:", userId);
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user.history);
    } catch (error) {
        console.error('Error fetching user history:', error);
        res.status(500).json({ message: error.message });
    }
};

function evaluateQuizSubmission(quizQuestions, userAnswers) {
    let correctCount = 0;
    const questionsData = [];

    quizQuestions.forEach(quizQuestion => {
        const userAnswer = userAnswers[quizQuestion._id];
        const isCorrect = userAnswer && userAnswer.trim().toLowerCase() === quizQuestion.correctAnswer.trim().toLowerCase();
        questionsData.push({
            questionId: quizQuestion._id,
            isCorrect: isCorrect,
        });
        if (isCorrect) {
            correctCount++;
        }
    });

    return { correctCount, questionsData };
}