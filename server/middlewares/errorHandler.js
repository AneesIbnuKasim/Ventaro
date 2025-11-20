const logger = require('../utils/logger')
const { ResponseFormatter, sendError } = require('../utils/response')

const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn(message, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  })
  sendError(res, message, 404)
}

const errorHandler = (err, req, res, next) => {
  console.log('error handler: ',err);
  
  logger.error(err.message, { stack: err.stack });

  return ResponseFormatter.error(res, err)
}

module.exports = {
  errorHandler,
  notFound
};