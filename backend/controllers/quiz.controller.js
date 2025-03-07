import Quiz from '../model/quiz.module.js';
import { generateQuizContent } from '../config/genrativeAiService.js';

// Create a new quiz with AI-generated content
export const createQuizWithAI = async (req, res) => {
  try {
    const { topic, maxQuestions } = req.body;
    const quizDataString = await generateQuizContent(topic, maxQuestions);

    if (!quizDataString) {
      console.error("Failed to generate quiz content for topic:", topic);
      return res.status(500).json({ message: "Failed to generate quiz content." });
    }

    const quizzes = parseQuizString(quizDataString);

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

// Function to parse the AI-generated quiz string (adjust as needed)
function parseQuizString(quizDataString) {
  const quizzes = [];
  const questionBlocks = quizDataString.split(/\n\d+\./);
  questionBlocks.shift();

  questionBlocks.forEach((block, index) => { // Added index
    const lines = block.trim().split('\n');
    const question = lines[0].trim();
    const options = lines
      .slice(1, lines.findIndex((line) => line.startsWith('Correct Answer:')))
      .map((line) => line.trim());
    const correctAnswerLine = lines.find((line) => line.startsWith('Correct Answer:'));
    const correctAnswer = correctAnswerLine ? correctAnswerLine.split(':')[1].trim() : null;

    if (question && options.length > 0 && correctAnswer) {
      quizzes.push({ question, options, correctAnswer, questionNumber: index + 1 }); // Added questionNumber
    }
  });

  return quizzes;
}