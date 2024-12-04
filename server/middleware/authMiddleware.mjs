import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to verify JWT
export const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user;  // Attach the decoded user info to the request object
    next();  // Proceed to the next middleware or route handler
  });
};
