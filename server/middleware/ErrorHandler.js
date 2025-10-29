const {
  VALIDATION_ERROR,
  FORBIDDEN,
  FILE_NOT_FOUND,
  UNAUTHORIZED,
  SERVER_ERROR
} = require('../constant');

const ErrorHandler = (err, req, res, next) => {
  const statuscode = res.statusCode ? res.statusCode : 500;

  switch (statuscode) {
    case VALIDATION_ERROR:
      res.status(400).json({ title: "Validation Error", message: err.message, stackTrace: err.stack });
      break;
    case FORBIDDEN:
      res.status(403).json({ title: "Forbidden", message: err.message, stackTrace: err.stack });
      break;
    case FILE_NOT_FOUND:
      res.status(404).json({ title: "Not Found", message: err.message, stackTrace: err.stack });
      break;
    case UNAUTHORIZED:
      res.status(401).json({ title: "Unauthorized", message: err.message, stackTrace: err.stack });
      break;
    case SERVER_ERROR:
      res.status(500).json({ title: "Server Error", message: err.message, stackTrace: err.stack });
      break;
    default:
      res.status(statuscode).json({
        title: "Unknown Error",
        message: err.message,
        stackTrace: err.stack
      });
  }
};

module.exports = ErrorHandler;
