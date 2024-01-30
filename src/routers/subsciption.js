import express from "express";
import catchError from "../utils/catchError.js";
import * as subscriptionController from "../controllers/subscription.js";
import * as authorized from "../middlewares/auth.middleware.js";
const subscriptionRouter = express.Router();

subscriptionRouter
  .route("/")
  .post(
    authorized.verifyJWT,
    catchError(subscriptionController.createSubsciption)
  )
  .get(
    authorized.verifyJWT,
    catchError(subscriptionController.getAllSubsciptionData)
  );

export default subscriptionRouter;
