// QuizStart.jsx
import React, { useState, useEffect } from 'react';
import Question from '../components/Question';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const QuizStart = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const questions = location.state?.questions || []; // Access questions safely
    const quizIdFromState = location.state?.quizId; // Access quizId if passed
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const token = localStorage.getItem('token');
    const [currentQuizId, setCurrentQuizId] = useState(quizIdFromState); // Use quizId from state

    useEffect(() => {
        console.log("QuizStart useEffect triggered");
        console.log("location.state:", location.state);

        if (!questions || questions.length === 0) {
            console.error("No questions received in result state.");
            setError("Failed to load quiz.");
            return;
        }
        setUserAnswers(Array(questions.length).fill(null));

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.id || decodedToken._id);
                console.log("Decoded userId:", userId);
            } catch (decodeError) {
                console.error("Error decoding token:", decodeError);
                setError("Authentication error.");
            }
        } else {
            console.error("No token found.");
            setError("Not authenticated.");
        }

        // Get quizId from state (passed during navigation)
        if (quizIdFromState) {
            setCurrentQuizId(quizIdFromState);
            console.log("QuizId received from state:", quizIdFromState);
        } else if (questions.length > 0 && questions[0]?.quizId) {
            // Fallback: Try to get quizId from the first question (less reliable)
            setCurrentQuizId(questions[0].quizId);
            console.log("Inferred quizId from questions:", questions[0].quizId);
        } else {
            console.warn("Quiz ID not found in state or questions.");
        }
    }, [location.state, token]); // Re-run if location.state changes

    const handleAnswer = (questionIndex, answer) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[questionIndex] = answer;
        setUserAnswers(updatedAnswers);
    };

    const handleSubmit = async () => {
        if (!userId || !token) {
            console.error("User not authenticated.");
            setError("User not authenticated.");
            return;
        }

        if (!currentQuizId) {
            console.error("Quiz ID is missing.");
            setError("Quiz ID is missing. Cannot submit quiz.");
            return;
        }

        let correctAnswers = 0;
        const answersToSend = {};
        questions.forEach((q, index) => {
            answersToSend[q._id] = userAnswers[index];
            if (userAnswers[index]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()) {
                correctAnswers++;
            }
        });

        setScore(correctAnswers);
        setShowResults(true);

        console.log("Submitting quiz with userId:", userId);
        console.log("Submitting quiz with quizId:", currentQuizId);
        console.log("Answers being sent:", answersToSend);

        try {
            const response = await fetch('http://localhost:3210/api/user/submit-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    quizId: currentQuizId,
                    answers: answersToSend,
                    // You might need to send timeTaken data here as well, if your backend expects it
                }),
            });

            console.log("Response:", response); // Log the entire response for debugging

            if (response.ok) {
                const responseData = await response.json();
                console.log("Quiz submitted successfully:", responseData);
                // navigate('/profile', { state: { shouldRefetch: true } });
            } else {
                const errorMessage = await response.json();
                console.error("Failed to submit quiz:", errorMessage);
                setError("Failed to submit quiz: " + errorMessage.message);
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
            setError("Error submitting quiz: " + error.message);
        }
    };

    if (error) {
        return <div className="min-h-screen bg-gray-900 text-white p-8">Error: {error}</div>;
    }

    if (!questions || questions.length === 0) {
        return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h2 className="text-3xl font-semibold mb-8 text-blue-400 text-center">Quiz Time!</h2>
            <div className="space-y-6">
                {questions.map((q, index) => (
                    <Question
                        key={index}
                        question={q.question}
                        options={q.options}
                        correctAnswer={q.correctAnswer}
                        onAnswer={(answer) => handleAnswer(index, answer)}
                        userAnswer={userAnswers[index]}
                        showResults={showResults}
                        num={index + 1}
                    />
                ))}
            </div>
            <button
                className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out"
                onClick={handleSubmit}
                disabled={showResults}
            >
                {showResults ? 'Quiz Submitted' : 'Submit Quiz'}
            </button>
            {showResults && (
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-4">Results:</h3>
                    <p className="font-semibold">Your Score: {score} / {questions.length}</p>
                    {questions.map((q, index) => (
                        <div key={index} className="mb-4">
                            <p className="font-semibold">
                                {index + 1}. {q.question}
                            </p>
                            <p>Your Answer: {userAnswers[index] || 'Not answered'}</p>
                            <p
                                className={`font-semibold ${
                                    userAnswers[index]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase() ? 'text-green-400' : 'text-red-400'
                                }`}
                            >
                                Correct Answer: {q.correctAnswer}
                            </p>
                        </div>
                    ))}
                    <button
                        onClick={() => navigate('/profile')}
                        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                    >
                        Go to Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizStart;