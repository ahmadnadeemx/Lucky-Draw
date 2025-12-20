import React, { useState, useMemo } from "react";
import { useMembers } from "../../../context/MembersContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendar,
  FaArrowRight,
  FaUserCircle,
} from "react-icons/fa";
import { GiMale, GiFemale } from "react-icons/gi";
import MemberDetailModal from "./MemberDetailModal";

const MembersTable = () => {
  const { members } = useMembers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;

    const query = searchQuery.toLowerCase();
    return members.filter(
      (member) =>
        member.name?.toLowerCase().includes(query) ||
        member.fatherName?.toLowerCase().includes(query) ||
        member.cnic?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.mobile?.toLowerCase().includes(query) ||
        member.fileNo?.toLowerCase().includes(query) ||
        member.feesVoucher?.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      scale: 1.002,
      boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      },
    },
  };

  // Calculate statistics
  const totalMembers = members.length;
  const verifiedMembers = members.filter((m) => m.bmVerification).length;
  const pendingMembers = members.filter((m) => !m.bmVerification).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 p-4 md:p-6">
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] h-[45px]">
              Lucky Draw Participants
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Welcome to the lucky draw participants dashboard
            </p>
          </div>
          
          {/* Search Stats */}
          <div className="mt-4 md:mt-0">
            <div className="flex items-center gap-4">
              {searchQuery && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-semibold shadow-lg shadow-green-500/25"
                >
                  Found: {filteredMembers.length}
                </motion.div>
              )}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-semibold shadow-lg shadow-blue-500/25"
              >
                Total: {totalMembers}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-blue-500/5 mb-8 border border-white/30 dark:border-gray-700/30">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Search participants by name, CNIC, mobile, email, file number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-gray-50/80 dark:bg-gray-700/80 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-lg group-hover:shadow-blue-500/10"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {/* Total Members Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5 rounded-2xl p-6 backdrop-blur-sm border border-blue-200/20 dark:border-blue-500/10 group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Participants</h3>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FaUserCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalMembers}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Registered in the draw</p>
          </div>
        </motion.div>

        {/* Verified Members Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/5 dark:to-emerald-500/5 rounded-2xl p-6 backdrop-blur-sm border border-green-200/20 dark:border-green-500/10 group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Verified</h3>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <FaCheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">{verifiedMembers}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Ready for the draw</p>
          </div>
        </motion.div>

        {/* Pending Verification Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-yellow-500/10 dark:from-amber-500/5 dark:to-yellow-500/5 rounded-2xl p-6 backdrop-blur-sm border border-amber-200/20 dark:border-amber-500/10 group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Pending Verification</h3>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <FaTimesCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{pendingMembers}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Awaiting verification</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Table Container */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-blue-500/10 dark:shadow-black/20 border border-white/30 dark:border-gray-700/30 overflow-hidden">
        {/* Table Header */}
        <div className="px-4 md:px-6 py-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="min-w-[1200px] grid grid-cols-12 gap-4 text-sm font-semibold">
            <div className="col-span-3">
              <span className="text-gray-700 dark:text-gray-300">Participant Details</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-700 dark:text-gray-300">Contact Information</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-700 dark:text-gray-300">Documents</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-700 dark:text-gray-300">Verification Status</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-gray-700 dark:text-gray-300">Registration Date</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="text-gray-700 dark:text-gray-300">View</span>
            </div>
          </div>
        </div>

        {/* Table Body */}
        {filteredMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <FaSearch className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No participants found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchQuery
                ? "Try a different search term"
                : "No participants available"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={tableVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-gray-100/50 dark:divide-gray-700/50"
          >
            {filteredMembers.map((member) => (
              <motion.div
                key={member._id}
                variants={rowVariants}
                whileHover="hover"
                onMouseEnter={() => setHoveredRow(member._id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => setSelectedMember(member)}
                className="px-4 md:px-6 py-4 cursor-pointer transition-all duration-300 relative group min-w-[1200px]"
              >
                {/* Hover Background Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/30 to-blue-50/0 dark:from-blue-900/0 dark:via-blue-900/10 dark:to-blue-900/0"
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={{
                    opacity: hoveredRow === member._id ? 1 : 0,
                    x: hoveredRow === member._id ? "0%" : "-100%",
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />

                {/* Row Content */}
                <div className="relative z-10 grid grid-cols-12 gap-4 items-center">
                  {/* Participant Details */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg ${
                          member.gender === "Male"
                            ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                            : "bg-gradient-to-br from-pink-500 to-rose-500"
                        }`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {member.gender === "Male" ? (
                          <GiMale className="h-6 w-6 text-white" />
                        ) : (
                          <GiFemale className="h-6 w-6 text-white" />
                        )}
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {member.name}
                          </h3>
                          <span className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                            {getAge(member.dob)} years
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.fatherName}</p>
                        <p className="text-xs text-blue-500 dark:text-blue-400 font-semibold mt-1">
                          {member.fileNo}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="col-span-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 group/item">
                        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                          <FaPhone className="h-3 w-3 text-blue-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {member.mobile}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 group/item">
                        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                          <FaEnvelope className="h-3 w-3 text-blue-500" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="col-span-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                          <FaIdCard className="h-3 w-3 text-blue-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {member.cnic}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg">
                          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                            {member.feesVoucher}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="col-span-2">
                    <motion.div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                        member.bmVerification
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30"
                          : "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30"
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {member.bmVerification ? (
                        <FaCheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <FaTimesCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          member.bmVerification
                            ? "text-green-700 dark:text-green-400"
                            : "text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {member.bmVerification ? "Verified" : "Pending"}
                      </span>
                    </motion.div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {member.bmVerification ? "Eligible for draw" : "Verification required"}
                    </p>
                  </div>

                  {/* Registration Date */}
                  <div className="col-span-2">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCalendar className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {formatDate(member.createdAt)}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Member since
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Indicator */}
                  <div className="col-span-1 flex justify-center">
                    <motion.div
                      animate={{
                        x: hoveredRow === member._id ? 5 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50"
                    >
                      <FaArrowRight className="h-4 w-4 text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberDetailModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};

export default MembersTable;