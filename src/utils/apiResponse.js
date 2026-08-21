
class ApiResponse {

    static success(res, { statusCode = 200, message = 'Success' }) {
        return res.status(statusCode).json({
            success: true,
            message
        });
    }

    static error(res, { statusCode = 500, message = 'Internal Server Error' }) {
        return res.status(statusCode).json({
            success: false,
            message
        });
    }
}

module.exports = ApiResponse;

