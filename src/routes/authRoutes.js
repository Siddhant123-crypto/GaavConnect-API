const express = require('express');
const router  = express.Router();

const authController                  = require('../controllers/authController');
const { registerValidator,
        loginValidator,
        forgetPasswordValidator }              = require('../validators/authValidator');

// POST /api/auth/user/register
router.post('/user/register', registerValidator, authController.register);

// POST /api/auth/user/login
router.post('/user/login', loginValidator, authController.login);

// POST /api/auth/user/forget-password
router.post('/user/forget-password', forgetPasswordValidator, authController.forgetPassword);

module.exports = router;

