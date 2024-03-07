import { Category } from "../models/category.model.js";
import * as responser from "../utils/responser.js";
import ApiError from "../utils/appError.js";

export const createCategory = async (req, res) => {
  console.log("Creating Category");
  const reqData = req.body;
  reqData.userId = req.user?._id;
  if (!reqData.categoryName) {
    throw new ApiError(400, "Required Parameters");
  }
  const payload = {
    userId: reqData.userId,
    categoryName: reqData.categoryName,
    description: reqData.description,
    createdBy: reqData.userId,
    updatedBy: reqData.userId,
  };
  console.log("Payload:", payload);
  const data = await Category.create(payload);
  return responser.send(200, "Successfully Category Created", req, res, data);
};

export const getAllCategory = async (req, res) => {
  console.log("Get all Category Data");
  const post = await Category.find({});
  console.log(post);
  return responser.send(
    200,
    "Successfully Fetched All Categories",
    req,
    res,
    post
  );
};

export const getSingleCategory = async (req, res) => {
  console.log("Get Single Post");
  const categoryId = req.query.categoryId;
  const category = await Category.findOne({ _id: categoryId });
  console.log(category);
  return responser.send(
    200,
    "Successfully Fetched Single Category",
    req,
    res,
    category
  );
};
