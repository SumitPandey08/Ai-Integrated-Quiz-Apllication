import React from 'react';

const About = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: `url(https://i.pinimg.com/originals/88/3b/2a/883b2a6dad11501a861af208c9480c97.jpg)` }}
    >
      <div className="text-center p-12 max-w-3xl bg-black bg-opacity-80 rounded-2xl shadow-2xl relative z-10">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-400 tracking-wide">
          About AI Integrated Quizzes
        </h1>
        <p className="text-lg mb-4 text-gray-300 leading-relaxed">
          Welcome to our innovative platform where learning meets artificial intelligence. We believe in transforming education through engaging and personalized quiz experiences.
        </p>
        <p className="text-lg mb-6 text-gray-300 leading-relaxed">
          Our mission is to empower learners of all ages to explore new subjects, reinforce their knowledge, and achieve their academic and personal goals.
        </p>
        <div className="mb-8">
          <p className="italic text-xl text-gray-300 mb-2">
            "The future of learning is personalized, engaging, and powered by AI."
          </p>
          <p className="text-gray-300">- AI Quizzes Team</p>
        </div>
        <hr className="border-gray-700 mb-8" />
        <div className="space-y-4">
          <p className="text-2xl font-semibold text-white">Why Choose Us?</p>
          <ul className="list-disc list-inside text-gray-300">
            <li>Personalized AI-driven quizzes.</li>
            <li>Interactive and engaging learning experience.</li>
            <li>Comprehensive coverage of various subjects.</li>
            <li>Track your progress and identify areas for improvement.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;