const sendSuccessResponse = (res, data, message = "Success", statusCode = 200, showMessage = true) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    showMessage,
  });
};

// Utility function to send an error response
const sendErrorResponse = (res, message = "Internal Server Error", statusCode = 500, error = null, showMessage = true) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: error ? error.message : null,
    showMessage,
  });
};
module.exports = { sendSuccessResponse, sendErrorResponse };