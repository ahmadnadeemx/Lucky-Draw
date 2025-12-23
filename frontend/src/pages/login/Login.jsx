import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState("idle");
  const [pulse, setPulse] = useState(true);

  const { login, isLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginStatus("idle");

    try {
      let { success } = await login(email, password);
      if (success) {
        setLoginStatus("success");
      } else {
        setLoginStatus("error");
      }
    } catch (error) {
      setLoginStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate]);

  // Remove pulse after initial animation
  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.98 },
  };

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-50px)] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Animated Background Elements - Enhanced for light mode */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Light mode specific gradients */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse dark:bg-cyan-400/10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000 dark:bg-blue-400/10"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-gradient-to-br from-purple-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-500 dark:bg-purple-400/5"></div>

        {/* Additional light mode patterns */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-cyan-300/5 to-blue-300/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-300/5 to-purple-300/5 rounded-full blur-2xl animate-pulse delay-300"></div>
      </div>

      {/* Floating Particles - Enhanced for light mode */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0
                ? "bg-cyan-400/30 dark:bg-cyan-400/30"
                : i % 3 === 1
                ? "bg-blue-400/30 dark:bg-blue-400/30"
                : "bg-purple-400/20 dark:bg-purple-400/20"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${3 + Math.random() * 4}px`,
              height: `${3 + Math.random() * 4}px`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/40 dark:border-gray-700/30 rounded-3xl p-8 md:p-10 w-full max-w-md mx-4 shadow-2xl shadow-cyan-500/10 dark:shadow-cyan-400/5 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 dark:hover:shadow-cyan-400/10 ${
          loginStatus === "error"
            ? "border-red-400/50 dark:border-red-400/30"
            : ""
        }`}
      >
        {/* Decorative Corner Accents - Hidden on mobile */}
        <div className="hidden md:block absolute top-0 left-0 w-20 h-20 -translate-x-5 -translate-y-6">
          <div className="absolute w-32 h-32 border-t-2 border-l-2 border-cyan-400/30 dark:border-cyan-400/30 rounded-tl-3xl"></div>
        </div>
        <div className="hidden md:block absolute bottom-0 right-0 w-20 h-20 -translate-x-7 -translate-y-6">
          <div className="absolute w-32 h-32 border-b-2 border-r-2 border-cyan-400/30 dark:border-cyan-400/30 rounded-br-3xl"></div>
        </div>

        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-8 md:mb-10"
        >
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-70 animate-pulse"></div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>

          {/* Login Status Feedback */}
          <AnimatePresence>
            {loginStatus === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-sm mt-2"
              >
                Login failed. Please check your credentials.
              </motion.p>
            )}
            {loginStatus === "success" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-500 text-sm mt-2"
              >
                Login successful! Redirecting...
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <FaEnvelope className="text-gray-400 group-hover:text-cyan-500 transition-colors duration-300" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-200/70 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-lg group-hover:shadow-cyan-500/10"
                placeholder="Enter your email"
                required
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <FaLock className="text-gray-400 group-hover:text-cyan-500 transition-colors duration-300" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-200/70 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-lg group-hover:shadow-cyan-500/10"
                placeholder="Enter your password"
                required
              />
              <motion.button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isLoading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial="initial"
              animate={
                loginStatus === "error" ? { x: [0, -2, 2, -2, 2, 0] } : {}
              }
              transition={loginStatus === "error" ? { duration: 0.3 } : {}}
              className={`relative w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 text-white py-3 px-6 rounded-2xl overflow-hidden group transition-all duration-500 ${
                pulse ? "animate-pulse-subtle" : ""
              } ${
                loginStatus === "error"
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : ""
              }`}
            >
              {/* Button Background Animation */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  loginStatus === "error"
                    ? "bg-gradient-to-r from-red-600 to-orange-600"
                    : "bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700"
                }`}
              ></div>

              {/* Shimmer Effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer transition-all duration-1000"></div>

              {/* Button Content */}
              <div className="relative z-10 flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <FaSpinner className="h-5 w-5" />
                    </motion.div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">
                      {loginStatus === "error" ? "Try Again" : "Login"}
                    </span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-lg">→</span>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.button>
          </motion.div>
        </form>

        {/* Footer Note */}
        <motion.p
          variants={itemVariants}
          className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6 md:mt-8"
        >
          Secure login powered by advanced encryption
        </motion.p>
      </motion.div>

      {/* Add CSS for custom animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        @keyframes pulse-subtle {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.3);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(6, 182, 212, 0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
