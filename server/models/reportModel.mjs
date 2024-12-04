import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new sqlite3.Database(process.env.DB_PATH || './db/mathmate.db');

// Generate a performance report for a student
export const generateReport = (studentId, callback) => {
  db.all('SELECT * FROM students WHERE student_id = ?', [studentId], (err, rows) => {
    callback(err, rows);
  });
};

// Create a new report
export const createReport = (student_id, teacher_id, quiz_id, performance_data, callback) => {
  const query = 'INSERT INTO reports (student_id, teacher_id, quiz_id, performance_data) VALUES (?, ?, ?, ?)';
  db.run(query, [student_id, teacher_id, quiz_id, performance_data], function (err) {
    callback(err, this.lastID);
  });
};
