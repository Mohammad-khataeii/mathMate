import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new sqlite3.Database(process.env.DB_PATH || './db/mathmate.db');

// Create a new teacher (user)
export const createTeacher = (name, email, password, callback) => {
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.run(query, [name, email, password], function (err) {
    callback(err, this.lastID); // Returns the ID of the new teacher
  });
};

// Get all teachers (users)
export const getAllTeachers = (callback) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    callback(err, rows);
  });
};

// Get a teacher by ID
export const getTeacherById = (teacherId, callback) => {
  db.get('SELECT * FROM users WHERE id = ?', [teacherId], (err, row) => {
    callback(err, row);
  });
};

// Get a teacher by email (for login purposes)
export const getTeacherByEmail = (email, callback) => {
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    callback(err, row);
  });
};

// Add a student's grade for a specific quiz and class
export const addStudentGrade = (name, quiz_id, class_id, score, callback) => {
  const query = 'INSERT INTO students (name, quiz_id, class_id, score) VALUES (?, ?, ?, ?)';
  db.run(query, [name, quiz_id, class_id, score], function (err) {
    callback(err, this.lastID); // Return the new student ID
  });
};

// Get all grades for a specific student
export const getStudentGrades = (studentId, callback) => {
  db.all('SELECT * FROM students WHERE id = ?', [studentId], (err, rows) => {
    callback(err, rows);
  });
};

// Get all students who took a specific quiz
export const getStudentsByQuiz = (quizId, callback) => {
  db.all('SELECT * FROM students WHERE quiz_id = ?', [quizId], (err, rows) => {
    callback(err, rows);
  });
};

// Get all students in a specific class
export const getStudentsByClass = (classId, callback) => {
  db.all('SELECT * FROM students WHERE class_id = ?', [classId], (err, rows) => {
    callback(err, rows);
  });
};

// Get a specific student by ID
export const getStudentById = (studentId, callback) => {
  db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, row) => {
    callback(err, row);
  });
};

// Update a student's grade
export const updateStudentGrade = (studentId, quiz_id, score, callback) => {
  const query = 'UPDATE students SET quiz_id = ?, score = ? WHERE id = ?';
  db.run(query, [quiz_id, score, studentId], function (err) {
    callback(err, this.changes); // Returns the number of affected rows
  });
};

// Delete a student's record
export const deleteStudent = (studentId, callback) => {
  const query = 'DELETE FROM students WHERE id = ?';
  db.run(query, [studentId], function (err) {
    callback(err, this.changes); // Returns the number of affected rows
  });
};
