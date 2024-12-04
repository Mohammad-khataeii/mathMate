import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new sqlite3.Database(process.env.DB_PATH || './db/mathmate.db');

// Create a new quiz (now handling multiple questions in a separate table)
export const createQuiz = (req, res) => {
  console.log(req.body);  // Debugging line to log the incoming request body

  const { title, questions, class_id } = req.body;
  
  if (!title || !questions || !class_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert the quiz first
  const query = 'INSERT INTO quizzes (title, class_id) VALUES (?, ?)';
  db.run(query, [title, class_id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const quizId = this.lastID;

    // Now, insert the questions related to this quiz
    const questionQuery = `
      INSERT INTO questions (quiz_id, question, answer, options) VALUES (?, ?, ?, ?)
    `;

    questions.forEach((question) => {
      const { questionText, correctAnswer, options } = question;
      const optionsString = JSON.stringify(options);

      db.run(questionQuery, [quizId, questionText, correctAnswer, optionsString], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      });
    });

    res.status(201).json({ id: quizId, title });
  });
};

// Get all quizzes with associated questions
// Get all quizzes with associated questions
export const getAllQuizzes = (req, res) => {
  db.all('SELECT * FROM quizzes', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const quizzes = [];

    // Use Promise.all to handle all async queries
    const fetchQuestionsPromises = rows.map((quiz) => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM questions WHERE quiz_id = ?', [quiz.id], (err, questions) => {
          if (err) {
            return reject(err);
          }

          // Push the quiz along with its questions to the quizzes array
          quizzes.push({
            ...quiz,
            questions: questions.map((q) => ({
              id: q.id,
              question: q.question,
              answer: q.answer,
              options: JSON.parse(q.options), // Parsing options from string to array
            })),
          });

          resolve();
        });
      });
    });

    // Wait for all questions to be fetched
    Promise.all(fetchQuestionsPromises)
      .then(() => {
        // Send the response once all data is fetched
        res.status(200).json(quizzes);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
};


// Get a single quiz by ID with associated questions
export const getQuizById = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM quizzes WHERE id = ?', [id], (err, quiz) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Fetch questions for the quiz
    db.all('SELECT * FROM questions WHERE quiz_id = ?', [id], (err, questions) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const formattedQuestions = questions.map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        options: JSON.parse(q.options), // Parsing options from string to array
      }));

      res.status(200).json({
        ...quiz,
        questions: formattedQuestions,
      });
    });
  });
};

// Update a quiz (ensure to handle questions separately)
export const updateQuiz = (req, res) => {
  const { id } = req.params;
  const { title, questions, class_id } = req.body;

  const query = 'UPDATE quizzes SET title = ?, class_id = ? WHERE id = ?';
  db.run(query, [title, class_id, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Update questions (if provided)
    const questionQuery = `
      UPDATE questions SET question = ?, answer = ?, options = ? WHERE quiz_id = ? AND id = ?
    `;

    questions.forEach((question) => {
      const { questionText, correctAnswer, options, questionId } = question;
      const optionsString = JSON.stringify(options);

      db.run(questionQuery, [questionText, correctAnswer, optionsString, id, questionId], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      });
    });

    res.status(200).json({ message: 'Quiz updated' });
  });
};

// Delete a quiz (also deletes the questions associated with it)
export const deleteQuiz = (req, res) => {
  const { id } = req.params;

  const deleteQuestionsQuery = 'DELETE FROM questions WHERE quiz_id = ?';
  db.run(deleteQuestionsQuery, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const deleteQuizQuery = 'DELETE FROM quizzes WHERE id = ?';
    db.run(deleteQuizQuery, [id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Quiz and associated questions deleted' });
    });
  });
};

// Get all quizzes for a specific class
export const getQuizzesByClass = (req, res) => {
  const { classId } = req.params;

  db.all('SELECT * FROM quizzes WHERE class_id = ?', [classId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const quizzes = [];

    rows.forEach((quiz) => {
      db.all('SELECT * FROM questions WHERE quiz_id = ?', [quiz.id], (err, questions) => {
        if (err) {
          return res.status(500).json({ error: err.message });
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

        if (quizzes.length === rows.length) {
          res.status(200).json(quizzes);
        }
      });
    });
  });
};

// Add a comment to a quiz
export const addQuizComment = (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ error: 'Comment is required' });
  }

  const query = 'INSERT INTO quiz_comments (quiz_id, comment) VALUES (?, ?)';
  db.run(query, [id, comment], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Comment added successfully', id: this.lastID });
  });
};
