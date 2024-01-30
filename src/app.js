import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// globalError
import errorHandler from "./utils/globalError.js";
import routes from "./routers/index.js";
import fs from "fs";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import YAML from "yaml";

import { createClient } from 'redis';

const redisClient = createClient({
  host: '127.0.0.1', // or 'localhost'
  port: 6379,
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('ready', () => {
  console.log('Redis client is ready to process commands');
});

redisClient.on('error', err => {
  console.log('Redis Client Error', err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = fs.readFileSync(path.resolve(__dirname, "./swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use("/public", express.static("public"));
app.use(cookieParser());

// routes
routes(app);

// ? Keeping swagger code at the end so that we can load swagger on "/" route
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none", // keep all the sections collapsed by default
    },
    customSiteTitle: "API docs..",
  })
);

app.use(errorHandler);

export { httpServer, app };
