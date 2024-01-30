import dotenv from "dotenv";
import connectDataBase from "./db/index.js";
import { httpServer, app } from "./app.js";

dotenv.config({ path: "./.env" });

const startServer = () => {
  httpServer.listen(process.env.PORT || 8080, () => {
    console.info(
      `📑🌹Visit the documentation at: http://localhost:${
        process.env.PORT || 8080
      }`
    );
    console.log(
      "App is running at http://localhost:%d in %s mode",
      process.env.PORT,
      app.get("env")
    );
    console.log("Press CTRL-C to stop\n");
  });
};

const majorNodeVersion = +process.env.NODEVERSION?.split(".")[0] || 0;

if (majorNodeVersion >= 14) {
  try {
    await connectDataBase();
    startServer();
  } catch (err) {
    console.log("Mongo db connect error: ", err);
  }
} else {
  connectDataBase()
    .then(() => {
      startServer();
    })
    .catch((err) => {
      console.log("Mongo db connect error: ", err);
    });
}
