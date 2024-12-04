import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new sqlite3.Database(process.env.DB_PATH || './db/mathmate.db');

// Add a student's quiz grade
export const addStudentGrade = (req, res) => {
  const { name, quiz_id, class_id, score } = req.body;

  const query = 'INSERT INTO students (name, quiz_id, class_id, score) VALUES (?, ?, ?, ?)';
  db.run(query, [name, quiz_id, class_id, score], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, score });
  });
};

// Get all grades for a specific student
export const getStudentGrades = (req, res) => {
  const { studentId } = req.params;
  db.all('SELECT * FROM students WHERE id = ?', [studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};

// Get all students who took a specific quiz
export const getStudentsByQuiz = (req, res) => {
  const { quizId } = req.params;
  db.all('SELECT * FROM students WHERE quiz_id = ?', [quizId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};

// Get all students in a specific class
export const getStudentsByClass = (req, res) => {
  const { classId } = req.params;
  db.all('SELECT * FROM students WHERE class_id = ?', [classId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};

// Get the average score for a student
export const getStudentAverageScore = (req, res) => {
  const { studentId } = req.params;

  db.get('SELECT AVG(score) AS average_score FROM students WHERE id = ?', [studentId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ studentId, average_score: row.average_score });
  });
};

// Get highest and lowest scores for a student
export const getStudentScoresRange = (req, res) => {
  const { studentId } = req.params;

  db.all('SELECT MAX(score) AS highest_score, MIN(score) AS lowest_score FROM students WHERE id = ?', [studentId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ studentId, highest_score: row[0].highest_score, lowest_score: row[0].lowest_score });
  });
};

// Get the total number of quizzes taken by a student
export const getStudentQuizCount = (req, res) => {
  const { studentId } = req.params;

  db.get('SELECT COUNT(*) AS quiz_count FROM students WHERE id = ?', [studentId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ studentId, quiz_count: row.quiz_count });
  });
};

// Get all students' grades for a specific quiz
export const getStudentsGradesForQuiz = (req, res) => {
  const { quizId } = req.params;

  db.all('SELECT * FROM students WHERE quiz_id = ?', [quizId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};
