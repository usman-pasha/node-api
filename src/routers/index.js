import userRouter from "./user.js";
import subscriptionRouter from "./subsciption.js";
import videoRouter from "./video.js";
const APIVERSION = "api/v1";

const routes = async (app) => {
  app.use(`/${APIVERSION}/auth`, userRouter);
  app.use(`/${APIVERSION}/subsciption`, subscriptionRouter);
  app.use(`/${APIVERSION}/video`, videoRouter);
};

export default routes;
