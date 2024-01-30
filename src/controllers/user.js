import * as responser from "../utils/responser.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/appError.js";
import { uploadOnCloudinary } from "../utils/base64.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//1.register
export const register = async (req, res) => {
  console.log("Starting Register Controller");
  const { fullName, email, username, password } = req.body;

  if (!fullName || !email || !username || !password) {
    throw new ApiError(400, "Required Parameters!");
  }
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  const avatar = await uploadOnCloudinary(req.body.avatar, "avatar-pics");
  const coverImage = await uploadOnCloudinary(
    req.body.coverImage,
    "cover-pics"
  );

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log("created user", createdUser);
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return responser.send(
    200,
    "User registered Successfully",
    req,
    res,
    createdUser
  );
};

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

//2.login
export const login = async (req, res) => {
  console.log(req.body);
  const { password, email, username } = req.body;
  if (!username && !email) {
    // if (!email || !username) {
    throw new ApiError(400, "Email Or Username is Required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isCorrectPassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);
  const record = {
    _id: loggedInUser._id,
    username: loggedInUser.username,
    email: loggedInUser.email,
    fullName: loggedInUser.fullName,
    avatar: loggedInUser.avatar,
    coverImage: loggedInUser.coverImage,
    accessToken,
    refreshToken,
  };
  return responser.send(200, "User logged In Successfully", req, res, record);
};

//3.logout User
export const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
  return responser.send(200, "User logged Out", req, res, {});
};

//4.refresh
export const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, "787t65r4efh8u8gtf4");
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", newRefreshToken, options);
    const record = { accessToken, refreshToken: newRefreshToken };
    return responser.send(200, "Access token refreshed", req, res, record);
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};

// 5.change password
export const changeCurrentPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return responser.send(200, "Password changed successfully", req, res, {});
};

// 6. currentUser
export const getCurrentUser = async (req, res) => {
  const currentUser = req.user;
  return responser.send(
    200,
    "User fetched successfully",
    req,
    res,
    currentUser
  );
};

// 7. updateAccount
export const updateAccountDetails = async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");
  return responser.send(
    200,
    "Account details updated successfully",
    req,
    res,
    user
  );
};

// 8.updateUserImages
export const updateUserImages = async (req, res) => {
  const reqData = req.body;
  let updateData = {};
  if (reqData.avatar) {
    const avatar = await uploadOnCloudinary(reqData.avatar, "avatar-pics");
    updateData = avatar.secure_url;
    if (!updateData) {
      throw new ApiError(400, "Error while uploading on avatar");
    }
  }
  if (reqData.coverImage) {
    const coverImage = await uploadOnCloudinary(
      reqData.coverImage,
      "cover-pics"
    );
    updateData = coverImage.secure_url;
    if (!updateData) {
      throw new ApiError(400, "Error while uploading on coverImage");
    }
  }

  const user = await User.findByIdAndUpdate(req.user?._id, updateData, {
    new: true,
  }).select("-password");
  return responser.send(200, "image updated successfully", req, res, user);
};

// 9.ChannelProfile
export const getUserChannelProfile = async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions", //subscription model
        localField: "_id", //userId
        foreignField: "channel", //subscription model channel field
        as: "subscribers",
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }
  return responser.send(
    200,
    "User channel fetched successfully",
    req,
    res,
    channel[0]
  );
};

export const getVideo = async (req, res) => {
  console.log(`Get Video`);
  const params = req.params;
  const video = await Video.findById({ _id: params.videoId });
  const userData = await User.findByIdAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(req.user?._id),
    },
    { $push: { watchHistory: video._id } },
    { new: true }
  );
  return responser.send(
    200,
    "User Video fetched successfully",
    req,
    res,
    video
  );
};

// 10 WatchHistory
export const getWatchHistory = async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return responser.send(
    200,
    "Watch history fetched successfully",
    req,
    res,
    // user
    user[0].watchHistory
  );
};
