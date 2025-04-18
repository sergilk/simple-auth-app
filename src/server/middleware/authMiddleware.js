import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/env.js";
import { extractToken } from "../../utils/helpers.js";

export const authenticateToken = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or token expired. Please log in again.",
        isTokenValid: false
      });
    }
    req.user = user;
    next();
  });
};
