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

// cors (credentials need a concrete origin, not *)
const ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
const corsOpts = {
  origin: ORIGIN,
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204, // ok for legacy browsers
};

// security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// cors for all routes (this also handles preflight)
app.use(cors(corsOpts));

// parsers
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// rate limit auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.head("/api/health", (_req, res) => res.sendStatus(200));

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/ratings", ratingRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

// error handler
app.use((err, _req, res, _next) => {
  console.error("[error]", err?.message);
  const status = Number.isInteger(err?.status) ? err.status : 500;
  res.status(status).json({ error: err?.message || "internal server error" });
});

export default app;
