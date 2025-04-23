import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({ path: "server/.env" });
if (!process.env.PORT || !process.env.JWT_TOKEN_KEY) {
  console.log(
    "\x1b[33m",
    ".env not configured or missing, loading default .env.example configuration"
  );
  dotenv.config({ path: "server/.env.example" });
}

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET,POST,PUT",
    allowedHeaders: "Content-Type, Authorization"
  })
);

app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
