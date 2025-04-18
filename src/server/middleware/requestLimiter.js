import { rateLimit } from "express-rate-limit";

export const requestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, //  every 1 min -> 10 wrong requests
  limit: 10,
  handler: (req, res, next) => {
    const retryAfter = req.rateLimit.resetTime - Date.now();
    const timeLeft = Math.ceil(retryAfter / 1000);

    res.status(429).json({
      message: `Too many requests, please try again in ${timeLeft} seconds.`
    });
  }
});
