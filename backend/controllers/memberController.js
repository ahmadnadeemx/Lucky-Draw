const Member = require('../models/Member');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

// Get all members
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ serialNo: 1 });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", showMessage: true });
  }
};

// Get member by ID
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", showMessage: true });
  }
};

// Add new member (with image upload)
const addMember = async (req, res) => {
  try {
    const {
      serialNo,
      fileNo,
      name,
      fatherName,
      cnic,
      gender,
      dob,
      membership,
      bmVerification = false,
      feesVoucherText,
      email,
      mobile,
      memberImage,
      feesVoucherImage
    } = req.body;

    // Check for required fields
    if (!memberImage || !feesVoucherImage) {
      return res.status(400).json({
        message: "Member image and voucher image are required",
        showMessage: true
      });
    }

    // Check for duplicates
    const existingMember = await Member.findOne({
      $or: [
        { serialNo },
        { fileNo },
        { cnic },
        { email }
      ]
    });

    if (existingMember) {
      let duplicateField = '';
      if (existingMember.serialNo === serialNo) duplicateField = 'Serial No';
      else if (existingMember.fileNo === fileNo) duplicateField = 'File No';
      else if (existingMember.cnic === cnic) duplicateField = 'CNIC';
      else duplicateField = 'Email';
      
      return res.status(400).json({
        message: `${duplicateField} already exists`,
        showMessage: true,
      });
    }

    const newMember = new Member({
      serialNo,
      fileNo,
      name,
      fatherName,
      cnic,
      gender,
      dob: dob ? new Date(dob) : null,
      membership,
      bmVerification: bmVerification === true || bmVerification === 'true',
      feesVoucherText,
      feesVoucherImage,
      memberImage,
      email,
      mobile,
    });

    const savedMember = await newMember.save();
    
    // Format response
    const responseMember = savedMember.toObject();
    responseMember.age = savedMember.age; // Add virtual field
    
    res.status(201).json({
      success: true,
      message: "Member added successfully",
      member: responseMember
    });
    
  } catch (error) {
    console.error('Add member error:', error);
    
    res.status(500).json({ 
      message: "Server Error", 
      showMessage: true,
      error: error.message 
    });
  }
};

// Update existing member
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Convert date string to Date object
    if (updateData.dob) {
      updateData.dob = new Date(updateData.dob);
    }
    
    // Convert boolean strings to actual booleans
    if (updateData.bmVerification !== undefined) {
      updateData.bmVerification = updateData.bmVerification === true || 
                                 updateData.bmVerification === 'true';
    }
    
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    res.json({
      success: true,
      message: "Member updated successfully",
      member: updatedMember
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", showMessage: true });
  }
};

// Delete member
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    await member.deleteOne();
    
    res.json({
      success: true,
      message: "Member deleted successfully"
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", showMessage: true });
  }
};

// Get random member for lucky draw
const getRandomMember = async (req, res) => {
  try {
    // Get only verified members for draw
    const verifiedMembers = await Member.find({ bmVerification: true });
    
    if (verifiedMembers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No verified members available for draw"
      });
    }
    
    // Select random member
    const randomIndex = Math.floor(Math.random() * verifiedMembers.length);
    const winner = verifiedMembers[randomIndex];
    
    res.json({
      success: true,
      message: "Lucky draw completed successfully!",
      winner: winner
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error during draw"
    });
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  addMember,
  updateMember,
  deleteMember,
  getRandomMember,
  uploadMiddleware
};