import express from "express";
import catchError from "../utils/catchError.js";
import * as userController from "../controllers/user.js";
import * as authorized from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

const checkHealth = async (req, res) => {
  return res.status(200).send({ message: "Success Dtaa" });
};

userRouter.route("/").get(catchError(checkHealth));
userRouter.route("/register").post(catchError(userController.register));
userRouter.route("/login").post(catchError(userController.login));
userRouter
  .route("/logout")
  .get(authorized.verifyJWT, catchError(userController.logoutUser));
userRouter
  .route("/refresh-token")
  .post(catchError(userController.refreshAccessToken));
userRouter
  .route("/change-password")
  .post(authorized.verifyJWT, catchError(userController.changeCurrentPassword));
userRouter
  .route("/current-user")
  .get(authorized.verifyJWT, catchError(userController.getCurrentUser));
userRouter
  .route("/update-account")
  .patch(authorized.verifyJWT, catchError(userController.updateAccountDetails));
userRouter
  .route("/image")
  .patch(authorized.verifyJWT, catchError(userController.updateUserImages));
userRouter
  .route("/get-video/:videoId")
  .get(authorized.verifyJWT, userController.getVideo);
userRouter
  .route("/history")
  .get(authorized.verifyJWT, userController.getWatchHistory);

export default userRouter;
