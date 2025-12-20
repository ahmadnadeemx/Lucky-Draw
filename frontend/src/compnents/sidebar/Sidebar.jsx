import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoMenu, IoClose, IoHome, IoSunny, IoMoon } from "react-icons/io5";
import { PiSignInBold } from "react-icons/pi";
import { FaSignOutAlt, FaSyncAlt } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import UserInfoSideBar from "./UserInfoSideBar";
import { motion, AnimatePresence } from "framer-motion";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { IoMdLogOut } from "react-icons/io";

const Sidebar = () => {
  const { isLogin, logout, reloadData, isRefresing } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("isDarkMode");
    return savedMode !== null ? savedMode === "true" : true;
  });
  const location = useLocation();

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
  };

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: IoHome,
      link: "/",
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
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
    <div className="relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 dark:border-b border-gray-500 shadow-md h-[50px]">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Software
        </h1>

        {/* Menu Button for Small Screens */}
        <div className="flex items-center space-x-4 text-gray-800 dark:text-gray-100">
          {/* Logout icon (only if logged in) */}
          {isLogin && (
            <IoMdLogOut
              className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors"
              title="Logout"
              onClick={handleLogout}
            />
          )}

          {/* Dark/Light mode toggle icon */}
          {isDarkMode ? (
            <IoSunny
              className="w-6 h-6 cursor-pointer hover:text-yellow-400 transition-colors"
              title="Light Mode"
              onClick={toggleTheme}
            />
          ) : (
            <IoMoon
              className="w-6 h-6 cursor-pointer hover:text-blue-400 transition-colors"
              title="Dark Mode"
              onClick={toggleTheme}
            />
          )}

          <button
            onClick={toggleSidebar}
            aria-controls="default-sidebar"
            type="button"
            className="z-[20] p-2 rounded-lg sm:hidden 
           bg-gradient-to-r from-blue-500 to-cyan-500 text-white 
           dark:from-blue-400 dark:to-blue-300 dark:text-gray-900
           shadow-lg shadow-blue-500/30 dark:shadow-blue-300/30 transition-all duration-200
           focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-300"
          >
            <span className="sr-only">Open sidebar</span>
            <IoMenu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Overlay for small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white dark:bg-gray-800 shadow-lg overflow-hidden pt-[50px] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto">
          {/* Links Section */}
          <div className="flex-grow overflow-y-auto">
            <ul className="space-y-2 font-medium overflow-x-hidden">
              {/* Main links */}
              {isLogin && (
                <div>
                  <p className="text-gray-500 dark:text-gray-200">Main</p>
                  {menuItems.map((item, index) => {
                    const isActive =
                      location.pathname === item.link ||
                      location.pathname.startsWith(item.link + "/");

                    return (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onHoverStart={() => setHoveredItem(item.link)}
                        onHoverEnd={() => setHoveredItem(null)}
                        className="relative"
                      >
                        <NavLink
                          to={item.link}
                          className={`flex items-center p-[6px] mb-1 text-gray-900 rounded-lg dark:text-white ${
                            isActive
                              ? `bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500 text-white shadow-lg`
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          } group`}
                          onClick={handleLinkClick}
                        >
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={
                              hoveredItem === item.link
                                ? { rotate: 360 }
                                : { rotate: 0 }
                            }
                            transition={{ duration: 0.4 }}
                            className="relative z-10"
                          >
                            <item.icon
                              className={`w-5 h-5 ${
                                isActive
                                  ? "text-white"
                                  : "text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-white"
                              } transition-colors duration-300`}
                            />
                          </motion.div>
                          <span
                            className={`ms-3 ${isActive ? "text-white" : ""}`}
                          >
                            {item.name}
                          </span>
                        </NavLink>
                      </motion.li>
                    );
                  })}

                  <p className="text-gray-500 dark:text-gray-200 pt-5">Other</p>
                </div>
              )}

              {/* Login/Logout */}
              {isLogin ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-[6px] mb-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <FaSignOutAlt className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="ms-3">Logout</span>
                  </button>
                </li>
              ) : (
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `flex items-center p-[6px] mb-1 text-gray-900 rounded-lg dark:text-white ${
                        isActive
                          ? "bg-blue-200 dark:bg-blue-500"
                          : "hover:bg-blue-100 dark:hover:bg-blue-700"
                      } group`
                    }
                    onClick={handleLinkClick}
                  >
                    {({ isActive }) => (
                      <>
                        <PiSignInBold
                          className={`w-5 h-5 ${
                            isActive
                              ? "text-gray-500 dark:text-white"
                              : "text-gray-500 dark:group-hover:text-white"
                          }`}
                        />
                        <span className="ms-3">Login</span>
                      </>
                    )}
                  </NavLink>
                </li>
              )}

              {/* Dark/Light Mode Toggle */}
              <li>
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full p-[6px] mb-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  {isDarkMode ? (
                    <IoSunny className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white" />
                  ) : (
                    <IoMoon className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white" />
                  )}
                  <span className="ms-3">
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* User Info Section */}
          <UserInfoSideBar />
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        showLogoutModal={showLogoutModal}
        cancelLogout={cancelLogout}
        confirmLogout={confirmLogout}
      />
    </div>
  );
};

export default Sidebar;
