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

// WARNING: This configuration allows requests from ANY origin.
// This is NOT recommended for production applications due to security risks.
const corsOptions = {
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
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
