import React, { useState, useMemo, useRef, useEffect } from "react";
import { useMembers } from "../../../context/MembersContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendar,
  FaArrowRight,
  FaUserCircle,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaDownload,
  FaPrint,
  FaEye,
  FaEdit,
  FaUserPlus, // Add this
} from "react-icons/fa";
import { GiMale, GiFemale } from "react-icons/gi";
import MemberDetailModal from "./MemberDetailModal";
import MembersTable from "./MembersTable/MembersTable";
import AddMemberModal from "./AddMemberModal";
import CountdownAnimation from "./CountdownAnimation";
import WinnerResultModal from "./WinnerResultModal";
import LuckyDrawButton from "./LuckyDrawButton";
import LuckyDrawSkeleton from "./LuckyDrawSkeleton";

const Home = () => {
  const { members, performLuckyDraw, loading } = useMembers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  const [isDrawInProgress, setIsDrawInProgress] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [drawWinner, setDrawWinner] = useState(null);

  const handleLuckyDraw = async () => {
    if (members.length === 0) {
      alert("No participants available for the draw!");
      return;
    }

    try {
      setIsDrawInProgress(true);
      setShowCountdown(true);
      setDrawWinner(null); // Reset previous winner

      // Start the API call immediately but store the promise
      const drawPromise = performLuckyDraw();

      const countdownDuration = 15000;

      // Create a timeout that will complete after countdown
      const countdownTimeout = setTimeout(async () => {
        try {
          // Now wait for the API result (it might already be resolved or still pending)
          const result = await drawPromise;
          setDrawWinner(result);
          setShowWinnerModal(true);
        } catch (error) {
          console.error("Draw failed:", error);
          alert(error.response?.data?.message || "Failed to perform draw");
        } finally {
          setShowCountdown(false);
          setIsDrawInProgress(false);
        }
      }, countdownDuration);

      // Store the timeout to clear if needed
      return () => clearTimeout(countdownTimeout);
    } catch (error) {
      console.error("Draw error:", error);
      setIsDrawInProgress(false);
      setShowCountdown(false);
    }
  };

  // Add this function for countdown completion
  const handleCountdownComplete = () => {
    // This is handled in the setTimeout above
  };

  // Add this function to close winner modal
  const handleCloseWinnerModal = () => {
    setShowWinnerModal(false);
    setDrawWinner(null);
  };

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [filters, setFilters] = useState({
    verification: "all",
    gender: "all",
  });
  const tableContainerRef = useRef(null);
  const [showScrollShadow, setShowScrollShadow] = useState({
    right: false,
    bottom: false,
  });

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const handleMemberAdded = (newMember) => {
    // can add logic here
  };
  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (member) =>
          member.name?.toLowerCase().includes(query) ||
          member.fatherName?.toLowerCase().includes(query) ||
          member.cnic?.toLowerCase().includes(query) ||
          member.email?.toLowerCase().includes(query) ||
          member.mobile?.toLowerCase().includes(query) ||
          member.fileNo?.toLowerCase().includes(query) ||
          member.feesVoucher?.toLowerCase().includes(query)
      );
    }

    // Apply verification filter
    if (filters.verification !== "all") {
      result = result.filter((member) =>
        filters.verification === "verified"
          ? member.bmVerification
          : !member.bmVerification
      );
    }

    // Apply gender filter
    if (filters.gender !== "all") {
      result = result.filter((member) => member.gender === filters.gender);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle dates
        if (sortConfig.key === "createdAt" || sortConfig.key === "dob") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Handle strings
        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [members, searchQuery, sortConfig, filters]);

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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="opacity-30" />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // Calculate statistics
  const totalMembers = members.length;
  const verifiedMembers = members.filter((m) => m.bmVerification).length;
  const pendingMembers = members.filter((m) => !m.bmVerification).length;
  const maleMembers = members.filter((m) => m.gender === "Male").length;
  const femaleMembers = members.filter((m) => m.gender === "Female").length;

  // Check scroll position for shadow effect
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollShadow({
        right:
          container.scrollLeft < container.scrollWidth - container.clientWidth,
        bottom:
          container.scrollTop < container.scrollHeight - container.clientHeight,
      });
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => container.removeEventListener("scroll", handleScroll);
  }, [filteredMembers.length]);

  // Export functions
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Father Name",
      "Age",
      "Gender",
      "Mobile",
      "Email",
      "CNIC",
      "File No",
      "Fees Voucher",
      "Verification",
      "Registration Date",
    ];
    const csvData = filteredMembers.map((member) => [
      member.name,
      member.fatherName,
      getAge(member.dob),
      member.gender,
      member.mobile,
      member.email,
      member.cnic,
      member.fileNo,
      member.feesVoucher,
      member.bmVerification ? "Verified" : "Pending",
      formatDate(member.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participants-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printTable = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Participants List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f3f4f6; padding: 12px; text-align: left; border: 1px solid #d1d5db; }
            td { padding: 10px; border: 1px solid #d1d5db; }
            .verified { color: #059669; }
            .pending { color: #d97706; }
          </style>
        </head>
        <body>
          <h1>Lucky Draw Participants (${filteredMembers.length} members)</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Father Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>CNIC</th>
                <th>File No</th>
                <th>Fees Voucher</th>
                <th>Status</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredMembers
                .map(
                  (member) => `
                <tr>
                  <td>${member.name}</td>
                  <td>${member.fatherName}</td>
                  <td>${getAge(member.dob)}</td>
                  <td>${member.gender}</td>
                  <td>${member.mobile}</td>
                  <td>${member.email}</td>
                  <td>${member.cnic}</td>
                  <td>${member.fileNo}</td>
                  <td>${member.feesVoucher}</td>
                  <td class="${member.bmVerification ? "verified" : "pending"}">
                    ${member.bmVerification ? "Verified" : "Pending"}
                  </td>
                  <td>${formatDate(member.createdAt)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
            Generated on ${new Date().toLocaleString()}
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 p-2 sm:p-4 md:p-6">
      {/* Lucky Draw Section */}
      {loading ? (
        <LuckyDrawSkeleton />
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="my-12 text-center relative"
        >
          {/* Lucky Draw Stamp */}
          {/* <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.5,
            }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-1/4 md:translate-x-0 md:top-1/4 z-0 pointer-events-none"
          >
            <div className="relative">
              <img
                src="/images/luckydrawstemp.png"
                alt="Lucky Draw Stamp"
                className="w-32 h-32 md:w-55 md:h-55 opacity-90 drop-shadow-2xl animate-pulse-slow"
              />
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-xl"
              />
            </div>
          </motion.div> */}

          {/* Another stamp on the other side for balance */}
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.7,
            }}
            className="absolute -top-10 right-1/2 translate-x-1/2 md:right-1/4 md:translate-x-0 md:top-1/4 z-0 pointer-events-none"
          >
            <div className="relative">
              {/* <img
                src="/images/luckydrawstemp.png"
                alt="Lucky Draw Stamp"
                className="w-28 h-28 md:w-40 md:h-40 opacity-80 drop-shadow-2xl animate-pulse-slow rotate-12"
              /> */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, -3, 3, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5,
                }}
                className="absolute inset-0 bg-gradient-to-l from-amber-500/20 to-yellow-500/20 rounded-full blur-lg"
              />
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                🎉{" "}
                <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  SS Build And Prop Interior
                </span>
                <span className="inline-block rotate-[270deg]">🎉</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                Click the button below to randomly select one lucky winner from{" "}
                {totalMembers} participants!
              </p>

              {totalMembers > 0 ? (
                <div className="text-center">
                  <LuckyDrawButton
                    onClick={handleLuckyDraw}
                    isLoading={isDrawInProgress}
                    disabled={members.length === 0 || isDrawInProgress}
                  />
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    {members.length} participants are eligible for the draw
                  </p>
                </div>
              ) : (
                <div className="text-center p-8 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl relative z-10">
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Add participants first to start the lucky draw!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Floating stamp at the bottom for more decoration */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 0.7 }}
            transition={{ delay: 1 }}
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 z-0 pointer-events-none"
          >
            {/* <img
              src="/images/luckydrawstemp.png"
              alt="Lucky Draw Stamp"
              className="w-24 h-24 opacity-70 blur-[1px]"
            /> */}
          </motion.div>
        </motion.div>
      )}
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] h-[45px]">
              Lucky Draw Participants
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 md:mt-2">
              Welcome to the lucky draw participants dashboard
            </p>
          </div>

          {/* Export Controls */}
          {/* Export Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Add this button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddMemberModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
            >
              <FaUserPlus className="h-5 w-5" />
              Add Participant
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all"
            >
              <FaDownload /> Export CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={printTable}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
            >
              <FaPrint /> Print
            </motion.button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-blue-500/5 mb-8 border border-white/30 dark:border-gray-700/30">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search participants by name, CNIC, mobile, email, file number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50/80 dark:bg-gray-700/80 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-lg group-hover:shadow-blue-500/10"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={filters.verification}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, verification: e.target.value }))
                }
                className="px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-gray-800 dark:text-white transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Only</option>
              </select>

              <select
                value={filters.gender}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, gender: e.target.value }))
                }
                className="px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-gray-800 dark:text-white transition-all duration-300"
              >
                <option value="all">All Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {/* Total Members Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5 rounded-2xl p-6 backdrop-blur-sm border border-blue-200/20 dark:border-blue-500/10 group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Total Participants
              </h3>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FaUserCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {totalMembers}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Registered in the draw
            </p>
          </div>
        </motion.div>

        {/* Verified Members Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/5 dark:to-emerald-500/5 rounded-2xl p-6 backdrop-blur-sm border border-green-200/20 dark:border-green-500/10 group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Verified
              </h3>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <FaCheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
              {verifiedMembers}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex justify-between">
              <span>Ready for the draw</span>
              <span className="font-bold">
                {Math.round((verifiedMembers / totalMembers) * 100)}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pending Verification Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-yellow-500/10 dark:from-amber-500/5 dark:to-yellow-500/5 rounded-2xl p-6 backdrop-blur-sm border border-amber-200/20 dark:border-amber-500/10 group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Pending
              </h3>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <FaTimesCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
              {pendingMembers}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex justify-between">
              <span>Awaiting verification</span>
              <span className="font-bold">
                {Math.round((pendingMembers / totalMembers) * 100)}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Gender Distribution Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 rounded-2xl p-6 backdrop-blur-sm border border-purple-200/20 dark:border-purple-500/10 group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Gender Distribution
              </h3>
              <div className="flex gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <GiMale className="h-5 w-5 text-white" />
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <GiFemale className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {maleMembers}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Male</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {femaleMembers}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Female
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Table Container */}
      <MembersTable
        filteredMembers={filteredMembers}
        totalMembers={totalMembers}
        searchQuery={searchQuery}
        handleSort={handleSort}
        getSortIcon={getSortIcon}
        tableContainerRef={tableContainerRef}
        showScrollShadow={showScrollShadow}
        filters={filters}
        setFilters={setFilters}
        setSearchQuery={setSearchQuery}
        setSelectedMember={setSelectedMember}
        getAge={getAge}
        formatDate={formatDate}
        verifiedMembers={verifiedMembers}
        pendingMembers={pendingMembers}
      />

     
      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onMemberAdded={handleMemberAdded}
      />

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberDetailModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
      {/* Countdown Animation */}
      <CountdownAnimation
        onComplete={handleCountdownComplete}
        isActive={showCountdown}
        drawResult={drawWinner}
        apiLoading={isDrawInProgress}
      />

      <WinnerResultModal
        isOpen={showWinnerModal}
        onClose={handleCloseWinnerModal}
        winnerData={drawWinner?.winner}
        totalParticipants={totalMembers}
      />


    </div>
  );
};

export default Home;
