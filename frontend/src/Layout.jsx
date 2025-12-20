import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { isLogin } = useAuth();
  const location = useLocation();

  const showOutlet = () => {
    if (isLogin) {
      return location.pathname !== "/login";
    } else {
      return location.pathname === "/login";
    }
  };

  return <>{showOutlet() && <Outlet />}</>;
};

export default Layout;
