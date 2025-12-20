// controllers/memberController.js

const Member = require('../models/Member');

// @desc    Get all members
// @route   GET /api/members
// @access  Public
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single member by ID
// @route   GET /api/members/:id
// @access  Public
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add new member
// @route   POST /api/members
// @access  Public
const addMember = async (req, res) => {
  try {
    const {
      fileNo,
      name,
      fatherName,
      cnic,
      gender,
      dob,
      bmVerification,
      feesVoucher,
      email,
      mobile
    } = req.body;

    // Check for duplicate CNIC or fileNo
    const existingMember = await Member.findOne({ $or: [{ cnic }, { fileNo }] });
    if (existingMember) {
      return res.status(400).json({ message: 'Member with this CNIC or File No already exists' });
    }

    const newMember = new Member({
      fileNo,
      name,
      fatherName,
      cnic,
      gender,
      dob,
      bmVerification,
      feesVoucher,
      email,
      mobile
    });

    const savedMember = await newMember.save();
    res.status(201).json(savedMember);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  addMember
};
