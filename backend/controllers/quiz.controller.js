// controllers/quiz.controller.js
import Quiz from '../model/quiz.module.js';
import User from '../model/usermodels.js';
import { generateQuizContent } from '../config/genrativeAiService.js';

// Create a new quiz with AI-generated content
export const createQuizWithAI = async (req, res) => {
    try {
        const { topic, maxQuestions, category, difficulty } = req.body; // Added category and difficulty

        const quizDataString = await generateQuizContent(topic, maxQuestions);

        if (!quizDataString) {
            console.error("Failed to generate quiz content for topic:", topic);
            return res.status(500).json({ message: "Failed to generate quiz content." });
        }

        const quizzes = parseQuizString(quizDataString, category, difficulty); // Pass category and difficulty

        if (!quizzes || quizzes.length === 0) {
            console.error("Failed to parse quiz content for topic:", topic);
            return res.status(500).json({ message: "Failed to parse quiz content." });
        }

        const savedQuizzes = await Quiz.insertMany(quizzes);

        res.status(201).json(savedQuizzes);
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

// Function to parse the AI-generated quiz string
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

        if (question && options.length > 0 && correctAnswer) {
            quizzes.push({
                question,
                options,
                correctAnswer,
                questionNumber: index + 1,
                category: category || 'General', // Use provided category or default
                difficulty: difficulty || 'Medium', // Use provided difficulty or default
            });
        }
    });

    return quizzes;
}

export const submitQuiz = async (req, res) => {
    try {
        const { userId, quizId, answers } = req.body;
        const outOfRating = 10; // Enforcing a rating out of 10

        // 1. Retrieve the user and the quiz
        const user = await User.findById(userId);
        const quiz = await Quiz.findById(quizId);

        if (!user || !quiz) {
            return res.status(404).json({ message: 'User or Quiz not found.' });
        }

        // 2. Evaluate the answers and calculate score, accuracy, and question details
        const { correctCount, questionsData } = evaluateQuizSubmission(quiz.questions, answers);
        const totalQuestions = quiz.questions.length;
        const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

        // Calculate a rating out of 10
        const userRatingForQuiz = totalQuestions > 0 ? (correctCount / totalQuestions) * outOfRating : 0;

        // 3. Update the user's history
        user.history.push({
            quizId: quiz._id,
            score: correctCount, // Storing the raw correct count as score
            accuracy: accuracy,
            category: quiz.category,
            difficulty: quiz.difficulty,
            ratingOutOf: outOfRating,
            userRating: userRatingForQuiz,
            questions: questionsData.map(q => ({
                questionId: q.questionId,
                userAnswer: answers[q.questionId], // Assuming answers are keyed by question ID
                isCorrect: q.isCorrect,
                timeTaken: req.body.timeTaken && req.body.timeTaken[q.questionId] ? req.body.timeTaken[q.questionId] : 0, // Assuming time taken is sent
                questionDifficulty: quiz.questions.find(qq => qq._id.toString() === q.questionId.toString())?.difficulty, // Get question difficulty from quiz
            })),
            dateTaken: new Date() // Add the date when the quiz was taken
            // You might add a feedback field here later
        });

        // 4. Update the user's rating (overall metrics)
        user.rating.attemptedQuizzes++;
        user.rating.completedQuizzes++; // Assuming they finished the quiz to submit

        // Update overallScore as the average of all quiz ratings
        const currentOverallScoreSum = user.rating.overallScore * (user.rating.completedQuizzes - 1);
        user.rating.overallScore = (currentOverallScoreSum + userRatingForQuiz) / user.rating.completedQuizzes;

        // Update averageAccuracy
        const currentAverageAccuracySum = user.rating.averageAccuracy * (user.rating.completedQuizzes - 1);
        user.rating.averageAccuracy = (currentAverageAccuracySum + accuracy) / user.rating.completedQuizzes;

        // Update category scores (average rating per category)
        const currentCategoryScore = user.rating.categoryScores.get(quiz.category) || 0;
        const categoryAttemptCount = user.history.filter(h => h.category === quiz.category).length;
        user.rating.categoryScores.set(quiz.category, (currentCategoryScore * (categoryAttemptCount - 1) + userRatingForQuiz) / categoryAttemptCount);

        // 5. Save the updated user
        await user.save();

        res.status(200).json({ message: 'Quiz submitted successfully.', score: correctCount, accuracy, rating: userRatingForQuiz, outOf: outOfRating });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ message: error.message });
    }
};

// Helper function to evaluate the quiz submission
function evaluateQuizSubmission(quizQuestions, userAnswers) {
    let correctCount = 0;
    const questionsData = [];

    quizQuestions.forEach(quizQuestion => {
        const userAnswer = userAnswers[quizQuestion._id]; // Assuming answers are keyed by question ID
        const isCorrect = userAnswer && userAnswer.trim().toLowerCase() === quizQuestion.correctAnswer.trim().toLowerCase(); // Adjust comparison as needed
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

export const getUserHistory = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user and populate their history array
        const user = await User.findById(userId).populate('history.quizId', 'title category questions'); // Populate questions as well

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user.history);
    } catch (error) {
        console.error('Error fetching user history:', error);
        res.status(500).json({ message: error.message });
    }
};