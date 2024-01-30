import express from "express";
import catchError from "../utils/catchError.js";
import * as videoController from "../controllers/video.js";
import * as authorized from "../middlewares/auth.middleware.js";
const videoRouter = express.Router();

videoRouter
  .route("/")
  .post(authorized.verifyJWT, catchError(videoController.createVideo));

export default videoRouter;
