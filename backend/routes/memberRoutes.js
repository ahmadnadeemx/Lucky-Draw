// routes/memberRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  addMember,
  updateMember,
  deleteMember,
  getRandomMember // Add this import
} = require('../controllers/memberController');

// GET all members
router.get('/', getAllMembers);

// GET single member by ID
router.get('/:id', getMemberById);

// GET random member for lucky draw
router.get('/draw/random', getRandomMember);

// POST add new member
router.post('/', addMember);

// PUT update existing member
router.put('/:id', updateMember);

// DELETE remove member
router.delete('/:id', deleteMember);

module.exports = router;