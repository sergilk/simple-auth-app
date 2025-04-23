import express from "express";
import { signUp, logIn } from "../controllers/authController.js";
import { requestLimiter } from "../middleware/requestLimiter.js";

const router = express.Router();

router.post("/signup", requestLimiter, signUp);
router.post("/login", requestLimiter, logIn);

export default router;
