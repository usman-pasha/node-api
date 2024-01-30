import { Video } from "../models/video.model.js";
import * as responser from "../utils/responser.js";
import ApiError from "../utils/appError.js";

export const createVideo = async (req, res) => {
  console.log("Creating Video");
  const reqData = req.body;
  reqData.userId = req.user?._id;
  const payload = {
    videoFile: reqData.videoFile,
    thumbnail: reqData.thumbnail,
    title: reqData.title,
    description: reqData.description,
    duration: reqData.duration,
    owner: reqData.userId,
  };
  console.log("Payload:", payload);
  const data = await Video.create(payload);
  return responser.send(200, "Successfully Video Created", req, res, data);
};
