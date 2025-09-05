import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      index: true,
      required: true,
    },
    item: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Favourite", favouriteSchema);
