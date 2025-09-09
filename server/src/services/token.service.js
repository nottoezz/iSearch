import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

function requireEnv(name, def) {
  const v = process.env[name] ?? def;
  if (!v || !String(v).trim()) {
    throw new Error(`[ENV] Missing required ${name}`);
  }
  return String(v).trim();
}

const ACCESS_SECRET = requireEnv("JWT_SECRET");
const REFRESH_SECRET = requireEnv("JWT_REFRESH_SECRET");
const ACCESS_EXP = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_EXP = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export const signAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });

export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);

export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);
