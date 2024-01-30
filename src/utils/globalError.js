// Package Imports

// Custom Imports
import * as responser from "./responser.js";

const sendError = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return responser.send(err.statusCode, err.message, req, res, err);
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    return responser.send(500, "something went wrong", req, res, err);
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let error = err;
  sendError(error, req, res);
};

export default errorHandler;
