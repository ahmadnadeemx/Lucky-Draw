import React from "react";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";

const Home = () => {
  return (
    <div className="w-full bg-gray-100   dark:bg-gray-900 min-h-[calc(100vh-50px)] p-2 ">
      <motion.header
        className="hidden sm:flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow-sm mb-4 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your application data
          </p>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="blue-btn flex items-center gap-2"
          >
            <FiPlus /> Add Item
          </motion.button>
        </div>
      </motion.header>
    </div>
  );
};

export default Home;
