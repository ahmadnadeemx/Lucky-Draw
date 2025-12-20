const { decodeToken } = require("../utils/jwtUtils");
const { sendErrorResponse } = require("../utils/responseUtils");
const User = require("../models/User");

// 1. Middleware: Strict Authentication
const isLogin = async (req, res, next) => {
  let authToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    authToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.authToken) {
    authToken = req.cookies.authToken;
  }

  if (!authToken) {
    return sendErrorResponse(res, "Not authorized", 401);
  }

  try {
    const decoded = decodeToken(authToken);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return sendErrorResponse(res, "Invalid token", 401, err);
  }
};

// 2. Middleware: Admin Authorization
const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return sendErrorResponse(res, "Not authenticated", 401);
  }

  if (!req.user.isAdmin) {
    return sendErrorResponse(res, "Access denied. Admins only.", 403);
  }

  next();
};

// 3. Middleware: Optional Authentication
const attachUser = async (req, res, next) => {
  let authToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    authToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.authToken) {
    authToken = req.cookies.authToken;
  }

  if (!authToken) {
    req.user = undefined;
    return next();
  }

  try {
    const decoded = decodeToken(authToken);
    req.user = await User.findById(decoded.id).select("-password");
  } catch (err) {
    req.user = undefined;
  }

  next();
};

module.exports = {
  isLogin,
  isAdmin,
  attachUser,
};
