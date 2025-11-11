
function responseFormatter(req, res, next) {
  res.success = (data = null, message = 'Success') => {
    res.status(200).json({
      status: 200,
      message: message,
      success: true,
      data: data
    });
  };

  res.error = (statusCode = 400, message = 'An error occurred', data = null) => {
    res.status(statusCode).json({
      status: statusCode,
      message: message,
      success: false,
      data: data
    });
  };

  next();
}

module.exports = responseFormatter;
