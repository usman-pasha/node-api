import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    postId: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    categoryName: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
