import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const db = new sqlite3.Database(process.env.DB_PATH || './db/mathmate.db');

// Register a new user (teacher) using Promise
export const registerUserModel = (name, email, password) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.run(query, [name, email, password], function (err) {
      if (err) {
        reject(err); // Reject the promise if there’s an error
      } else {
        resolve(this.lastID); // Resolve the promise with the user ID
      }
    });
  });
};

// Authenticate a user (teacher login) using Promise
export const authenticateUser = (email, password) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (err || !row) {
        return reject(err || new Error('User not found'));
      }

      const isMatch = await bcrypt.compare(password, row.password);
      if (!isMatch) {
        return reject(new Error('Invalid password'));
      }

      resolve(row); // Resolve the promise with the user if authentication is successful
    });
  });
};

// Get user by email (used for JWT generation)
export const getUserById = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        reject(err); // Reject the promise if there’s an error
      }
      resolve(row); // Resolve the promise with the user data
    });
  });
};
