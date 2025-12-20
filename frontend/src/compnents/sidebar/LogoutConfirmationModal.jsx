import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSignOutAlt } from "react-icons/fa";

const LogoutConfirmationModal = ({ showLogoutModal, cancelLogout, confirmLogout }) => {
  return (
    <AnimatePresence>
      {showLogoutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 backdrop-blur-sm"
          onClick={cancelLogout} // clicking outside closes modal
        >
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()} // prevent closing on modal click
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 dark:bg-red-800 mb-4 shadow-inner">
                <FaSignOutAlt className="h-8 w-8 text-red-600 dark:text-red-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Are you sure you want to logout from your account? You will need to login again to access your data.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
                  onClick={cancelLogout}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition transform hover:scale-105"
                  onClick={confirmLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmationModal;
