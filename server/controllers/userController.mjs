import bcrypt from 'bcryptjs';
import { registerUserModel, authenticateUser as authenticateUserModel, getUserById } from '../models/userModel.mjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// Register a new user (teacher)
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await getUserById(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    const userId = await registerUserModel(name, email, hashedPassword);

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
};

// Login a user and create a session
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate the user
    const user = await authenticateUserModel(email, password);

    // Store user in session
    req.session.user = {
      id: user.id,
      email: user.email,
    };

    res.json({ message: 'Logged in successfully', user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Logout the user (destroy session)
export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

// Get the currently logged-in user's details (using session)
export const getCurrentUser = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.status(200).json({ user: req.session.user });
};

// Generate a JWT for a user (alternative to session-based auth)
export const generateJWT = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserById(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate JWT with user data and an expiration time
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,  // Make sure this is defined in your .env file
      { expiresIn: '1h' } // Set expiration time (1 hour)
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error generating JWT', error: err });
  }
};
