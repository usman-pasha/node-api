import express from "express";
import catchError from "../utils/catchError.js";
import * as categoryController from "../controllers/category.js";
import * as authorized from "../middlewares/auth.middleware.js";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .post(authorized.verifyJWT, catchError(categoryController.createCategory))
  .get(catchError(categoryController.getAllCategory));
categoryRouter
  .route("/single")
  .get(catchError(categoryController.getSingleCategory));

export default categoryRouter;
