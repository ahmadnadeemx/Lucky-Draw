import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";

const MembersContext = createContext(null);

export const MembersProvider = ({ children }) => {
  const { isLogin } = useAuth();

  // ===============================
  // State
  // ===============================
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [drawResult, setDrawResult] = useState(null); // Add this
  const [isDrawing, setIsDrawing] = useState(false); // Add this

  // ===============================
  // API FUNCTIONS
  // ===============================

  // Get all members
  const getAllMembers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/members");
      setMembers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  // Get single member by ID
  const getMemberById = async (id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/members/${id}`);
      setSelectedMember(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch member", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new member
  const addMember = async (memberData) => {
    try {
      setLoading(true);

      // Check if it's FormData (for file upload) or regular object
      const config = {};
      if (memberData instanceof FormData) {
        config.headers = {
          "Content-Type": "multipart/form-data",
        };
      }

      const response = await axiosInstance.post("/members", memberData, config);

      // Update local state instantly (fast UX)
      setMembers((prev) => [response.data.member, ...prev]);

      return response.data;
    } catch (error) {
      console.error("Failed to add member", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  // Update existing member
  const updateMember = async (id, memberData) => {
    try {
      setLoading(true);

      // Check if it's FormData (for file upload) or regular object
      const config = {};
      if (memberData instanceof FormData) {
        config.headers = {
          "Content-Type": "multipart/form-data",
        };
      }

      const response = await axiosInstance.put(
        `/members/${id}`,
        memberData,
        config
      );

      // Update local state instantly (fast UX)
      setMembers((prev) =>
        prev.map((member) =>
          member._id === id ? response.data.member : member
        )
      );

      // Update selected member if it's the same
      if (selectedMember && selectedMember._id === id) {
        setSelectedMember(response.data.member);
      }

      return response.data;
    } catch (error) {
      console.error("Failed to update member", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  // Delete existing member
  const deleteMember = async (id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/members/${id}`);

      // Update local state instantly (fast UX)
      setMembers((prev) => prev.filter((member) => member._id !== id));

      // Clear selected member if it's the same
      if (selectedMember && selectedMember._id === id) {
        setSelectedMember(null);
      }

      return response.data;
    } catch (error) {
      console.error("Failed to delete member", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Lucky Draw - Get random member
  const performLuckyDraw = async () => {
    try {
      setIsDrawing(true);
      setDrawResult(null);

      const response = await axiosInstance.get("/members/draw/random");

      if (response.data.success) {
        setDrawResult(response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to perform draw");
      }
    } catch (error) {
      console.error("Lucky draw error:", error);
      throw error;
    } finally {
      setIsDrawing(false);
    }
  };

  // Clear draw result
  const clearDrawResult = () => {
    setDrawResult(null);
  };

  // ===============================
  // AUTH-BASED AUTO LOGIC
  // ===============================

  useEffect(() => {
    // When admin logs in → fetch all members
    if (isLogin) {
      getAllMembers();
    }

    // When user logs out → clear members
    if (!isLogin) {
      setMembers([]);
      setSelectedMember(null);
      setDrawResult(null);
    }
  }, [isLogin]);

  // ===============================
  // CONTEXT VALUE
  // ===============================
  const value = {
    members,
    loading,
    selectedMember,
    drawResult, // Add this
    isDrawing, // Add this

    getAllMembers,
    getMemberById,
    addMember,
    updateMember,
    deleteMember,
    performLuckyDraw, // Add this
    clearDrawResult, // Add this

    setSelectedMember,
  };

  return (
    <MembersContext.Provider value={value}>{children}</MembersContext.Provider>
  );
};

// ===============================
// CUSTOM HOOK
// ===============================
export const useMembers = () => {
  const context = useContext(MembersContext);
  if (!context) {
    throw new Error("useMembers must be used within a MembersProvider");
  }
  return context;
};
