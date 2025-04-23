import jwt from "jsonwebtoken";
import { extractToken } from "../../src/utils/helpers.js";

export const authenticateToken = (req, res, next) => {
  const token = extractToken(req);
  const JWT_KEY = process.env.JWT_TOKEN_KEY;

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  jwt.verify(token, JWT_KEY, (err, user) => {
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
