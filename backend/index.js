import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
import cors  from 'cors'

dotenv.config(); // Load environment variables

const app = express();
connectDB();

app.use(cors()) ;

app.use(express.json());
app.use('/api/user', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
