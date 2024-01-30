import { Subsciption } from "../models/subscription.model.js";
import * as responser from "../utils/responser.js";
import ApiError from "../utils/appError.js";

export const createSubsciption = async (req, res) => {
  console.log("Creating Subscription");
  const reqData = req.body;
  reqData.userId = req.user?._id;
  const payload = {
    subscriber: reqData.userId,
    channel: reqData.userId,
  };
  console.log("Payload:", payload);
  const data = await Subsciption.create(payload);
  return responser.send(
    200,
    "Successfully Subscription Created",
    req,
    res,
    data
  );
};

export const getAllSubsciptionData = async (req, res) => {
  console.log("Get all Subsciption Data");
  const subscriberUser = await Subsciption.aggregate([
    {
      $match: {
        subscriber: req.user?._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "users-data",
      },
    },
    {
      $addFields: {
        isData: {
          $cond: {
            if: { $in: [req.user?._id, "$users-data._id"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        subscriber: 1,
        channel: 1,
        "users-data._id": 1,
        "users-data.username": 1,
        "users-data.fullName": 1,
        "users-data.avatar": 1,
        isData: 1,
      },
    },
  ]);
  console.log(subscriberUser);
  return responser.send(
    200,
    "Successfully Get Subscriber User",
    req,
    res,
    subscriberUser
  );
};
