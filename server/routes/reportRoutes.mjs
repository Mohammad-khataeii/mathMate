import express from 'express';
import {
  generateReport,
  createReport,
  getReportsByStudent,
  updateReport,
  getReportById,
  deleteReport,
  generateStudentSummaryReport,
  getReportsForClass
} from '../controllers/reportController.mjs';

const router = express.Router();

// Generate a performance report for a student
router.post('/reports', generateReport);

// Create a new report
router.post('/reports/create', createReport);

// Get all reports for a specific student
router.get('/reports/student/:studentId', getReportsByStudent);

// Update an existing report
router.put('/reports/:reportId', updateReport);

// Get a specific report by ID
router.get('/reports/:reportId', getReportById);

// Delete a specific report by ID
router.delete('/reports/:reportId', deleteReport);

// Generate a summary report for a student (average, highest, lowest score)
router.get('/reports/summary/student/:studentId', generateStudentSummaryReport);

// Get all reports for a specific class
router.get('/reports/class/:classId', getReportsForClass);

export default router;
