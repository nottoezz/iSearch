import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    itemId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true, versionKey: false }
);

// One rating per user per item
ratingSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);
