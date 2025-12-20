import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../services/authService";
import { useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("authToken") || null
  );
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectRoute, setRedirectRoute] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // 🟢 Run once to handle auto-login if token exists
  const autoLogin = useCallback(async () => {
    if (!authToken) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await authService.loginWithToken();

      if (data?.userData && data?.isAdmin) {
        setUser(data.userData);
        setIsLogin(true);
      } else {
        throw new Error("Invalid user data");
      }
    } catch (err) {
      console.error("Auto-login failed:", err);
      logout(false); // Don't toast or navigate if auto-login fails
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // Run autoLogin only once on mount
  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  // Set redirect route if trying to access protected route
  useEffect(() => {
    if (!isLogin && location.pathname !== "/login") {
      setRedirectRoute(location.pathname);
    }
  }, [isLogin, location.pathname]);

  // Redirect user after login or block access
  useEffect(() => {
    if (!loading) {
      if (!isLogin && location.pathname !== "/login") {
        navigate("/login");
      } else if (isLogin && location.pathname === "/login") {
        navigate(redirectRoute || "/");
      }
    }
  }, [isLogin, location.pathname, loading, navigate, redirectRoute]);

  // 🔐 Manual login
  const login = async (email, password) => {
    try {
      const response = await authService.loginWithEmail(email, password);
      const { authToken, user } = response.data;

      setAuthToken(authToken);
      setUser(user);
      setIsLogin(true);

      if (!redirectRoute || redirectRoute === "/login") {
        navigate("/");
      } else {
        navigate(redirectRoute);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = (shouldToast = true) => {
    setAuthToken(null);
    setUser(null);
    setIsLogin(false);
    if (shouldToast) toast.success("Logged out successfully");
    navigate("/login");
  };

  // Persist token in localStorage
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        authToken,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
