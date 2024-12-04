import express from 'express';
import { 
  addStudentGrade, 
  getStudentGrades, 
  getStudentsByQuiz, 
  getStudentsByClass,  // New route
  getStudentAverageScore, 
  getStudentScoresRange, 
  getStudentQuizCount, 
  getStudentsGradesForQuiz 
} from '../controllers/studentController.mjs';

const router = express.Router();

// Add a student's grade for a quiz and class
router.post('/students/grades', addStudentGrade);

// Get all grades for a specific student
router.get('/students/grades/:studentId', getStudentGrades);

// Get all students who took a specific quiz
router.get('/students/quiz/:quizId', getStudentsByQuiz);

// Get all students in a specific class (new route)
router.get('/students/class/:classId', getStudentsByClass);

// Get the average score for a student
router.get('/students/average/:studentId', getStudentAverageScore);

// Get highest and lowest scores for a student
router.get('/students/scores-range/:studentId', getStudentScoresRange);

// Get the total number of quizzes taken by a student
router.get('/students/quiz-count/:studentId', getStudentQuizCount);

// Get all students' grades for a specific quiz
router.get('/students/quiz/:quizId/grades', getStudentsGradesForQuiz);

export default router;
