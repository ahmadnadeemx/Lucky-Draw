import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaCalendarAlt,
  FaFileAlt,
  FaUser,
  FaCreditCard,
  FaHashtag,
  FaImage,
  FaDownload,
  FaExternalLinkAlt,
  FaRegIdCard,
  FaBirthdayCake,
} from "react-icons/fa";
import { GiMale, GiFemale } from "react-icons/gi";

const MemberDetailModal = ({ member, onClose }) => {
  const [activeImage, setActiveImage] = useState("member"); // 'member' or 'voucher'

  if (!member) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAge = (dobString) => {
    if (!dobString) return "N/A";
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleDownloadImage = (imageUrl, filename) => {
    if (!imageUrl) return;

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = imageUrl;
    link.target = "_blank";
    link.download = filename || "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-blue-500/20 dark:shadow-black/30 border border-white/20 dark:border-gray-700/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className={`relative h-[140px] rounded-t-2xl ${
            member.bmVerification
              ? "bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-500"
              : "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:rotate-90 group"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Profile Avatar */}
          <div className="absolute -bottom-12 left-8">
            <div
              className={`h-28 w-28 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-2xl ${
                member.gender === "Male"
                  ? "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-800"
                  : "bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900 dark:to-rose-800"
              }`}
            >
              {member.memberImage ? (
                <img
                  src={member.memberImage}
                  alt={member.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : member.gender === "Male" ? (
                <GiMale className="h-14 w-14 text-blue-600 dark:text-blue-300" />
              ) : (
                <GiFemale className="h-14 w-14 text-pink-600 dark:text-pink-300" />
              )}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="absolute top-4 left-4">
            <div
              className={`px-4 py-2 rounded-full flex items-center gap-2 shadow-lg ${
                member.bmVerification
                  ? "bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700"
                  : "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700"
              }`}
            >
              {member.bmVerification ? (
                <FaCheckCircle className="h-5 w-5" />
              ) : (
                <FaTimesCircle className="h-5 w-5" />
              )}
              <span className="font-semibold">
                {member.bmVerification ? "Verified" : "Pending Verification"}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="pt-20 px-8 pb-8">
          {/* Title Section */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {member.name}
                </h2>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold">
                  {member.gender}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FaBirthdayCake className="h-4 w-4" />
                  <span>{getAge(member.dob)} years</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHashtag className="h-4 w-4" />
                  <span>Serial: {member.serialNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaFileAlt className="h-4 w-4" />
                  <span>File: {member.fileNo}</span>
                </div>
              </div>
            </div>

            {/* Membership Badge */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center gap-2">
                <FaCreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Membership
                  </p>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                    {member.membership}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          {(member.memberImage || member.feesVoucherImage) && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <FaImage className="h-5 w-5 text-blue-500" />
                  Member Images
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveImage("member")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      activeImage === "member"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Profile Photo
                  </button>
                  <button
                    onClick={() => setActiveImage("voucher")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      activeImage === "voucher"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Voucher
                  </button>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                {activeImage === "member" && member.memberImage ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl mb-4">
                      <img
                        src={member.memberImage}
                        alt={`${member.name}'s Profile`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() =>
                        handleDownloadImage(
                          member.memberImage,
                          `${member.name}-profile.jpg`
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                      <FaDownload className="h-4 w-4" />
                      Download Profile Photo
                    </button>
                  </div>
                ) : activeImage === "voucher" && member.feesVoucherImage ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl mb-4">
                      <img
                        src={member.feesVoucherImage}
                        alt={`${member.name}'s Voucher`}
                        className="w-full h-full object-contain bg-white dark:bg-gray-800"
                      />
                    </div>
                    <button
                      onClick={() =>
                        handleDownloadImage(
                          member.feesVoucherImage,
                          `${member.name}-voucher.jpg`
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30 transition-all"
                    >
                      <FaDownload className="h-4 w-4" />
                      Download Voucher
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FaImage className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No image available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FaUser className="h-5 w-5 text-white" />
                  </div>
                  Personal Information
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                        <FaUser className="h-3 w-3" />
                        Father's Name
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {member.fatherName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                        <FaBirthdayCake className="h-3 w-3" />
                        Date of Birth
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {member.dob ? formatDate(member.dob) : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                      <FaCreditCard className="h-3 w-3" />
                      Membership Type
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/30">
                      <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
                        {member.membership}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Documents Card */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FaRegIdCard className="h-5 w-5 text-white" />
                  </div>
                  Document Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                      <FaIdCard className="h-3 w-3" />
                      CNIC Number
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg">
                      {member.cnic}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                      <FaFileAlt className="h-3 w-3" />
                      Fees Voucher No.
                    </p>
                    <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-4 py-3 rounded-lg border border-green-100 dark:border-green-800/30">
                      <span className="text-xl font-bold text-green-700 dark:text-green-400">
                        {member.feesVoucherText}
                      </span>
                      {member.feesVoucherImage && (
                        <button
                          onClick={() => setActiveImage("voucher")}
                          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                        >
                          <FaExternalLinkAlt className="h-3 w-3" />
                          View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Information Card */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <FaPhone className="h-5 w-5 text-white" />
                  </div>
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                      <FaPhone className="h-3 w-3" />
                      Mobile Number
                    </p>
                    <a
                      href={`tel:${member.mobile}`}
                      className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      {member.mobile}
                      <FaExternalLinkAlt className="h-3 w-3" />
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                      <FaEnvelope className="h-3 w-3" />
                      Email Address
                    </p>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 break-all"
                    >
                      {member.email}
                      <FaExternalLinkAlt className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Registration & Verification Card */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <FaCalendarAlt className="h-5 w-5 text-white" />
                  </div>
                  Registration & Verification
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Registration Date
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatDate(member.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Last Updated
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatDate(member.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Verification Status
                        </p>
                        <div className="flex items-center gap-2">
                          {member.bmVerification ? (
                            <>
                              <FaCheckCircle className="h-5 w-5 text-green-500" />
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                Verified
                              </span>
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="h-5 w-5 text-amber-500" />
                              <span className="font-semibold text-amber-600 dark:text-amber-400">
                                Pending
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {/* <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Member ID
                        </p>
                        <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                          {member._id?.substring(0, 8)}...
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions Card */}
              {/* <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {member.memberImage && (
                    <button
                      onClick={() => setActiveImage("member")}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md"
                    >
                      <FaImage className="h-6 w-6 text-blue-500 mb-2" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        View Photo
                      </span>
                    </button>
                  )}
                  {member.feesVoucherImage && (
                    <button
                      onClick={() => setActiveImage("voucher")}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-md"
                    >
                      <FaFileAlt className="h-6 w-6 text-green-500 mb-2" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        View Voucher
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleDownloadImage(
                        member.memberImage,
                        `${member.name}-profile.jpg`
                      )
                    }
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-md"
                  >
                    <FaDownload className="h-6 w-6 text-purple-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Download Photo
                    </span>
                  </button>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-all hover:shadow-md"
                  >
                    <FaEnvelope className="h-6 w-6 text-red-500 mb-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Send Email
                    </span>
                  </a>
                </div>
              </motion.div> */}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Created on {new Date(member.createdAt).toLocaleTimeString()} •
              Last updated {new Date(member.updatedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MemberDetailModal;
