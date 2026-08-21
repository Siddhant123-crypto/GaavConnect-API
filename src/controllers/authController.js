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
        const { email } = req.body;
        const result = await authService.forgotPassword(email);

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

/* ═══════════════════════════════════════════
   RESET PASSWORD  –  POST /api/auth/reset-password
═══════════════════════════════════════════ */

const resetPassword = async (req, res, next) => {
    try {
        const { token, otp, newPassword } = req.body;
        const result = await authService.resetPassword(token, otp, newPassword);

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

module.exports = { register, login, forgotPassword, resetPassword };
