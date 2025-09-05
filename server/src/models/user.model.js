import mongoose from "mongoose";

// define user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true,
    },
    name: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
