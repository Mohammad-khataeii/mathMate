import express from 'express';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors'; // Import CORS

// Load environment variables
dotenv.config();

// Create an instance of Express
const app = express();

// Middleware to parse incoming request bodies
app.use(express.json()); // Built-in JSON body parser

// Middleware for handling sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mathMate', // Secret key for signing the session ID
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something is stored
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true in production (requires HTTPS)
      httpOnly: true, // Prevent JavaScript from accessing the cookie
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (1 day)
    },
  })
);

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Frontend URL
    credentials: true, // Allow cookies and credentials
  })
);

// Ensure the 'db' directory exists
const dbDirectory = path.dirname(process.env.DB_PATH || './db/mathmate.db');
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
  console.log('Database directory created.');
}

// Connect to the SQLite database
const db = new sqlite3.Database(process.env.DB_PATH || './db/mathmate.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Database connected.');
});

// Import routes
import quizRoutes from './routes/quizRoutes.mjs';
import studentRoutes from './routes/studentRoutes.mjs';
import reportRoutes from './routes/reportRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';
import classRoutes from './routes/classRoutes.mjs';

// Use routes
app.use('/api', quizRoutes);
app.use('/api', studentRoutes);
app.use('/api', reportRoutes);
app.use('/api', userRoutes);
app.use('/api', classRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
