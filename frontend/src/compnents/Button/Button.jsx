import React from "react";
import "./Button.css";

const Button = ({ text, loading = false, className, ...props }) => {
  return (
    <button
      className={`button-base ${className} ${loading ? "loading" : ""}`}
      {...props}
      disabled={loading}
    >
      {loading ? <span className="spinner"></span> : text}
    </button>
  );
};

export default Button;
