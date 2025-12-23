import React, { useState, useEffect, useRef } from "react";
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
  FaImage,
  FaUpload,
  FaHashtag,
  FaCreditCard,
} from "react-icons/fa";
import { GiMale, GiFemale } from "react-icons/gi";

const UpdateMemberModal = ({ isOpen, onClose, member, onMemberUpdated }) => {
  const { updateMember } = useMembers();
  const [formData, setFormData] = useState({
    serialNo: "",
    fileNo: "",
    name: "",
    fatherName: "",
    gender: "Male",
    dob: "",
    mobile: "",
    email: "",
    cnic: "",
    membership: "",
    feesVoucherText: "",
    bmVerification: false,
  });

  const [memberImage, setMemberImage] = useState(null);
  const [voucherImage, setVoucherImage] = useState(null);
  const [memberImagePreview, setMemberImagePreview] = useState(null);
  const [voucherImagePreview, setVoucherImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const memberImageRef = useRef(null);
  const voucherImageRef = useRef(null);

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
        serialNo: member.serialNo || "",
        fileNo: member.fileNo || "",
        name: member.name || "",
        fatherName: member.fatherName || "",
        gender: member.gender || "Male",
        dob: formatDateForInput(member.dob),
        mobile: member.mobile || "",
        email: member.email || "",
        cnic: member.cnic || "",
        membership: member.membership || "",
        feesVoucherText: member.feesVoucherText || "",
        bmVerification: member.bmVerification || false,
      });

      // Set image previews if images exist
      if (member.memberImage) {
        setMemberImagePreview(member.memberImage);
      }
      if (member.feesVoucherImage) {
        setVoucherImagePreview(member.feesVoucherImage);
      }
    }
  }, [member]);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Serial No validation
    if (!formData.serialNo.trim()) {
      newErrors.serialNo = "Serial No is required";
    }

    // File No validation
    if (!formData.fileNo.trim()) {
      newErrors.fileNo = "File No is required";
    }

    // Membership validation
    if (!formData.membership.trim()) {
      newErrors.membership = "Membership is required";
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Father name validation
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father name is required";
    }

    // CNIC validation
    if (!formData.cnic.trim()) {
      newErrors.cnic = "CNIC is required";
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Date of Birth validation
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }

    // Fees Voucher Text validation
    if (!formData.feesVoucherText.trim()) {
      newErrors.feesVoucherText = "Fees voucher number is required";
    }

    // Image validations (optional for update)
    if (memberImage && memberImage.size > 5 * 1024 * 1024) {
      newErrors.memberImage = "Member photo must be less than 5MB";
    }

    if (voucherImage && voucherImage.size > 10 * 1024 * 1024) {
      newErrors.voucherImage = "Voucher image must be less than 10MB";
    }

    return newErrors;
  };

  // Handle image upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [type]: "Please upload a valid image (JPEG, PNG, GIF, WebP)",
      }));
      return;
    }

    // Set file
    if (type === "memberImage") {
      setMemberImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemberImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setVoucherImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVoucherImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

    // Clear error
    if (errors[type]) {
      setErrors((prev) => ({ ...prev, [type]: "" }));
    }
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
      // Create FormData for file upload
      const formDataObj = new FormData();

      // Add form data
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      // Add files only if they were updated
      if (memberImage) {
        formDataObj.append("memberImage", memberImage);
      }
      if (voucherImage) {
        formDataObj.append("feesVoucherImage", voucherImage);
      }

      // Send request
      const response = await updateMember(member._id, formDataObj);
      console.log("response : ", response);
      if (response) {
        setSuccessMessage("Member updated successfully!");

        // Notify parent component
        if (onMemberUpdated) {
          onMemberUpdated(response);
        }

        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update member. Please try again.";

      setErrors({ submit: errorMessage });
      console.error("Update member error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form and close modal
  const handleClose = () => {
    setSuccessMessage("");
    setErrors({});
    setMemberImage(null);
    setVoucherImage(null);
    setMemberImagePreview(null);
    setVoucherImagePreview(null);
    onClose();
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset success message when modal opens
      setSuccessMessage("");
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
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 rounded-2xl shadow-2xl shadow-blue-500/20 dark:shadow-black/30 w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/20 dark:border-gray-700/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <FaEdit className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Update Participant
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Edit details for {member.name}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
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
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        {successMessage}
                      </span>
                    </div>
                  </motion.div>
                )}

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

                {/* Row 1: Serial No, Membership, File No */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Serial No */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Serial No *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaHashtag className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="serialNo"
                        value={formData.serialNo}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                          errors.serialNo
                            ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                        } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                        placeholder="e.g., MEM-001"
                      />
                      {errors.serialNo && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <FaTimesCircle className="h-3 w-3" />
                          {errors.serialNo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Membership (Text input) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Membership *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCreditCard className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="membership"
                        value={formData.membership}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                          errors.membership
                            ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                        } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                        placeholder="e.g., Gold, Silver, Premium"
                      />
                      {errors.membership && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <FaTimesCircle className="h-3 w-3" />
                          {errors.membership}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* File No */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      File No *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaFileAlt className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="fileNo"
                        value={formData.fileNo}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                          errors.fileNo
                            ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                        } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                        placeholder="e.g., FILE-001"
                      />
                      {errors.fileNo && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <FaTimesCircle className="h-3 w-3" />
                          {errors.fileNo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 2: Name and Father Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                          errors.name
                            ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
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
                        <FaUser className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                          errors.fatherName
                            ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
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
                </div>

                {/* Row 3: CNIC, Mobile, Email */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* CNIC */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CNIC *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                          errors.cnic
                            ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
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

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mobile Number *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                          errors.mobile
                            ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
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
                      Email Address *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                          errors.email
                            ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
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

                {/* Row 4: Date of Birth, Fees Voucher, Gender */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
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
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
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

                  {/* Fees Voucher Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fees Voucher No *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCheckCircle className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="feesVoucherText"
                        value={formData.feesVoucherText}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                          errors.feesVoucherText
                            ? "border-red-300 dark:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                        } bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300`}
                        placeholder="e.g., VOUCHER-001"
                      />
                      {errors.feesVoucherText && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <FaTimesCircle className="h-3 w-3" />
                          {errors.feesVoucherText}
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
                      {["Male", "Female"].map((genderOption) => (
                        <motion.button
                          key={genderOption}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              gender: genderOption,
                            }));
                            if (errors.gender)
                              setErrors((prev) => ({ ...prev, gender: "" }));
                          }}
                          className={`flex items-center justify-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${
                            formData.gender === genderOption
                              ? genderOption === "Male"
                                ? "border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 shadow-lg shadow-blue-500/20"
                                : "border-pink-500 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 shadow-lg shadow-pink-500/20"
                              : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              formData.gender === genderOption
                                ? genderOption === "Male"
                                  ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                                  : "bg-gradient-to-br from-pink-500 to-rose-500"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          >
                            {genderOption === "Male" ? (
                              <GiMale className="h-4 w-4 text-white" />
                            ) : (
                              <GiFemale className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              formData.gender === genderOption
                                ? genderOption === "Male"
                                  ? "text-blue-700 dark:text-blue-400"
                                  : "text-pink-700 dark:text-pink-400"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {genderOption}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 5: Image Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Member Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Member Photo (Optional - Leave unchanged)
                    </label>
                    <input
                      type="file"
                      ref={memberImageRef}
                      onChange={(e) => handleImageUpload(e, "memberImage")}
                      accept="image/*"
                      className="hidden"
                    />
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => memberImageRef.current.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 h-full ${
                        errors.memberImage
                          ? "border-red-300 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10"
                          : memberImagePreview
                          ? "border-green-300 dark:border-green-500 bg-green-50/50 dark:bg-green-900/10"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 bg-gray-50/50 dark:bg-gray-800/50"
                      }`}
                    >
                      {memberImagePreview ? (
                        <div className="space-y-3">
                          <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                            <img
                              src={memberImagePreview}
                              alt="Member preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {memberImage
                              ? "New photo selected"
                              : "Current photo"}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMemberImage(null);
                              // Reset to original image if it exists
                              setMemberImagePreview(member.memberImage || null);
                            }}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Remove New Photo
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 flex flex-col items-center justify-center h-full">
                          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                            <FaUpload className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Click to update member photo
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              JPG, PNG, GIF, WebP (Max 5MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                    {errors.memberImage && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <FaTimesCircle className="h-3 w-3" />
                        {errors.memberImage}
                      </p>
                    )}
                  </div>

                  {/* Voucher Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Voucher Image (Optional - Leave unchanged)
                    </label>
                    <input
                      type="file"
                      ref={voucherImageRef}
                      onChange={(e) => handleImageUpload(e, "voucherImage")}
                      accept="image/*"
                      className="hidden"
                    />
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => voucherImageRef.current.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 h-full ${
                        errors.voucherImage
                          ? "border-red-300 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10"
                          : voucherImagePreview
                          ? "border-green-300 dark:border-green-500 bg-green-50/50 dark:bg-green-900/10"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 bg-gray-50/50 dark:bg-gray-800/50"
                      }`}
                    >
                      {voucherImagePreview ? (
                        <div className="space-y-3">
                          <div className="relative mx-auto w-full h-40 rounded-lg overflow-hidden border-2 border-white dark:border-gray-800 shadow">
                            <img
                              src={voucherImagePreview}
                              alt="Voucher preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {voucherImage
                              ? "New voucher selected"
                              : "Current voucher"}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVoucherImage(null);
                              // Reset to original image if it exists
                              setVoucherImagePreview(
                                member.feesVoucherImage || null
                              );
                            }}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Remove New Voucher
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 flex flex-col items-center justify-center h-full">
                          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                            <FaImage className="h-8 w-8 text-green-500 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Click to update voucher image
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              JPG, PNG, GIF, WebP (Max 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                    {errors.voucherImage && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <FaTimesCircle className="h-3 w-3" />
                        {errors.voucherImage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 6: Verification Checkbox */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <input
                      type="checkbox"
                      id="bmVerification"
                      name="bmVerification"
                      checked={formData.bmVerification}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="bmVerification"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Mark as verified (BM Verification)
                    </label>
                  </div>
                </div>

                {/* Current Member Info */}
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/30 dark:to-blue-900/10 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Current Member Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        File No:
                      </span>
                      <span className="ml-2 font-medium text-gray-800 dark:text-gray-300">
                        {member.fileNo}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        Serial No:
                      </span>
                      <span className="ml-2 font-medium text-gray-800 dark:text-gray-300">
                        {member.serialNo}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        Member Since:
                      </span>
                      <span className="ml-2 font-medium text-gray-800 dark:text-gray-300">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-end gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
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
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaSave className="h-4 w-4" />
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
