import { verifyAccessToken } from "../services/token.service.js";

// export auth func
export default function auth(req, res, next) {
  const hdr = req.headers.authorization;
  const token = hdr.split(" ")[1]?.trim();

  // if no token return err
  if (!token) return res.status(401).json({ error: "Missing acess token" });

  // try verify token
  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid/Expired access token" });
  }
}
