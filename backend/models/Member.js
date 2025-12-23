const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  serialNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
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
  membership: {
    type: String,
    required: true,
    trim: true,
  },
  bmVerification: {
    type: Boolean,
    default: false
  },
  feesVoucherText: {
    type: String,
    required: true,
    trim: true
  },
  feesVoucherImage: {
    type: String,
    required: true
  },
  memberImage: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for age calculation
memberSchema.virtual('age').get(function() {
  if (!this.dob) return null;
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Index for better query performance
memberSchema.index({ serialNo: 1, fileNo: 1, cnic: 1 });

module.exports = mongoose.model('Member', memberSchema);