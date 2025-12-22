import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMembers } from "../../../context/MembersContext";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaCalendarAlt,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEdit,
  FaSave,
  FaEye,
} from "react-icons/fa";
import { GiMale, GiFemale } from "react-icons/gi";

const UpdateMemberModal = ({ isOpen, onClose, member, onMemberUpdated }) => {
  const { updateMember, loading } = useMembers();
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    gender: "Male",
    dob: "",
    mobile: "",
    email: "",
    cnic: "",
    fileNo: "",
    feesVoucher: "",
    bmVerification: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when member data changes
  useEffect(() => {
    if (member) {
      // Format date for input field
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setFormData({
        name: member.name || "",
        fatherName: member.fatherName || "",
        gender: member.gender || "Male",
        dob: formatDateForInput(member.dob),
        mobile: member.mobile || "",
        email: member.email || "",
        cnic: member.cnic || "",
        fileNo: member.fileNo || "",
        feesVoucher: member.feesVoucher || "",
        bmVerification: member.bmVerification || false,
      });
    }
  }, [member]);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Father name validation
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father name is required";
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    }

    // CNIC validation
    if (!formData.cnic.trim()) {
      newErrors.cnic = "CNIC is required";
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Date of Birth validation
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }

    // File number validation
    if (!formData.fileNo.trim()) {
      newErrors.fileNo = "File number is required";
    }

    // Fees voucher validation
    if (!formData.feesVoucher.trim()) {
      newErrors.feesVoucher = "Fees voucher number is required";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member) return;

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // Format data for API
      const memberData = {
        ...formData,
        dob: new Date(formData.dob).toISOString(),
      };

      const response = await updateMember(member._id, memberData);

      if (response) {
        setSuccessMessage("Member updated successfully!");

        // Notify parent component
        if (onMemberUpdated) {
          onMemberUpdated(response);
        }

        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      setErrors({ submit: "Failed to update member. Please try again." });
      console.error("Update member error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Get today's date for max date
  const today = new Date().toISOString().split("T")[0];

  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 rounded-2xl shadow-2xl shadow-purple-500/20 dark:shadow-black/30 w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20 dark:border-gray-700/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <FaEdit className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Update Participant
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Edit details for {member.name}
                      </p>
                      {/* <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                          File: {member.fileNo}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          ID: {member._id?.substring(0, 8)}...
                        </span>
                      </div> */}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <FaTimesCircle className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
              >
                {/* {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        {successMessage}
                      </span>
                    </div>
                  </motion.div>
                )} */}

                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 border border-red-200 dark:border-red-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <FaTimesCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="text-red-700 dark:text-red-400 font-medium">
                        {errors.submit}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FaUser className="h-4 w-4 text-purple-500" />
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaUser className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </div>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                                errors.name
                                  ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                                  : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                              } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                              placeholder="Enter full name"
                            />
                            {errors.name && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <FaTimesCircle className="h-3 w-3" />
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Father Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Father's Name *
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaUser className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </div>
                            <input
                              type="text"
                              name="fatherName"
                              value={formData.fatherName}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                                errors.fatherName
                                  ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                                  : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                              } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                              placeholder="Enter father's name"
                            />
                            {errors.fatherName && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <FaTimesCircle className="h-3 w-3" />
                                {errors.fatherName}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Gender */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Gender *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  gender: "Male",
                                }));
                                if (errors.gender)
                                  setErrors((prev) => ({
                                    ...prev,
                                    gender: "",
                                  }));
                              }}
                              className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                                formData.gender === "Male"
                                  ? "border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 shadow-lg shadow-blue-500/20"
                                  : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700"
                              }`}
                            >
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                  formData.gender === "Male"
                                    ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                                    : "bg-gray-200 dark:bg-gray-700"
                                }`}
                              >
                                <GiMale className="h-5 w-5 text-white" />
                              </div>
                              <span
                                className={`font-medium ${
                                  formData.gender === "Male"
                                    ? "text-blue-700 dark:text-blue-400"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                Male
                              </span>
                            </motion.button>

                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  gender: "Female",
                                }));
                                if (errors.gender)
                                  setErrors((prev) => ({
                                    ...prev,
                                    gender: "",
                                  }));
                              }}
                              className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                                formData.gender === "Female"
                                  ? "border-pink-500 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 shadow-lg shadow-pink-500/20"
                                  : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-pink-300 dark:hover:border-pink-700"
                              }`}
                            >
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                  formData.gender === "Female"
                                    ? "bg-gradient-to-br from-pink-500 to-rose-500"
                                    : "bg-gray-200 dark:bg-gray-700"
                                }`}
                              >
                                <GiFemale className="h-5 w-5 text-white" />
                              </div>
                              <span
                                className={`font-medium ${
                                  formData.gender === "Female"
                                    ? "text-pink-700 dark:text-pink-400"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                Female
                              </span>
                            </motion.button>
                          </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date of Birth *
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaCalendarAlt className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </div>
                            <input
                              type="date"
                              name="dob"
                              value={formData.dob}
                              onChange={handleInputChange}
                              max={today}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                                errors.dob
                                  ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                                  : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                              } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                            />
                            {errors.dob && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <FaTimesCircle className="h-3 w-3" />
                                {errors.dob}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Documents Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FaPhone className="h-4 w-4 text-purple-500" />
                        Contact Information
                      </h3>
                      <div className="space-y-4">
                        {/* Mobile */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mobile Number *
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaPhone className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </div>
                            <input
                              type="tel"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                                errors.mobile
                                  ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                                  : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                              } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                              placeholder="Enter mobile number"
                            />
                            {errors.mobile && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <FaTimesCircle className="h-3 w-3" />
                                {errors.mobile}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address (Optional)
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaEnvelope className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                                errors.email
                                  ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                                  : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                              } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                              placeholder="name@example.com"
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <FaTimesCircle className="h-3 w-3" />
                                {errors.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <FaIdCard className="h-4 w-4 text-purple-500" />
                        Documents & Verification
                      </h3>
                      <div className="space-y-4">
                        {/* CNIC */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CNIC *
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaIdCard className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </div>
                            <input
                              type="text"
                              name="cnic"
                              value={formData.cnic}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                                errors.cnic
                                  ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                                  : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                              } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                              placeholder="Enter CNIC number"
                            />
                            {errors.cnic && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <FaTimesCircle className="h-3 w-3" />
                                {errors.cnic}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* File Number */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            File Number *
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaFileAlt className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </div>
                            <input
                              type="text"
                              name="fileNo"
                              value={formData.fileNo}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                                errors.fileNo
                                  ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                                  : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                              } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                              placeholder="Enter file number"
                            />
                            {errors.fileNo && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <FaTimesCircle className="h-3 w-3" />
                                {errors.fileNo}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Fees Voucher */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Fees Voucher Number *
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaCheckCircle className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </div>
                            <input
                              type="text"
                              name="feesVoucher"
                              value={formData.feesVoucher}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                                errors.feesVoucher
                                  ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                                  : "border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20"
                              } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                              placeholder="Enter voucher number"
                            />
                            {errors.feesVoucher && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <FaTimesCircle className="h-3 w-3" />
                                {errors.feesVoucher}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Verification Checkbox */}
                        <div className="flex items-center gap-3 pt-4">
                          <input
                            type="checkbox"
                            id="bmVerification"
                            name="bmVerification"
                            checked={formData.bmVerification}
                            onChange={handleInputChange}
                            className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label
                            htmlFor="bmVerification"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Mark as verified (BM Verification)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Original Data Preview */}
                {/* <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/30 dark:to-blue-900/10 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <FaEye className="h-3 w-3" />
                    Original Data (For Reference)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Name:</span>
                      <span className="ml-2 font-medium text-gray-800 dark:text-gray-300">{member.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Mobile:</span>
                      <span className="ml-2 font-medium text-gray-800 dark:text-gray-300">{member.mobile}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">CNIC:</span>
                      <span className="ml-2 font-medium text-gray-800 dark:text-gray-300">{member.cnic}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Status:</span>
                      <span className={`ml-2 font-medium ${member.bmVerification ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {member.bmVerification ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div> */}

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-end gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                    className="px-5 py-3 sm:px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaSave className="h-4 w-4  whitespace-nowrap" />
                        Update Participant
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpdateMemberModal;
