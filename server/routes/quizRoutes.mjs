import express from 'express';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getQuizzesByClass,
  addQuizComment
} from '../controllers/quizController.mjs';

const router = express.Router();

// Create a new quiz (now includes class_id)
router.post('/quizzes', createQuiz);

// Get all quizzes
router.get('/quizzes', getAllQuizzes);

// Get a specific quiz by ID
router.get('/quizzes/:id', getQuizById);

// Update an existing quiz (now includes class_id)
router.put('/quizzes/:id', updateQuiz);

// Delete a quiz
router.delete('/quizzes/:id', deleteQuiz);

// Get all quizzes for a specific class
router.get('/quizzes/class/:classId', getQuizzesByClass);

// Add a comment to a quiz
router.post('/quizzes/:id/comments', addQuizComment);

export default router;
