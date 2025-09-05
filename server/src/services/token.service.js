import jwt from "jsonwebtoken";

// sign token
export const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// sign refresh token
export const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

// verify token
export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

// verify refresh token
export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);
