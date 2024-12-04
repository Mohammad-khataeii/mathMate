import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new sqlite3.Database(process.env.DB_PATH || './db/mathmate.db');

// Create a new quiz (now only storing quiz metadata)
export const createQuiz = (title, class_id, questions, callback) => {
  // Insert the quiz into the quizzes table
  const query = 'INSERT INTO quizzes (title, class_id) VALUES (?, ?)';
  db.run(query, [title, class_id], function (err) {
    if (err) {
      return callback(err);
    }

    const quizId = this.lastID;

    // Insert questions into the questions table
    const questionQuery = `
      INSERT INTO questions (quiz_id, question, answer, options) VALUES (?, ?, ?, ?)
    `;

    questions.forEach((question) => {
      const { questionText, correctAnswer, options } = question;
      const optionsString = JSON.stringify(options);  // Convert options to JSON string

      db.run(questionQuery, [quizId, questionText, correctAnswer, optionsString], (err) => {
        if (err) {
          return callback(err);
        }
      });
    });

    callback(null, quizId);  // Return the new quiz ID
  });
};

// Get all quizzes (fetches quiz metadata and associated questions)
export const getAllQuizzes = (callback) => {
  db.all('SELECT * FROM quizzes', [], (err, rows) => {
    if (err) {
      return callback(err);
    }

    const quizzes = [];

    // For each quiz, fetch its associated questions
    rows.forEach((quiz) => {
      db.all('SELECT * FROM questions WHERE quiz_id = ?', [quiz.id], (err, questions) => {
        if (err) {
          return callback(err);
        }

        quizzes.push({
          ...quiz,
          questions: questions.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
            options: JSON.parse(q.options), // Parsing options from string to array
          })),
        });

        // Only return after all quizzes have been processed
        if (quizzes.length === rows.length) {
          callback(null, quizzes);
        }
      });
    });
  });
};

// Get quiz by ID (fetches quiz metadata and associated questions)
export const getQuizById = (id, callback) => {
  db.get('SELECT * FROM quizzes WHERE id = ?', [id], (err, quiz) => {
    if (err) {
      return callback(err);
    }
    if (!quiz) {
      return callback(new Error('Quiz not found'));
    }

    // Fetch questions for the quiz
    db.all('SELECT * FROM questions WHERE quiz_id = ?', [id], (err, questions) => {
      if (err) {
        return callback(err);
      }

      const formattedQuestions = questions.map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        options: JSON.parse(q.options), // Parsing options from string to array
      }));

      callback(null, {
        ...quiz,
        questions: formattedQuestions,
      });
    });
  });
};

// Update a quiz (only updates quiz metadata, not the questions)
export const updateQuiz = (id, title, class_id, callback) => {
  const query = 'UPDATE quizzes SET title = ?, class_id = ? WHERE id = ?';
  db.run(query, [title, class_id, id], function (err) {
    callback(err, this.changes);  // Return the number of affected rows
  });
};

// Delete a quiz (also deletes associated questions)
export const deleteQuiz = (id, callback) => {
  const deleteQuestionsQuery = 'DELETE FROM questions WHERE quiz_id = ?';
  db.run(deleteQuestionsQuery, [id], (err) => {
    if (err) {
      return callback(err);
    }

    const deleteQuizQuery = 'DELETE FROM quizzes WHERE id = ?';
    db.run(deleteQuizQuery, [id], function (err) {
      callback(err, this.changes);  // Return the number of affected rows
    });
  });
};

// Get all students who took a specific quiz
export const getStudentsByQuiz = (quizId, callback) => {
  const query = 'SELECT * FROM students WHERE quiz_id = ?';
  db.all(query, [quizId], (err, rows) => {
    callback(err, rows);
  });
};

// Get all quizzes for a specific class (fetches quiz metadata and associated questions)
export const getQuizzesByClass = (classId, callback) => {
  const query = 'SELECT * FROM quizzes WHERE class_id = ?';
  db.all(query, [classId], (err, rows) => {
    if (err) {
      return callback(err);
    }

    const quizzes = [];

    // For each quiz, fetch its associated questions
    rows.forEach((quiz) => {
      db.all('SELECT * FROM questions WHERE quiz_id = ?', [quiz.id], (err, questions) => {
        if (err) {
          return callback(err);
        }

        quizzes.push({
          ...quiz,
          questions: questions.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
            options: JSON.parse(q.options), // Parsing options from string to array
          })),
        });

        // Only return after all quizzes have been processed
        if (quizzes.length === rows.length) {
          callback(null, quizzes);
        }
      });
    });
  });
};
