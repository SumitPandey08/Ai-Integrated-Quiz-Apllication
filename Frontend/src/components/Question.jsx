import React from 'react';

const Question = ({ question, num, options, correctAnswer, onAnswer, userAnswer, showResults }) => {
  return (
    <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md text-white">
      <h3 className="text-xl font-semibold mb-4">
        {num}. {question}
      </h3>
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            className={`w-full text-left p-3 rounded-md border border-gray-700 cursor-pointer ${
              showResults
                ? option === correctAnswer
                  ? 'bg-green-700'
                  : userAnswer === option && option !== correctAnswer
                  ? 'bg-red-700'
                  : userAnswer === option
                  ? 'bg-gray-700'
                  : 'hover:bg-gray-700'
                : userAnswer === option
                ? 'bg-gray-700'
                : 'hover:bg-gray-700'
            }`}
            onClick={() => !showResults && onAnswer(option)}
            disabled={showResults}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;