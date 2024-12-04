import { createClass, getAllClasses, getClassById, updateClass, deleteClass } from '../models/classModel.mjs';

// Create a new class
export const createClassController = (req, res) => {
  const { name, teacherId } = req.body;

  createClass(name, teacherId, (err, classId) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Class created successfully', classId });
  });
};

// Get all classes
export const getAllClassesController = (req, res) => {
  getAllClasses((err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};

// Get a specific class by ID
export const getClassByIdController = (req, res) => {
  const { classId } = req.params;
  getClassById(classId, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json(row);
  });
};

// Update a class
export const updateClassController = (req, res) => {
  const { classId } = req.params;
  const { name, teacherId } = req.body;

  updateClass(classId, name, teacherId, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({ message: 'Class updated successfully' });
  });
};

// Delete a class
export const deleteClassController = (req, res) => {
  const { classId } = req.params;

  deleteClass(classId, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({ message: 'Class deleted successfully' });
  });
};
