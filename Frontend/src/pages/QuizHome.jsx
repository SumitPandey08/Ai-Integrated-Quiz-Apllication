import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const QuizHome = () => {
  const [topic, setTopic] = useState('');
  const [maxQuestions, setMaxQuestions] = useState(5);
  const isLoggedIn = localStorage.getItem('token');
  const authToken = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!topic.trim()) {
      alert('Please enter a topic.');
      setIsLoading(false);
      return;
    }

    if (maxQuestions < 1) {
      alert('Please enter a valid number of questions.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3210/api/user/quizzes/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ topic, maxQuestions }),
      });

      const result = await response.json();

      if (response.ok) {
        // Corrected navigation path to match your App.js route
        navigate('/quizid', { state: result });
      } else if (response.status === 401) {
        alert('Unauthorized. Please log in again.');
        navigate('/login');
      } else {
        alert(result.message || 'Failed to create quiz.');
      }
    } catch (error) {
      alert('An error occurred while creating the quiz.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoggedIn ? (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: `url(https://i.pinimg.com/originals/88/3b/2a/883b2a6dad11501a861af208c9480c97.jpg)` }}
    >
      <div className="text-center p-12 max-w-3xl bg-black bg-opacity-80 rounded-2xl shadow-2xl relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-blue-400 text-center">Start Quiz</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="topic-selection" className="block text-lg font-semibold text-gray-300 mb-2">
              Topic For Quiz:
            </label>
            <input
              type="text"
              id="topic-selection"
              className="border border-gray-700 rounded-md p-2 w-full bg-gray-800 text-white focus:ring focus:ring-blue-500 focus:outline-none"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="question-selection" className="block text-lg font-semibold text-gray-300 mb-2">
              Number of Questions:
            </label>
            <input
              type="number"
              id="question-selection"
              className="border border-gray-700 rounded-md p-2 w-full bg-gray-800 text-white focus:ring focus:ring-blue-500 focus:outline-none"
              min="1"
              value={maxQuestions}
              onChange={(e) => setMaxQuestions(parseInt(e.target.value))}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creating Quiz...' : 'Start Quiz'}
          </button>

          <div className="mt-4 text-center">
            <Link to="/" className="text-blue-500 hover:underline">
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-md">
        <p className="text-lg text-gray-300 mb-4">
          You are not logged in. Please log in to take a quiz.
        </p>
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default QuizHome;