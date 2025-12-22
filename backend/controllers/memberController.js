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
      return res.status(400).json({ 
        message: 'Member with this CNIC or File No already exists',
        showMessage: true 
      });
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
    res.status(500).json({ message: 'Server Error', showMessage: true });
  }
};

// @desc    Update existing member
// @route   PUT /api/members/:id
// @access  Public
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
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

    // Find the member to update
    let member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ 
        message: 'Member not found',
        showMessage: true 
      });
    }

    // Check for duplicate CNIC or fileNo (excluding the current member)
    const existingMember = await Member.findOne({
      $and: [
        { _id: { $ne: id } }, // Not the current member
        { $or: [{ cnic }, { fileNo }] }
      ]
    });

    if (existingMember) {
      return res.status(400).json({ 
        message: 'Another member with this CNIC or File No already exists',
        showMessage: true 
      });
    }

    // Update member fields
    member.fileNo = fileNo || member.fileNo;
    member.name = name || member.name;
    member.fatherName = fatherName || member.fatherName;
    member.cnic = cnic || member.cnic;
    member.gender = gender || member.gender;
    member.dob = dob || member.dob;
    member.bmVerification = bmVerification !== undefined ? bmVerification : member.bmVerification;
    member.feesVoucher = feesVoucher || member.feesVoucher;
    member.email = email || member.email;
    member.mobile = mobile || member.mobile;

    // Update the updatedAt timestamp
    member.updatedAt = Date.now();

    const updatedMember = await member.save();
    
    res.status(200).json({
      _id: updatedMember._id,
      fileNo: updatedMember.fileNo,
      name: updatedMember.name,
      fatherName: updatedMember.fatherName,
      cnic: updatedMember.cnic,
      gender: updatedMember.gender,
      dob: updatedMember.dob,
      bmVerification: updatedMember.bmVerification,
      feesVoucher: updatedMember.feesVoucher,
      email: updatedMember.email,
      mobile: updatedMember.mobile,
      createdAt: updatedMember.createdAt,
      updatedAt: updatedMember.updatedAt
    });

  } catch (error) {
    console.error('Update member error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error',
        details: error.message,
        showMessage: true 
      });
    }
    
    // Handle cast errors (invalid ID format)
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid member ID format',
        showMessage: true 
      });
    }
    
    res.status(500).json({ 
      message: 'Server Error',
      showMessage: true 
    });
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  addMember,
  updateMember 
};