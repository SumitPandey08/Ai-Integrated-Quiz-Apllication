import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.route.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();

const allowedOrigin = process.env.FRONTEND_URL;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // If you need to handle cookies across origins
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/user', authRoutes);
app.use('/api/user/profile', profileRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});
