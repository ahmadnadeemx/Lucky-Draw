import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendar,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { GiMale, GiFemale } from "react-icons/gi";
import UpdateMemberModal from "./UpdateMemberModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Add this import
import { useMembers } from "../../../context/MembersContext"; // Add this import

const MembersTable = ({
  filteredMembers,
  totalMembers,
  searchQuery,
  handleSort,
  getSortIcon,
  tableContainerRef,
  showScrollShadow,
  filters,
  setFilters,
  setSearchQuery,
  setSelectedMember,
  getAge,
  formatDate,
  verifiedMembers,
  pendingMembers,
}) => {
  const { deleteMember } = useMembers(); // Add this

  // State for update modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [memberToUpdate, setMemberToUpdate] = useState(null);

  // State for delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Handle edit button click
  const handleEditClick = (member, e) => {
    e.stopPropagation();
    setMemberToUpdate(member);
    setUpdateModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (member, e) => {
    e.stopPropagation();
    setMemberToDelete(member);
    setDeleteModalOpen(true);
    setDeleteError(null);
    setDeleteSuccess(false);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async (memberId) => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteMember(memberId);
      setDeleteSuccess(true);

      // Auto-close after 2 seconds
      setTimeout(() => {
        setDeleteModalOpen(false);
        setMemberToDelete(null);
        setDeleteSuccess(false);
      }, 2000);
    } catch (error) {
      // Handle API errors
      if (error.response && error.response.data) {
        const apiError = error.response.data;
        setDeleteError(
          apiError.message || "Failed to delete member. Please try again."
        );
      } else {
        setDeleteError("Failed to delete member. Please try again.");
      }
      console.error("Delete member error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Close delete modal
  const handleDeleteModalClose = () => {
    if (!isDeleting && !deleteSuccess) {
      setDeleteModalOpen(false);
      setMemberToDelete(null);
      setDeleteError(null);
      setDeleteSuccess(false);
    }
  };

  const handleMemberUpdated = (updatedMember) => {
    // we can add additional logic here if needed
  };

  return (
    <>
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-blue-500/10 dark:shadow-black/20 border border-white/30 dark:border-gray-700/30 overflow-hidden">
        {/* Table Header Info */}
        <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Total Participants{" "}
              <span className="text-blue-500">({filteredMembers.length})</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredMembers.length} of {totalMembers} participants
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        </div>

        {/* Excel-like Table Container */}
        <div className="relative">
          {/* Scroll Shadows */}
          {showScrollShadow.right && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent dark:from-gray-800/80 pointer-events-none z-10" />
          )}
          {showScrollShadow.bottom && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-800/80 pointer-events-none z-10" />
          )}

          {/* Table with Excel-like scrolling */}
          <div
            ref={tableContainerRef}
            className="overflow-auto max-h-[600px]"
          >
            <table className="w-full min-w-[1200px]">
              <thead className="sticky top-0 z-20">
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <th className="p-4 border-b-2 border-r border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors"
                    >
                      <span>Participant Details</span>
                      {getSortIcon("name")}
                    </button>
                  </th>
                  <th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleSort("mobile")}
                      className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors"
                    >
                      <span>Contact Information</span>
                      {getSortIcon("mobile")}
                    </button>
                  </th>
                  <th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleSort("cnic")}
                      className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors"
                    >
                      <span>Documents</span>
                      {getSortIcon("cnic")}
                    </button>
                  </th>
                  <th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleSort("bmVerification")}
                      className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors"
                    >
                      <span>Verification Status</span>
                      {getSortIcon("bmVerification")}
                    </button>
                  </th>
                  <th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white hover:text-blue-500 transition-colors"
                    >
                      <span>Registration Date</span>
                      {getSortIcon("createdAt")}
                    </button>
                  </th>
                  <th className="p-4 border-b-2 border-l border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-800 dark:text-white">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12"
                      >
                        <div className="text-gray-400 dark:text-gray-600 mb-4">
                          <FaSearch className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          No participants found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500 max-w-md">
                          {searchQuery
                            ? `No participants match "${searchQuery}". Try a different search term or clear filters.`
                            : "No participants available in the system."}
                        </p>
                        {(searchQuery ||
                          filters.verification !== "all" ||
                          filters.gender !== "all") && (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSearchQuery("");
                              setFilters({
                                verification: "all",
                                gender: "all",
                              });
                            }}
                            className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                          >
                            Clear all filters
                          </motion.button>
                        )}
                      </motion.div>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <motion.tr
                      key={member._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      }}
                      className="group cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-gray-700"
                      onClick={() => setSelectedMember(member)}
                    >
                      <td className="bg-white dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-gray-700/50 p-4 border-r border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className={`h-10 w-10 rounded-full flex items-center justify-center shadow-lg ${
                              member.gender === "Male"
                                ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                                : "bg-gradient-to-br from-pink-500 to-rose-500"
                            }`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {member.gender === "Male" ? (
                              <GiMale className="h-5 w-5 text-white" />
                            ) : (
                              <GiFemale className="h-5 w-5 text-white" />
                            )}
                          </motion.div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-[600] text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg whitespace-nowrap">
                                {member.name}
                              </h3>
                              <span className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full whitespace-nowrap">
                                {getAge(member.dob)} years
                              </span>
                            </div>
                            <p className="text-md text-gray-600 dark:text-gray-400">
                              {member.fatherName}
                            </p>
                            <p className="text-md font-bold italic text-blue-500 dark:text-blue-400 mt-1">
                              File: {member.fileNo}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                              <FaPhone className="h-3 w-3 text-blue-500" />
                            </div>
                            <span className="text-md font-medium text-gray-800 dark:text-gray-200">
                              {member.mobile}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                              <FaEnvelope className="h-3 w-3 text-blue-500" />
                            </div>
                            <span className="text-md text-gray-700 dark:text-gray-300 truncate">
                              {member.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                              <FaIdCard className="h-3 w-3 text-blue-500" />
                            </div>
                            <span className="text-md font-medium text-gray-800 dark:text-gray-200">
                              {member.cnic}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-lg">
                              <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                                Voucher: {member.feesVoucher}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
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
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {member.bmVerification
                              ? "✓ Eligible for draw"
                              : "⏳ Verification required"}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex items-center gap-2">
                            <FaCalendar className="h-4 w-4 text-blue-500" />
                            <span className="text-md font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                              {formatDate(member.createdAt)}
                            </span>
                          </div>
                          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold whitespace-nowrap">
                              Member since{" "}
                              <span className="text-blue-700 dark:text-green-500">
                                {formatDate(member.createdAt)}
                              </span>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="bg-white dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-gray-700/50 p-4 border-l border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-2">
                          {/* Mobile Layout: Eye icon on left, Delete/Edit stacked on right */}
                          {/* Desktop Layout: All icons in a row */}

                          <div className="flex flex-row md:flex-row items-center justify-between w-full md:w-auto gap-2 md:gap-2">
                            {/* View Button (Eye icon) - Left side on mobile, in row on desktop */}
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMember(member);
                              }}
                              className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all md:order-1"
                              title="View Details"
                            >
                              <FaEye className="h-4 w-4 text-white" />
                            </motion.button>

                            {/* Desktop: Delete and Edit buttons in row */}
                            <div className="hidden md:flex items-center gap-2">
                              {/* Delete Button */}
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleDeleteClick(member, e)}
                                className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all"
                                title="Delete"
                              >
                                <FaTrash className="h-4 w-4 text-white" />
                              </motion.button>

                              {/* Update / Edit Button */}
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleEditClick(member, e)}
                                className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all"
                                title="Edit"
                              >
                                <FaEdit className="h-4 w-4 text-white" />
                              </motion.button>
                            </div>

                            {/* Mobile: Delete and Edit buttons stacked vertically on right side */}
                            <div className="flex md:hidden flex-col items-center gap-2">
                              {/* Delete Button */}
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleDeleteClick(member, e)}
                                className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all"
                                title="Delete"
                              >
                                <FaTrash className="h-4 w-4 text-white" />
                              </motion.button>

                              {/* Update / Edit Button */}
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleEditClick(member, e)}
                                className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all"
                                title="Edit"
                              >
                                <FaEdit className="h-4 w-4 text-white" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Footer */}
        {filteredMembers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div>
              Showing{" "}
              <span className="font-bold text-gray-800 dark:text-white">
                {filteredMembers.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-800 dark:text-white">
                {totalMembers}
              </span>{" "}
              participants
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                Verified: {verifiedMembers}
              </span>
              <span className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                Pending: {pendingMembers}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Update Member Modal */}
      <UpdateMemberModal
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setMemberToUpdate(null);
        }}
        member={memberToUpdate}
        onMemberUpdated={handleMemberUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        member={memberToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        deleteError={deleteError}
        deleteSuccess={deleteSuccess}
      />
    </>
  );
};

export default MembersTable;
