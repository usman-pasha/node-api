import express from "express";
import catchError from "../utils/catchError.js";
import * as postController from "../controllers/post.js";
import * as authorized from "../middlewares/auth.middleware.js";

const postRouter = express.Router();

postRouter
  .route("/")
  .post(authorized.verifyJWT, catchError(postController.createPost));
postRouter
  .route("/")
  .get(authorized.verifyJWT, catchError(postController.getAllCurentUserPost));
postRouter.route("/single").get(catchError(postController.getSinglePost));
postRouter.route("/:postId").delete(catchError(postController.deletePost));

export default postRouter;
