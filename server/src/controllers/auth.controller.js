import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../services/token.service.js";

// cookie options for refresh token
const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth",
};

// POST register user
export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email & password required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ email, name, passwordHash });

    const accessToken = signAccessToken({ sub: user.id });
    const refreshToken = signRefreshToken({
      sub: user.id,
      tv: user.tokenVersion,
    });

    res
      .cookie("refresh_token", refreshToken, {
        ...cookieOpts,
        maxAge: 7 * 24 * 3600 * 1000,
      })
      .status(201)
      .json({
        accessToken,
        user: { id: user.id, email: user.email, name: user.name },
      });
  } catch (e) {
    next(e);
  }
}

// POST login user
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = signAccessToken({ sub: user.id });
    const refreshToken = signRefreshToken({
      sub: user.id,
      tv: user.tokenVersion,
    });

    res
      .cookie("refresh_token", refreshToken, {
        ...cookieOpts,
        maxAge: 7 * 24 * 3600 * 1000,
      })
      .json({
        accessToken,
        user: { id: user.id, email: user.email, name: user.name },
      });
  } catch (e) {
    next(e);
  }
}

// POST refresh
export async function refresh(req, res, next) {
  try {
    const rt = req.cookies?.refresh_token;
    if (!rt) return res.status(401).json({ error: "Missing refresh token" });

    const payload = verifyRefreshToken(rt);
    const accessToken = signAccessToken({ sub: payload.sub });
    const newRefresh = signRefreshToken({ sub: payload.sub, tv: payload.tv });

    res
      .cookie("refresh_token", newRefresh, {
        ...cookieOpts,
        maxAge: 7 * 24 * 3600 * 1000,
      })
      .json({ accessToken });
  } catch (e) {
    next(e);
  }
}

// POST logout user
export async function logout(_req, res) {
  res.clearCookie("refresh_token", { path: "/api/auth" }).json({ ok: true });
}

// GET me (remove later!)
export async function me(req, res) {
  res.json({ userId: req.user.sub });
}
