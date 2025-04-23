import jwt from "jsonwebtoken";
import { usersDB } from "../../src/data/usersDB.js";
import { extractToken } from "../../src/utils/helpers.js";
import {
  validateUserInputs,
  validationRules
} from "../../src/utils/validation.js";

export const getUserData = (req, res) => {
  const token = extractToken(req);
  const JWT_KEY = process.env.JWT_TOKEN_KEY;

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_KEY);
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenHasExpired = decoded.exp <= currentTime;

    if (tokenHasExpired) {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
        tokenExpired: true
      });
    }

    const user = usersDB.find(u => u.userId === decoded.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.json({
      success: true,
      message: "User data retrieved",
      userName: user.userName,
      userEmail: user.userEmail,
      regDate: user.regDate,
      totalUsers: usersDB.length
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateUserProfile = (req, res) => {
  const { userName, userEmail } = req.body;
  const token = extractToken(req);
  const JWT_KEY = process.env.JWT_TOKEN_KEY;

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_KEY);
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenHasExpired = decoded.exp <= currentTime;

    if (tokenHasExpired) {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
        tokenExpired: true
      });
    }

    const user = usersDB.find(u => u.userId === decoded.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const fieldError = validateUserInputs({
      userName,
      userEmail,
      password: "",
      repeatedPassword: "",
      mode: "profile",
      isFrontEnd: false
    });

    if (fieldError.userName) {
      return res.status(400).json({
        success: false,
        message: `Rejected. Minimum ${validationRules.minLength} characters required, only Latin and digits.`
      });
    }
    if (fieldError.userEmail) {
      return res.status(400).json({
        success: false,
        message: "Rejected. Invalid email format. Example: user@example.com"
      });
    }

    if (user) {
      user.userName = userName;
      user.userEmail = userEmail;
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      totalUsers: usersDB.length,
      regDate: user.regDate,
      userName: user.userName,
      userEmail: user.userEmail
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
