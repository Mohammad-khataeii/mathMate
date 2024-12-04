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

// Insert sample data into the database
const insertSampleData = () => {
  // Insert teachers (users)
  const insertTeachersQuery = `
    INSERT INTO users (name, email, password) VALUES
    ('John Doe', 'john.doe@example.com', 'password123'),
    ('Jane Smith', 'jane.smith@example.com', 'password456');
  `;

  // Insert classes
  const insertClassesQuery = `
    INSERT INTO classes (name, teacher_id) VALUES
    ('Math 101', 1),
    ('Science 101', 2);
  `;

  // Insert quizzes
  const insertQuizzesQuery = `
    INSERT INTO quizzes (title, questions, answers, class_id) VALUES
    ('Math Quiz 1', 'What is 2 + 2?', '4', 1),
    ('Science Quiz 1', 'What is the chemical formula of water?', 'H2O', 2);
  `;

  // Insert students
  const insertStudentsQuery = `
    INSERT INTO students (name, quiz_id, class_id, score) VALUES
    ('Alice Johnson', 1, 1, 85),
    ('Bob Brown', 2, 2, 92);
  `;

  // Insert reports
  const insertReportsQuery = `
    INSERT INTO reports (student_id, teacher_id, quiz_id, performance_data) VALUES
    (1, 1, 1, 'Passed with a score of 85'),
    (2, 2, 2, 'Passed with a score of 92');
  `;

  // Execute all insert queries
  db.exec(insertTeachersQuery, (err) => {
    if (err) {
      console.error('Error inserting teachers:', err);
      return;
    }
    console.log('Sample teachers inserted.');
  });

  db.exec(insertClassesQuery, (err) => {
    if (err) {
      console.error('Error inserting classes:', err);
      return;
    }
    console.log('Sample classes inserted.');
  });

  db.exec(insertQuizzesQuery, (err) => {
    if (err) {
      console.error('Error inserting quizzes:', err);
      return;
    }
    console.log('Sample quizzes inserted.');
  });

  db.exec(insertStudentsQuery, (err) => {
    if (err) {
      console.error('Error inserting students:', err);
      return;
    }
    console.log('Sample students inserted.');
  });

  db.exec(insertReportsQuery, (err) => {
    if (err) {
      console.error('Error inserting reports:', err);
      return;
    }
    console.log('Sample reports inserted.');
  });
};

// Call the function to insert data
insertSampleData();

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing the database connection:', err);
  } else {
    console.log('Database connection closed.');
  }
});
