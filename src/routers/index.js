import userRouter from "./user.js";
import subscriptionRouter from "./subsciption.js";
import videoRouter from "./video.js";
import postRouter from "./post.js";
import categoryRouter from "./category.js";

const APIVERSION = "api/v1";

const routes = async (app) => {
  app.use(`/${APIVERSION}/auth`, userRouter);
  app.use(`/${APIVERSION}/subsciption`, subscriptionRouter);
  app.use(`/${APIVERSION}/video`, videoRouter);
  app.use(`/${APIVERSION}/post`, postRouter);
  app.use(`/${APIVERSION}/category`, categoryRouter);
};

export default routes;
