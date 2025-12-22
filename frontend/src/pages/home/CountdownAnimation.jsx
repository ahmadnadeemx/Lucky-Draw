import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const START_COUNT = 9;

const CountdownAnimation = ({ onComplete, isActive }) => {
  const [count, setCount] = useState(START_COUNT);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    setCount(START_COUNT);

    intervalRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev === 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // ✅ exact 1 second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            GET READY!
          </h2>
          <p className="text-xl text-white/80">Drawing winner in...</p>
        </motion.div>

        <div className="relative">
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-yellow-500/30"
          />

          {/* Middle ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-4 border-orange-500/20"
          />

          {/* Countdown container (NO text animation) */}
          <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-full  bg-gradient-to-br  from-black/50 to-gray-900/70 flex items-center justify-center border-8 border-yellow-500/40 shadow-2xl">
            <div className="text-center">
              {/* ✅ Plain text — no motion */}
              <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text dark:bg-none dark:text-white">
                {count}
              </div>

              {count === 0 && (
                <p className="mt-4 text-2xl text-green-400 font-bold">
                  AND THE WINNER IS...
                </p>
              )}
            </div>
          </div>

          {/* Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 200,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-yellow-500"
            />
          ))}
        </div>

        {/* Progress bar — synced with countdown */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: START_COUNT, ease: "linear" }}
          className="mt-8 h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full mx-auto max-w-md"
        />

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mt-6 text-lg text-white/60"
        >
          {count > 0 ? "Good luck everyone!" : "Congratulations to the winner!"}
        </motion.p>
      </div>
    </div>
  );
};

export default CountdownAnimation;
