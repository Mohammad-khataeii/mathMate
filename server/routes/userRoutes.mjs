import express from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser, generateJWT } from '../controllers/userController.mjs';
import { authenticateJWT } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// Register a new user (teacher)
router.post('/users/register', registerUser);

// Login a user (teacher)
router.post('/users/login', loginUser);

// Logout the user (destroy session)
router.post('/users/logout', logoutUser);

// Get the currently logged-in user
router.get('/users/current', getCurrentUser);

// Generate a JWT (alternative authentication)
router.post('/users/jwt', generateJWT);

// Protected route example
router.get('/protected', authenticateJWT, (req, res) => {
    // This route is only accessible with a valid JWT
    res.status(200).json({ message: 'Access granted to protected route', user: req.user });
  });
  
export default router;
