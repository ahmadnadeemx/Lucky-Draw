// components/MemberDetailModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { GiMale, GiFemale } from "react-icons/gi";

const MemberDetailModal = ({ member, onClose }) => {
  if (!member) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`relative h-[120px] ${member.bmVerification ? 'bg-gradient-to-r from-emerald-600 to-green-500' : 'bg-gradient-to-r from-blue-600 to-cyan-500'}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:rotate-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="absolute -bottom-12 left-8">
            <div className={`h-24 w-24 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-xl ${member.gender === "Male" ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800' : 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800'}`}>
              {member.gender === "Male" ? (
                <GiMale className="h-12 w-12 text-blue-600 dark:text-blue-300" />
              ) : (
                <GiFemale className="h-12 w-12 text-pink-600 dark:text-pink-300" />
              )}
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="pt-16 px-8 pb-8">
          {/* Title Section */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{member.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {getAge(member.dob)} years • {member.gender} • {member.fileNo}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${member.bmVerification ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-400'}`}>
              {member.bmVerification ? (
                <FaCheckCircle className="h-5 w-5" />
              ) : (
                <FaTimesCircle className="h-5 w-5" />
              )}
              <span className="font-semibold">{member.bmVerification ? 'Verified' : 'Pending Verification'}</span>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Father's Name</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{member.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date of Birth</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(member.dob)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verification Details
                </h3>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fees Voucher</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{member.feesVoucher}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Mobile Number</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{member.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">{member.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Document Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CNIC Number</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{member.cnic}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Registration Date</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(member.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MemberDetailModal;