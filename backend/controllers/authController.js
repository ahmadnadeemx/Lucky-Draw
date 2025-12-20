const User = require("../models/User");
const { generateToken } = require("../utils/jwtUtils");
const bcrypt = require("bcryptjs");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utils/responseUtils.js");

// Login with email/password
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ "userData.email": email });
    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendErrorResponse(res, "Invalid credentials", 400);
    }

    const authToken = generateToken({
      id: user._id,
      email: user.userData.email,
      isAdmin: user.isAdmin,
    });

    return sendSuccessResponse(res, {
      authToken,
      user: {
        id: user._id,
        userData: {
          name: user.userData.name,
          email: user.userData.email,
        },
        isAdmin: user.isAdmin,
      },
    }, "Login successful");
  } catch (error) {
    return sendErrorResponse(res, "Login failed", 500, error);
  }
};

// Login with token (verify token)
const loginWithToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    return sendSuccessResponse(res, {
      id: user._id,
      userData: {
        name: user.userData.name,
        email: user.userData.email,
      },
      isAdmin: user.isAdmin,
    }, "Token verified successfully", 200, false);
  } catch (error) {
    return sendErrorResponse(res, "Token verification failed", 500, error);
  }
};

// Signup new user
const signup = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ "userData.email": email });
    if (existingUser) {
      return sendErrorResponse(res, "User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userData: {
        name,
        email,
      },
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    await newUser.save();

    const authToken = generateToken({
      id: newUser._id,
      email: newUser.userData.email,
      isAdmin: newUser.isAdmin,
    });

    return sendSuccessResponse(res, {
      authToken,
      user: {
        id: newUser._id,
        userData: {
          name: newUser.userData.name,
          email: newUser.userData.email,
        },
        isAdmin: newUser.isAdmin,
      },
    }, "Signup successful", 201);
  } catch (error) {
    return sendErrorResponse(res, "Signup failed", 500, error);
  }
};

module.exports = { login, loginWithToken, signup };
