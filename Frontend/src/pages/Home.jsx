import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const isLoggedIn = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'Account';

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: `url(https://i.pinimg.com/originals/88/3b/2a/883b2a6dad11501a861af208c9480c97.jpg)` }}
    >
      <div className="text-center p-12 max-w-3xl bg-black bg-opacity-80 rounded-2xl shadow-2xl relative z-10">
        {isLoggedIn && (
          <h2 className="text-4xl text-white font-extrabold mb-6 tracking-wide">
            Hello <span className="text-blue-400">{userName}</span>
          </h2>
        )}
        <h1 className="text-4xl font-extrabold mb-6 text-blue-400 tracking-wide">
          Unlock Your Potential with AI Quizzes
        </h1>
        <p className="text-lg mb-4 text-gray-300 leading-relaxed">
          Welcome to the <span className="text-blue-500 font-semibold">AI Integrated</span> Quiz Application.
          Challenge yourself, learn new things, and boost your confidence.
        </p>
        <div className="mb-8">
          <p className="italic text-xl text-gray-300 mb-2">
            "Every quiz is a chance to learn, but more so, a chance to grow."
          </p>
          <p className="text-gray-300">- Educater</p>
        </div>
        <hr className="border-gray-700 mb-8" />
        <div className="space-y-4">
          <p className="text-2xl font-semibold text-white">Create, Solve, and Conquer.</p>
          <p className="text-xl text-gray-300">Ready to start your learning journey?</p>
        </div>
        {!isLoggedIn ? (
          <div className="mt-10 flex justify-center gap-6">
            <Link to="/signup">
              <button className="text-white px-8 py-4 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold">
                Sign up
              </button>
            </Link>
            <Link to="/login">
              <button className="text-white px-8 py-4 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold">
                Login
              </button>
            </Link>
          </div>
        ) : (
          <div className="mt-10 flex justify-center gap-6">
            <Link to="/quiz">
              <button className="text-white px-8 py-4 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold">
                Start Quiz
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;