import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGift, FaTrophy, FaStar, FaFire, FaRocket } from 'react-icons/fa';
import ParticleAnimation from './ParticleAnimation';

const LuckyDrawButton = ({ onClick, isLoading, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const [showStars, setShowStars] = useState(false);

  // Pulsing effect every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && !isLoading) {
        setIsPulsing(prev => !prev);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, isLoading]);

  // Random star animation
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setShowStars(true);
        setTimeout(() => setShowStars(false), 500);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <>
      {/* Particle Animation */}
      <ParticleAnimation isActive={isHovered} particleCount={50} />

      <div className="relative">
        {/* Floating stars */}
        <AnimatePresence>
          {showStars && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50
                  }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="absolute top-1/2 left-1/2"
                >
                  <FaStar className="h-4 w-4 text-yellow-400" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main Draw Button */}
        <motion.button
          onClick={onClick}
          disabled={disabled || isLoading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isPulsing ? {
            scale: [1, 1.02, 1],
            boxShadow: [
              "0 0 20px rgba(255, 215, 0, 0.3)",
              "0 0 40px rgba(255, 215, 0, 0.6)",
              "0 0 20px rgba(255, 215, 0, 0.3)"
            ]
          } : {}}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="relative overflow-hidden group px-12 py-8 rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white font-bold text-3xl md:text-4xl shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Background shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "200%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 1
            }}
          />

          {/* Inner glow */}
          <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-yellow-200/20 to-orange-200/10 blur-md" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4">
            {/* Icon */}
            <motion.div
              animate={isLoading ? {
                rotate: 360
              } : isHovered ? {
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={isLoading ? {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              } : {
                duration: 0.5,
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 0.5
              }}
              className="relative"
            >
              {isLoading ? (
                <FaRocket className="h-16 w-16" />
              ) : (
                <FaGift className="h-16 w-16" />
              )}
              
              {/* Small orbiting stars */}
              <motion.div
                animate={isHovered ? {
                  rotate: 360
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-2 -right-2"
              >
                <FaStar className="h-6 w-6 text-yellow-300" />
              </motion.div>
              <motion.div
                animate={isHovered ? {
                  rotate: -360
                } : {}}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -bottom-2 -left-2"
              >
                <FaStar className="h-5 w-5 text-yellow-300" />
              </motion.div>
            </motion.div>

            {/* Text */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3">
                <FaTrophy className="h-8 w-8" />
                <motion.h2
                  animate={isHovered ? {
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isHovered ? Infinity : 0,
                    repeatDelay: 0.5
                  }}
                  className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent"
                >
                  LUCKY DRAW
                </motion.h2>
                <FaFire className="h-8 w-8" />
              </div>
              
              <motion.p
                animate={isHovered ? {
                  y: [0, -2, 0]
                } : {}}
                transition={{
                  duration: 0.8,
                  repeat: isHovered ? Infinity : 0
                }}
                className="text-lg md:text-xl font-semibold mt-2 text-yellow-100"
              >
                {isLoading ? "Selecting Winner..." : "Click to Pick a Winner!"}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0.7 }}
                animate={isHovered ? { opacity: 1 } : {}}
                className="text-sm md:text-base font-medium mt-1 text-yellow-200/90"
              >
                One lucky participant will win!
              </motion.p>
            </div>
          </div>

          {/* Fire effect on hover */}
          <AnimatePresence>
            {isHovered && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
              >
                <div className="flex">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        y: [0, -5, 0]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      className="mx-1"
                    >
                      <FaFire className={`h-${4 + i} w-${4 + i} text-orange-500`} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
};

export default LuckyDrawButton;