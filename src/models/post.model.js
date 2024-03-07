import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    title: { type: String },
    postImage: { type: String },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
