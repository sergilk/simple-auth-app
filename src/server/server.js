import dotenv from "dotenv";
dotenv.config({ path: "./src/server/.env" });

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/API", authRoutes);
app.use("/API", userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
