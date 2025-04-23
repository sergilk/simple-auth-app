import express from "express";
import { requestLimiter } from "../middleware/requestLimiter.js";
import {
  updateUserProfile,
  getUserData
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user", requestLimiter, authenticateToken, getUserData);
router.put("/user", requestLimiter, authenticateToken, updateUserProfile);

export default router;
