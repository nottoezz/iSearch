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

// trust proxy
app.set("trust proxy", 1);

// cors settings
const ORIGIN = process.env.ALLOWED_ORIGIN;
const corsOpts = {
  origin: ORIGIN,
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// cors
app.use(cors(corsOpts));
app.options("*", cors(corsOpts));

// parsers
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// basic rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

// health endpoints
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.head("/api/health", (_req, res) => res.status(200).end());

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/ratings", ratingRoutes);

// 404 handler (for unknown routes)
app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

// error handler (last)
app.use((err, _req, res, _next) => {
  // minimal log; avoid leaking internals to clients
  console.error("[error]", err?.message, err?.stack);
  const status = err.status || err.code || 500;
  res.status(Number.isInteger(status) ? status : 500).json({
    error: err?.message || "internal server error",
  });
});

export default app;
