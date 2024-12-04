import express from 'express';
import {
  createClassController,
  getAllClassesController,
  getClassByIdController,
  updateClassController,
  deleteClassController
} from '../controllers/classController.mjs';

const router = express.Router();

// Create a new class
router.post('/classes', createClassController);

// Get all classes
router.get('/classes', getAllClassesController);

// Get a specific class by ID
router.get('/classes/:classId', getClassByIdController);

// Update a class
router.put('/classes/:classId', updateClassController);

// Delete a class
router.delete('/classes/:classId', deleteClassController);

export default router;
