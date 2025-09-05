// enc
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// import routes
import authRoutes from './routes/auth.routes.js';
import searchRoutes from "./routes/search.routes.js";

const app = express();

// CORS settings
const ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
const corsOpts = {
  origin: ORIGIN,
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// apply CORS middleware
app.use(cors(corsOpts));
app.options(/.*/, cors(corsOpts));

app.use(express.json());
app.use(cookieParser());

// import routes
app.use("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);

export default app;
