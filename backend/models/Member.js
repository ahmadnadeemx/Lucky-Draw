// models/Member.js

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  fileNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{5}-\d{7}-\d$/, // CNIC format: 12345-1234567-1
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  bmVerification: {
    type: Boolean,
    default: false // default false, can be updated after verification
  },
  feesVoucher: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/ // basic email validation
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10,15}$/ // 10-15 digits
  },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
