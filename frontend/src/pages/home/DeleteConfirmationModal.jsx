import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaExclamationTriangle, FaTimesCircle, FaCheckCircle, FaSpinner } from "react-icons/fa";

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  member, 
  onConfirm,
  isDeleting = false,
  deleteError = null,
  deleteSuccess = false
}) => {
  
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-white via-gray-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900/10 rounded-2xl shadow-2xl shadow-red-500/20 dark:shadow-black/30 w-full max-w-md overflow-hidden border border-red-200/30 dark:border-red-800/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-red-500/5 via-transparent to-rose-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                      {deleteSuccess ? (
                        <FaCheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <FaTrash className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                        {deleteSuccess ? "Deleted!" : "Confirm Delete"}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {deleteSuccess 
                          ? "Member has been deleted successfully"
                          : "This action cannot be undone"}
                      </p>
                    </div>
                  </div>
                  {!deleteSuccess && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      disabled={isDeleting}
                      className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                    >
                      <FaTimesCircle className="h-5 w-5" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {deleteSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                  >
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      Member Deleted
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      <span className="font-bold text-gray-800 dark:text-white">{member.name}</span> has been removed from the system.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium shadow-lg shadow-gray-500/25 hover:shadow-gray-500/40 transition-all"
                    >
                      Close
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    {deleteError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 rounded-xl bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 border border-red-200 dark:border-red-800/30"
                      >
                        <div className="flex items-center gap-3">
                          <FaExclamationTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          <span className="text-red-700 dark:text-red-400 font-medium">
                            {deleteError}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Warning Message */}
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800/30">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaExclamationTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-amber-700 dark:text-amber-300 text-sm">
                            You are about to permanently delete this member. This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/30 dark:to-blue-900/10 border border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Member to be deleted:
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Name:</span>
                          <span className="font-semibold text-gray-800 dark:text-white">{member.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">File No:</span>
                          <span className="font-semibold text-gray-800 dark:text-white">{member.fileNo}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">CNIC:</span>
                          <span className="font-semibold text-gray-800 dark:text-white">{member.cnic}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Mobile:</span>
                          <span className="font-semibold text-gray-800 dark:text-white">{member.mobile}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </motion.button>
                      
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onConfirm(member._id)}
                        disabled={isDeleting}
                        className="flex-1 px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        {isDeleting ? (
                          <>
                            <FaSpinner className="h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <FaTrash className="h-4 w-4" />
                            Delete Permanently
                          </>
                        )}
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;