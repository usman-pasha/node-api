import mongoose from "mongoose";
import { DBNAME } from "../constants.js";

export let dbInstance = undefined;

const connectDataBase = async () => {
  try {
    const uri = `${process.env.MONGODB_URI}/${DBNAME}`;
    const connectionInstance = await mongoose.connect(uri);
    dbInstance = connectionInstance;
    console.log(
      `MongoDB Connected! Db host:${connectionInstance.connection.host} `
    );
  } catch (err) {
    console.log("MongoDB Connection error:", err);
    process.exit(1);
  }
};

export default connectDataBase
