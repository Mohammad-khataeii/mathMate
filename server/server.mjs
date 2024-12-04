import express from 'express';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import session from 'express-session';

// Load environment variables
dotenv.config();

// Create an instance of Express
const app = express();

// Middleware to parse incoming request bodies
app.use(express.json()); // Built-in JSON body parser

// Middleware for handling sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Secret to sign the session ID
  resave: false, // Do not force session to be saved on every request
  saveUninitialized: false, // Do not save empty sessions
  cookie: { secure: process.env.NODE_ENV === 'production' } // Set cookie to be secure in production
}));

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
// Use the class routes
app.use('/api', classRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
