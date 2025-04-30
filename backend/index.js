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

// CORS middleware (for actual requests)
const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
};
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests explicitly
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204); // Respond with no content (success)
});

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
