// env
import dotenv from "dotenv";
dotenv.config();

// core
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// routes
import authRoutes from "./routes/auth.routes.js";
import searchRoutes from "./routes/search.routes.js";
import favouriteRoutes from "./routes/favourite.routes.js";
import ratingRoutes from "./routes/rating.routes.js";

const app = express();

// trust proxy (useful for secure cookies on render)
app.set("trust proxy", 1);

const DEFAULT_ORIGINS = ["http://localhost:5173", "https://nottoezz.github.io"];
const ENV_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([...DEFAULT_ORIGINS, ...ENV_ORIGINS])
);

const corsOpts = {
  origin(origin, cb) {
    // allow same-origin/no-origin (curl, health checks)
    if (!origin) return cb(null, true);
    // exact match against our allowlist
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false); // no CORS headers → browser blocks
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS for all routes (+ preflight)
app.use(cors(corsOpts));

// Parsers
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// --- Helper to pick correct cookie flags per request origin ---
export function cookieOptsFor(req) {
  const origin = req.get("origin") || "";
  const isLocal = origin.startsWith("http://localhost");
  return {
    httpOnly: true,
    sameSite: isLocal ? "lax" : "none", // 'none' required for cross-site
    secure: isLocal ? false : true, // must be true when sameSite === 'none'
    path: "/api/auth",
  };
}

// Rate limit auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.head("/api/health", (_req, res) => res.sendStatus(200));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/ratings", ratingRoutes);

// 404
app.use((_req, res) => res.status(404).json({ error: "not found" }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error("[error]", err?.message);
  const status = Number.isInteger(err?.status) ? err.status : 500;
  res.status(status).json({ error: err?.message || "internal server error" });
});

export default app;
