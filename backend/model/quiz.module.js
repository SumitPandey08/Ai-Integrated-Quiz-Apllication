import mongoose, { Schema } from 'mongoose';

const quizSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  maxQuestions: {
    type: Number,
    default: 1,
  },
  options: {
    type: [{ type: String, required: true }],
    validate: {
      validator: function (v) {
        return v && v.length >= 2 && v.length <= 4; // Example: 2 to 4 options
      },
      message: 'Options must have between 2 and 4 options.',
    },
  },
  correctAnswer: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;