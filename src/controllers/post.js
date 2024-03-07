import { Post } from "../models/post.model.js";
import * as responser from "../utils/responser.js";
import ApiError from "../utils/appError.js";
import { Category } from "../models/category.model.js";

export const createPost = async (req, res) => {
  console.log("Creating Post");
  const reqData = req.body;
  reqData.userId = req.user?._id;
  if (!reqData.categoryId || !reqData.title) {
    throw new ApiError(400, "Required Parameters");
  }
  const payload = {
    userId: reqData.userId,
    categoryId: reqData.categoryId,
    title: reqData.title,
    postImage: reqData.postImage,
    description: reqData.description,
    createdBy: reqData.userId,
    updatedBy: reqData.userId,
  };
  console.log("Payload:", payload);
  const data = await Post.create(payload);
  await Category.findOneAndUpdate(
    { _id: data.categoryId },
    { $push: { postId: data._id } }
  );
  return responser.send(200, "Successfully Post Created", req, res, data);
};

export const getAllCurentUserPost = async (req, res) => {
  console.log("Get all Subsciption Data");
  const userId = req.user?._id;
  const post = await Post.find({ userId: userId })
    .populate("userId")
    .populate("categoryId");
  console.log(post);
  return responser.send(200, "Successfully Fetched All Post", req, res, post);
};

export const getSinglePost = async (req, res) => {
  console.log("Get Single Post");
  const postId = req.query.postId;
  const post = await Post.findOne({ _id: postId });
  console.log(post);
  return responser.send(
    200,
    "Successfully Fetched Single Post",
    req,
    res,
    post
  );
};

export const deletePost = async (req, res) => {
  console.log("Delete Single Post");
  const postId = req.params.postId;
  const post = await Post.findOneAndDelete({ _id: postId });
  const categoryId = await Category.findOneAndUpdate(
    { postId: postId },
    { $pull: { postId: postId } }
  );
  console.log(post);
  return responser.send(200, "Successfully Post Deleted", req, res, post);
};
