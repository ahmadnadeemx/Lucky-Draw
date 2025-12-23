const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  addMember,
  updateMember,
  deleteMember,
  getRandomMember,
  uploadMiddleware
} = require('../controllers/memberController');

// GET all members
router.get('/', getAllMembers);

// GET single member by ID
router.get('/:id', getMemberById);

// GET random member for lucky draw
router.get('/draw/random', getRandomMember);

// POST add new member (with file upload)
router.post('/', uploadMiddleware, addMember);

// PUT update existing member (with optional file upload)
router.put('/:id', uploadMiddleware, updateMember);

// DELETE remove member
router.delete('/:id', deleteMember);

module.exports = router;