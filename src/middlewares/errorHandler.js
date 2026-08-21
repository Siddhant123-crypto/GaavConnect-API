const ApiResponse = require('../utils/apiResponse');

/**
 * Global error handler — must be registered LAST in app.js
 */
const errorHandler = (err, req, res, next) => {
    console.error('💥 Unhandled error:', err);

    return ApiResponse.error(res, {
        statusCode: 500,
        message: 'Internal server error'
    });
};

module.exports = errorHandler;

