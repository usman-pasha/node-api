const isNumeric = (value) => {
  return /^-?\d+$/.test(value);
};

const getMessage = (handler) => {
  return handler;
};

const isStatusCode = (statusCode) => {
  return isNumeric(statusCode) && statusCode >= 100 && statusCode < 600;
};

const successResponse = (handler, req, data, success) => {
  let responseData = {
    status: "success",
    message: getMessage(handler),
    success,
    data,
  };
  if (Array.isArray(data)) responseData.totals = { count: data.length };
  console.log(`Success || ${handler} || ${req.originalUrl}`);
  return responseData;
};

const errorResponse = (handler, req, error) => {
  // Response Data for the client request
  let response = {
    status: "error",
    message: handler ? getMessage(handler) : "Unknown Error",
  };
  if (error.isOperational) {
    // If mergeOptional is true, then merge translated error Message and Optional Parameters
    if (error.mergeOptional) {
      response.message = response.message + " : " + error.optionalMessage;
    } else {
      response.errorDetails = error.optionalMessage;
    }
  }
  // If message is dynamic (for refund message) in the error response for Maxis
  if (error.dynamicMessage) {
    response.message = error.dynamicMessage;
    response.errorDetails = error.data;
  }
  console.log("Error", response);
  return response;
};

export const send = (statusCode, handler, req, res, data, success = true) => {
  let responseData;
  statusCode = isStatusCode(statusCode) ? statusCode : 500;
  if (`${statusCode}`.startsWith("2"))
    responseData = successResponse(handler, req, data, success);
  if (`${statusCode}`.startsWith("4") || `${statusCode}`.startsWith("5"))
    responseData = errorResponse(handler, req, data);
  res.status(statusCode).send(responseData);
};
