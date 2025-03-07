import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuizContent = async (topic, maxQuestions) => {
  try {
    console.log("Generating quiz content for topic:", topic, "with", maxQuestions, "questions");

    if (!process.env.GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY environment variable is not set.");
      throw new Error("GOOGLE_API_KEY environment variable is not set.");
    }

    console.log("Using Google API Key from environment variables.");

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("Gemini-1.5-flash model initialized.");

    const prompt = `Give me a quiz on ${topic}. Include ${maxQuestions} multiple-choice questions. For each question, provide 4 answer options (A, B, C, D) and clearly indicate the correct answer. Format the response such that each question is on a new line, and each answer option is on its own line, with the correct answer on its own line after the options. Example:
        1. What is the capital of France?
        A. London
        B. Paris
        C. Berlin
        D. Rome
        Correct Answer: B. Paris
        2. ...`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Quiz content generated successfully.");
    console.log("Generated Text:", text);

    return text;
  } catch (error) {
    console.error("Error generating quiz content:", error);
    return `An error occurred while generating the quiz. Please try again later. Error : ${error.message || error.toString()}`;
  }
};