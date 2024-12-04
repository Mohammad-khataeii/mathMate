import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new sqlite3.Database(process.env.DB_PATH || './db/mathmate.db');

// Generate a performance report for a student
export const generateReport = (req, res) => {
  const { student_id } = req.body;
  
  db.all('SELECT * FROM students WHERE student_id = ?', [student_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const performanceData = rows.map(row => ({
      quiz_id: row.quiz_id,
      score: row.score,
    }));

    res.status(200).json({ student_id, performanceData });
  });
};

// Create a new report (for example, saving report data in the database)
export const createReport = (req, res) => {
  const { student_id, teacher_id, quiz_id, performance_data } = req.body;

  const query = 'INSERT INTO reports (student_id, teacher_id, quiz_id, performance_data) VALUES (?, ?, ?, ?)';
  db.run(query, [student_id, teacher_id, quiz_id, performance_data], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ reportId: this.lastID, student_id, teacher_id, quiz_id, performance_data });
  });
};

// Get all reports for a specific student
export const getReportsByStudent = (req, res) => {
  const { studentId } = req.params;

  db.all('SELECT * FROM reports WHERE student_id = ?', [studentId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};

// Update an existing report
export const updateReport = (req, res) => {
  const { reportId } = req.params;
  const { student_id, teacher_id, quiz_id, performance_data } = req.body;

  const query = 'UPDATE reports SET student_id = ?, teacher_id = ?, quiz_id = ?, performance_data = ? WHERE id = ?';
  db.run(query, [student_id, teacher_id, quiz_id, performance_data, reportId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Report updated' });
  });
};

// Get a specific report by ID
export const getReportById = (req, res) => {
  const { reportId } = req.params;

  db.get('SELECT * FROM reports WHERE id = ?', [reportId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(row);
  });
};

// Delete a specific report by ID
export const deleteReport = (req, res) => {
  const { reportId } = req.params;

  const query = 'DELETE FROM reports WHERE id = ?';
  db.run(query, [reportId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Report deleted' });
  });
};

// Generate a summary report for a student
export const generateStudentSummaryReport = (req, res) => {
  const { studentId } = req.params;

  db.get('SELECT AVG(score) AS average_score, MAX(score) AS highest_score, MIN(score) AS lowest_score FROM students WHERE student_id = ?', [studentId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({
      student_id: studentId,
      average_score: row.average_score,
      highest_score: row.highest_score,
      lowest_score: row.lowest_score,
    });
  });
};

// Get all reports for a specific class
export const getReportsForClass = (req, res) => {
  const { classId } = req.params;

  db.all('SELECT * FROM reports WHERE class_id = ?', [classId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};
