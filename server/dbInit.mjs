import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to the SQLite database
const db = new sqlite3.Database(process.env.DB_PATH || './db/mathmate.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Database connected.');
});

// Create tables for quizzes, questions, students, reports, and classes
const createTablesQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    teacher_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    class_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id)
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,  -- Correct answer for the question
    options TEXT,  -- A JSON array of options (optional)
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quiz_id INTEGER,
    class_id INTEGER,
    score REAL,
    graded_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    teacher_id INTEGER,
    quiz_id INTEGER,
    performance_data TEXT,  -- Can store performance metrics as JSON
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  );
`;

// Initialize the database with tables
db.exec(createTablesQuery, (err) => {
  if (err) {
    console.error('Error creating tables:', err);
    return;
  }
  console.log('Tables created successfully.');

  // Check if the quizzes table has the class_id column, and add it if missing
  const alterQuizzesTableQuery = `
    PRAGMA foreign_keys=off;
    ALTER TABLE quizzes ADD COLUMN class_id INTEGER;
    PRAGMA foreign_keys=on;
  `;

  db.exec(alterQuizzesTableQuery, (err) => {
    if (err) {
      console.error('Error altering quizzes table:', err);
    } else {
      console.log('Quizzes table updated with class_id.');
    }
  });

  db.close(); // Close the database connection after setup is complete
});
