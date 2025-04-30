import mongoose, { Schema } from 'mongoose';

const questionSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [{ type: String, required: true }],
        validate: {
            validator: function (v) {
                return v && v.length >= 2 && v.length <= 4;
            },
            message: 'Options must have between 2 and 4 options.',
        },
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    questionNumber: Number, // Added question number
    category: String,       // Added category
    difficulty: String,     // Added difficulty
}, { timestamps: false }); // No timestamps for individual questions

const quizSchema = new Schema({
    title: String,
    category: String,
    difficulty: String,
    questions: [questionSchema], // Array of embedded question documents
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    // You might want to add other quiz-level information here
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;