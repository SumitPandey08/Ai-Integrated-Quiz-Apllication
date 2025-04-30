// QuizHome.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizHome = () => {
    const navigate = useNavigate();
    const [topic, setTopic] = useState('');
    const [maxQuestions, setMaxQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('Medium');
    const [category, setCategory] = useState('General');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError("Not authenticated.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3210/api/user/quizzes/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ topic, maxQuestions, category, difficulty }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("AI Quiz Creation Result:", result);

                let quizId;
                let questions;

                // **ADJUST THESE BASED ON YOUR BACKEND RESPONSE STRUCTURE**
                // Example 1: Quiz ID is directly in 'result' as '_id' and questions are in 'result' as an array.
                if (result?._id && Array.isArray(result)) {
                    quizId = result._id;
                    questions = result;
                    console.log("Quiz ID found directly in result._id:", quizId);
                    console.log("Questions found directly in result:", questions);
                }
                // Example 2: Quiz ID is in 'result._id' and questions are in 'result.questions'.
                else if (result?._id && result?.questions && Array.isArray(result.questions)) {
                    quizId = result._id;
                    questions = result.questions;
                    console.log("Quiz ID found in result._id:", quizId);
                    console.log("Questions found in result.questions:", questions);
                }
                // Example 3: Quiz ID is in 'result.id' and 'result' is the questions array.
                else if (result?.id && Array.isArray(result)) {
                    quizId = result.id;
                    questions = result;
                    console.log("Quiz ID found in result.id:", quizId);
                    console.log("Questions found directly in result:", questions);
                }
                // Add more conditions here to handle other possible structures
                else {
                    console.error("Could not determine quiz ID and questions structure from backend response.");
                }

                if (quizId && questions?.length > 0) {
                    navigate('/quizid', { state: { quizId: quizId, questions: questions } });
                } else {
                    console.error("Missing quizId or questions. Navigation prevented.");
                    setError("Failed to start quiz due to missing data.");
                }

            } else {
                const errorMessage = await response.json();
                console.error("Failed to create quiz:", errorMessage);
                setError("Failed to create quiz: " + errorMessage.message);
            }
        } catch (error) {
            console.error("Error creating quiz:", error);
            setError("Error creating quiz: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h2 className="text-3xl font-semibold mb-8 text-blue-400 text-center">Generate AI Quiz</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <div>
                    <label htmlFor="topic" className="block text-gray-300 text-sm font-bold mb-2">
                        Topic:
                    </label>
                    <input
                        type="text"
                        id="topic"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="maxQuestions" className="block text-gray-300 text-sm font-bold mb-2">
                        Number of Questions:
                    </label>
                    <input
                        type="number"
                        id="maxQuestions"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
                        value={maxQuestions}
                        onChange={(e) => setMaxQuestions(parseInt(e.target.value))}
                        min="1"
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-gray-300 text-sm font-bold mb-2">
                        Category:
                    </label>
                    <input
                        type="text"
                        id="category"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="difficulty" className="block text-gray-300 text-sm font-bold mb-2">
                        Difficulty:
                    </label>
                    <select
                        id="difficulty"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 text-white"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Generate Quiz
                </button>
            </form>
        </div>
    );
};

export default QuizHome;