import React from "react";
import { motion } from "framer-motion";

const SkeletonCell = ({ width = "100%", height = "16px" }) => (
  <div
    className="bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
    style={{ width, height }}
  />
);

const MembersTableSkeleton = ({ rows = 6 }) => {
  return (
    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden">
      {/* Header Skeleton */}
      <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <SkeletonCell width="220px" height="22px" />
        <div className="mt-2">
          <SkeletonCell width="300px" height="14px" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-auto max-h-[600px]">
        <table className="w-full min-w-[1200px]">
          <thead className="sticky top-0">
            <tr className="bg-gray-100 dark:bg-gray-900">
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="p-4 border-b">
                  <SkeletonCell width="140px" height="16px" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: rowIndex * 0.05 }}
                className="border-b border-gray-100 dark:border-gray-700"
              >
                {/* Participant */}
                <td className="p-4 border-r">
                  <div className="flex items-center gap-3">
                    <SkeletonCell width="40px" height="40px" />
                    <div className="space-y-2">
                      <SkeletonCell width="160px" />
                      <SkeletonCell width="120px" />
                      <SkeletonCell width="80px" />
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="p-4">
                  <SkeletonCell width="140px" />
                  <div className="mt-2">
                    <SkeletonCell width="180px" />
                  </div>
                </td>

                {/* Documents */}
                <td className="p-4">
                  <SkeletonCell width="160px" />
                  <div className="mt-2">
                    <SkeletonCell width="120px" />
                  </div>
                </td>

                {/* Verification */}
                <td className="p-4">
                  <SkeletonCell width="120px" height="28px" />
                </td>

                {/* Date */}
                <td className="p-4">
                  <SkeletonCell width="140px" />
                  <div className="mt-2">
                    <SkeletonCell width="160px" />
                  </div>
                </td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex gap-2">
                    <SkeletonCell width="40px" height="40px" />
                    <SkeletonCell width="40px" height="40px" />
                    <SkeletonCell width="40px" height="40px" />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTableSkeleton;
