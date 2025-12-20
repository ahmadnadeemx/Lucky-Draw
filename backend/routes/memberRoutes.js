// routes/memberRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  addMember
} = require('../controllers/memberController');

// GET all members
router.get('/', getAllMembers);

// GET single member by ID
router.get('/:id', getMemberById);

// POST add new member
router.post('/', addMember);

module.exports = router;
