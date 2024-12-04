import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new sqlite3.Database(process.env.DB_PATH || './db/mathmate.db');

// Create a new class
export const createClass = (name, teacherId, callback) => {
  const query = 'INSERT INTO classes (name, teacher_id) VALUES (?, ?)';
  db.run(query, [name, teacherId], function (err) {
    callback(err, this.lastID);
  });
};

// Get all classes
export const getAllClasses = (callback) => {
  db.all('SELECT * FROM classes', [], (err, rows) => {
    callback(err, rows);
  });
};

// Get a specific class by ID
export const getClassById = (classId, callback) => {
  db.get('SELECT * FROM classes WHERE id = ?', [classId], (err, row) => {
    callback(err, row);
  });
};

// Update a class
export const updateClass = (classId, name, teacherId, callback) => {
  const query = 'UPDATE classes SET name = ?, teacher_id = ? WHERE id = ?';
  db.run(query, [name, teacherId, classId], function (err) {
    callback(err, this.changes);
  });
};

// Delete a class
export const deleteClass = (classId, callback) => {
  const query = 'DELETE FROM classes WHERE id = ?';
  db.run(query, [classId], function (err) {
    callback(err, this.changes);
  });
};
