import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrophy, 
  FaCrown, 
  FaStar, 
  FaUser, 
  FaPhone, 
  FaEnvelope,
  FaIdCard,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes
} from 'react-icons/fa';
import { GiMale, GiFemale } from 'react-icons/gi';

// Create a separate ParticleBackground component
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Set canvas size to match viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle colors (golden/confetti colors)
    const colors = [
      '#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1',
      '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height, // Start above canvas
        size: Math.random() * 6 + 2,
        speed: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.7 + 0.3,
        wobble: Math.random() * 2,
        wobbleSpeed: Math.random() * 0.05 + 0.02,
        rotation: Math.random() * 360
      });
    }

    let animationId;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        // Move particle down
        particle.y += particle.speed;
        particle.x += Math.sin(particle.wobble) * 0.8;
        particle.wobble += particle.wobbleSpeed;
        particle.rotation += 0.5;

        // Reset particle if it goes below canvas
        if (particle.y > canvas.height) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }

        // Draw particle with rotation for confetti effect
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);
        
        // Draw confetti shape (rectangle for confetti effect)
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fillRect(-particle.size/2, -particle.size/4, particle.size, particle.size/2);
        
        // Add shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(-particle.size/2, -particle.size/4, particle.size/2, particle.size/4);
        
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ background: 'transparent' }}
    />
  );
};

const WinnerResultModal = ({ isOpen, onClose, winnerData, totalParticipants }) => {
  const [showFireworks, setShowFireworks] = React.useState(true);

  useEffect(() => {
    if (isOpen) {
      // Stop fireworks after 10 seconds
      const timer = setTimeout(() => {
        setShowFireworks(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !winnerData) return null;

  const getAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Fullscreen particle animation - HIGHER Z-INDEX */}
      {showFireworks && <ParticleBackground />}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - LOWER Z-INDEX */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
              onClick={onClose}
            >
              {/* Modal Container - With max height for mobile */}
              <div className="w-full h-full max-h-[90vh] md:max-h-[85vh] flex items-center justify-center">
                {/* Modal */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 50 }}
                  transition={{ 
                    type: "spring", 
                    damping: 25, 
                    stiffness: 300,
                    delay: 0.2 
                  }}
                  className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-yellow-900/40 dark:to-orange-900/20 rounded-2xl md:rounded-3xl shadow-2xl shadow-yellow-500/30 dark:shadow-black/40 w-full max-w-2xl border-4 border-yellow-400 dark:border-yellow-600/50 overflow-y-auto max-h-full dark:bg-gray-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Crown Header */}
                  <div className="relative p-4 md:p-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="absolute top-3 right-3 md:top-4 md:right-4 h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <FaTimes className="h-4 w-4 md:h-5 md:w-5" />
                    </motion.button>
                    
                  
                    
                    <div className="text-center pt-2 md:pt-4">
                      <motion.h2
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl md:text-3xl font-bold text-white px-2"
                      >
                        🎉 CONGRATULATIONS! 🎉
                      </motion.h2>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm md:text-lg text-yellow-100 mt-1 md:mt-2"
                      >
                        We have a winner!
                      </motion.p>
                    </div>
                  </div>

                  {/* Winner Details - Scrollable area */}
                  <div className="p-4 md:p-6 overflow-y-auto">
                    {/* Winner Name Highlight */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="text-center mb-6 md:mb-8"
                    >
                      <div className="inline-flex flex-col sm:flex-row items-center gap-3 md:gap-4 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-300 dark:border-yellow-700/50">
                        <FaTrophy className="h-8 w-8 md:h-10 md:w-10 text-yellow-600 dark:text-yellow-400" />
                        <div className="text-center sm:text-left">
                          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-700 to-orange-700 dark:from-yellow-300 dark:to-orange-300 bg-clip-text text-transparent">
                            {winnerData.name}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                            File: {winnerData.fileNo}
                          </p>
                        </div>
                        <FaTrophy className="h-8 w-8 md:h-10 md:w-10 text-yellow-600 dark:text-yellow-400 hidden sm:block" />
                      </div>
                    </motion.div>

                    {/* Winner Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                      {/* Personal Info Card */}
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/80 dark:bg-gray-800/80 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <h4 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-2 md:mb-3 flex items-center gap-2">
                          <FaUser className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                          Personal Information
                        </h4>
                        <div className="space-y-1.5 md:space-y-2 text-sm md:text-base">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Father Name:</span>
                            <span className="font-semibold text-gray-800 dark:text-white mt-0.5 sm:mt-0">{winnerData.fatherName}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                            <div className="flex items-center gap-2 mt-0.5 sm:mt-0">
                              {winnerData.gender === "Male" ? (
                                <GiMale className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                              ) : (
                                <GiFemale className="h-3 w-3 md:h-4 md:w-4 text-pink-500" />
                              )}
                              <span className="font-semibold text-gray-800 dark:text-white">{winnerData.gender}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Age:</span>
                            <span className="font-semibold text-gray-800 dark:text-white mt-0.5 sm:mt-0">{getAge(winnerData.dob)} years</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Registration:</span>
                            <span className="font-semibold text-gray-800 dark:text-white mt-0.5 sm:mt-0 text-sm">{formatDate(winnerData.createdAt)}</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Contact Info Card */}
                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/80 dark:bg-gray-800/80 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <h4 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-2 md:mb-3 flex items-center gap-2">
                          <FaPhone className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                          Contact Information
                        </h4>
                        <div className="space-y-1.5 md:space-y-2 text-sm md:text-base">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Mobile:</span>
                            <span className="font-semibold text-gray-800 dark:text-white mt-0.5 sm:mt-0">{winnerData.mobile}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Email:</span>
                            <span className="font-semibold text-gray-800 dark:text-white mt-0.5 sm:mt-0">{winnerData.email || 'N/A'}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">CNIC:</span>
                            <span className="font-semibold text-gray-800 dark:text-white mt-0.5 sm:mt-0 text-sm">{winnerData.cnic}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Voucher:</span>
                            <span className="font-semibold text-gray-800 dark:text-white mt-0.5 sm:mt-0">{winnerData.feesVoucher}</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Verification Status */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="mb-4 md:mb-6"
                    >
                      <div className={`inline-flex flex-col sm:flex-row items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl ${
                        winnerData.bmVerification
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30'
                          : 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30'
                      }`}>
                        {winnerData.bmVerification ? (
                          <FaCheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <FaTimesCircle className="h-5 w-5 md:h-6 md:w-6 text-amber-600 dark:text-amber-400" />
                        )}
                        <div className="text-center sm:text-left">
                          <span className={`font-bold text-sm md:text-base ${
                            winnerData.bmVerification
                              ? 'text-green-700 dark:text-green-400'
                              : 'text-amber-700 dark:text-amber-400'
                          }`}>
                            {winnerData.bmVerification ? '✓ Verified Winner' : '⚠ Verification Pending'}
                          </span>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            {winnerData.bmVerification
                              ? 'Eligible for prize collection'
                              : 'Verification required before prize collection'}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Draw Statistics */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-blue-200 dark:border-blue-800/30"
                    >
                      <div className="flex justify-around md:justify-between">
                        <div className="text-center">
                          <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {totalParticipants}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Total Participants</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                            1
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Lucky Winner</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {((1 / totalParticipants) * 100).toFixed(2)}%
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Win Chance</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-3 md:p-6 border-t border-gray-200 dark:border-gray-700/50">
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm md:text-base"
                      >
                        Close
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.print()}
                        className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all text-sm md:text-base"
                      >
                        Print Result
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigator.clipboard.writeText(`🎉 Congratulations to ${winnerData.name} for winning the Lucky Draw! File: ${winnerData.fileNo}`);
                          alert('Result copied to clipboard!');
                        }}
                        className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all text-sm md:text-base"
                      >
                        Share Result
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default WinnerResultModal;