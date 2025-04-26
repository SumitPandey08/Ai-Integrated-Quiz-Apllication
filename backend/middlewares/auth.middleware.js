// authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../model/usermodels.js'; // Import your User model


export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('No token found in Authorization header.');
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        console.log('User not found for decoded token ID:', decoded.id);
        return res.status(401).json({ message: 'Invalid Access Token: User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Invalid Access Token: ' + error.message });
    }
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};