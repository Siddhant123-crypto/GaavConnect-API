const express = require('express');
const router  = express.Router();

const authController                  = require('../controllers/authController');
const { registerValidator,
        loginValidator,
        forgetPasswordValidator }              = require('../validators/authValidator');

// POST /api/auth/register
router.post('/register', registerValidator, authController.register);

// POST /api/auth/login
router.post('/login', loginValidator, authController.login);

// POST /api/auth/forget-password
router.post('/forget-password', forgetPasswordValidator, authController.forgetPassword);

module.exports = router;

