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
      const response = await axiosInstance.post("/members", memberData);

      // Update local state instantly (fast UX)
      setMembers((prev) => [response.data, ...prev]);

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
      const response = await axiosInstance.put(`/members/${id}`, memberData);

      // Update local state instantly (fast UX)
      setMembers((prev) =>
        prev.map((member) => (member._id === id ? response.data : member))
      );

      // Update selected member if it's the same
      if (selectedMember && selectedMember._id === id) {
        setSelectedMember(response.data);
      }

      return response.data;
    } catch (error) {
      console.error("Failed to update member", error);
      throw error;
    } finally {
      setLoading(false);
    }
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
    }
  }, [isLogin]);

  // ===============================
  // CONTEXT VALUE
  // ===============================
  const value = {
    members,
    loading,
    selectedMember,

    getAllMembers,
    getMemberById,
    addMember,
    updateMember,

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