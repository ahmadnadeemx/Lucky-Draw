import React from "react";
import { motion } from "framer-motion";

const SkeletonLine = ({ width = "100%", height = "16px" }) => (
  <div
    className="bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mx-auto"
    style={{ width, height }}
  />
);

const LuckyDrawSkeleton = () => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="my-12 text-center"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          {/* Title Skeleton */}
          <div className="flex justify-center mb-6">
            <SkeletonLine width="420px" height="48px" />
          </div>

          {/* Subtitle Skeleton */}
          <SkeletonLine width="520px" height="20px" />
          <div className="mt-3">
            <SkeletonLine width="380px" height="18px" />
          </div>

          {/* Button Skeleton */}
          <div className="mt-10 flex justify-center">
            <div className="h-14 w-64 rounded-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse shadow-lg" />
          </div>

          {/* Helper text */}
          <div className="mt-4">
            <SkeletonLine width="260px" height="16px" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LuckyDrawSkeleton;
