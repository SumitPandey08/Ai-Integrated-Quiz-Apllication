import React, { useState, useEffect } from 'react';
import Question from '../components/Question';
import { useLocation } from 'react-router-dom';

const QuizStart = () => {
  const location = useLocation();
  const questions = location.state || [];
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      console.error("No questions received in result state.");
      setError("Failed to load quiz.");
      return;
    }
    setUserAnswers(Array(questions.length).fill(null));
  }, [questions]);

  const handleAnswer = (questionIndex, answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionIndex] = answer;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setShowResults(true);
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
            showResults={showResults} // Pass showResults prop
            num={index +1} //pass num prop
          />
        ))}
      </div>
      <button
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out"
        onClick={handleSubmit}
      >
        Submit Quiz
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
                  userAnswers[index] === q.correctAnswer ? 'text-green-400' : 'text-red-400'
                }`}
              >
                Correct Answer: {q.correctAnswer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizStart;