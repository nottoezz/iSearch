// import and configure dotenv
import dotenv from "dotenv";
dotenv.config();

// core
import http from "http";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

// render injects PORT; default for local dev
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0"; // bind all interfaces 

console.log("Booting API...");
const server = http.createServer(app);
server.listen(PORT, HOST, () => {
  console.log(`✅ API listening on http://${HOST}:${PORT}`);
});

// connect to mongo in the background 
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

// optional: log unhandled promise rejections (helps debugging)
process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection:", err);
});
