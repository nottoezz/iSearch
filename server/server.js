// import and configure dotenv
import dotenv from 'dotenv';
dotenv.config();

// import other necessary modules
import http from 'http';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

// set the port from environment variable or default to 8080
const PORT = process.env.PORT || 8080;

// invoke async func to connect to DB and start server
(async ()=> {
  console.log("Booting API...");
  await connectDB();
  http.createServer(app).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
