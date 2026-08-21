const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

/* ═══════════════════════════════════════════
   REGISTER  –  POST /api/auth/register
═══════════════════════════════════════════ */

const register = async (req, res, next) => {
    try {
        const { user, token } = await authService.register(req.body);

        return ApiResponse.success(res, {
            statusCode: 201,
            message: 'Registration successful',
            data: { user, token }
        });

    } catch (error) {
        if (error.statusCode) {
            return ApiResponse.error(res, {
                statusCode: error.statusCode,
                message: error.message
            });
        }
        next(error);
    }
};

/* ═══════════════════════════════════════════
   LOGIN  –  POST /api/auth/login
═══════════════════════════════════════════ */

const login = async (req, res, next) => {
    try {
        const { emailOrMobile, password } = req.body;

        const { user, token } = await authService.login(emailOrMobile, password);

        return ApiResponse.success(res, {
            statusCode: 200,
            message: 'Login successful',
            data: { user, token }
        });

    } catch (error) {
        if (error.statusCode) {
            return ApiResponse.error(res, {
                statusCode: error.statusCode,
                message: error.message
            });
        }
        next(error);
    }
};

/* ═══════════════════════════════════════════
   FORGOT PASSWORD  –  POST /api/auth/forgot-password
═══════════════════════════════════════════ */

const forgotPassword = async (req, res, next) => {
    try {
        const { emailOrMobile, password } = req.body;
        let token = null;

        // Check for Bearer token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return ApiResponse.error(res, {
                statusCode: 400,
                message: 'Token is required in Authorization header as Bearer token'
            });
        }

        const result = await authService.forgotPassword(emailOrMobile, password, token);

        return ApiResponse.success(res, {
            statusCode: 200,
            message: result.message
        });
    } catch (error) {
        if (error.statusCode) {
            return ApiResponse.error(res, {
                statusCode: error.statusCode,
                message: error.message
            });
        }
        next(error);
    }
};

module.exports = { register, login, forgotPassword };
