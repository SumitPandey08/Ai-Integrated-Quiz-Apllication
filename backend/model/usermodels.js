import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
  },
  username: { // Added username field
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  avatar: {
    type: String,   // cloud image URL (optional)
    required: false,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  } ,
  rating : {
    overallScore: { type: Number, default: 0 },
    attemptedQuizzes: { type: Number, default: 0 },
    completedQuizzes: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    categoryScores: { type: Map, of: Number, default: {} }, // e.g., { science: 85, history: 78 }
    skillLevels: { type: Map, of: String, default: {} }, // e.g., { algebra: 'intermediate', calculus: 'beginner' } - AI can help determine these
  },
  history : [{
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' }, // Assuming you have a Quiz model
    attemptedAt: { type: Date, default: Date.now },
    score: { type: Number },
    topic: { type: String },
    questions: [{
      questionId: { type: Schema.Types.ObjectId, ref: 'Question' }, // Assuming a Question model
      userAnswer: Schema.Types.Mixed,
      isCorrect: Boolean,
      timeTaken: Number, // Time taken by the user for this question (in seconds)
    }],
  }],
}, { timestamps: true });

// Pre-save hook to hash password if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to generate an access token
UserSchema.methods.generateAccessToken = function () {
  const payload = {
    id: this._id,
    username: this.username,
    email: this.email
  };
  // ENSURE process.env.ACCESS_TOKEN_SECRET IS DEFINED AND ACCESSIBLE
  console.log("ACCESS_TOKEN_SECRET from model:", process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

// Instance method to generate a refresh token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const User = mongoose.model("User", UserSchema);

export default User;