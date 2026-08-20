const express = require('express');
const router  = express.Router();

const authController                  = require('../controllers/authController');
const { registerValidator,
        loginValidator }              = require('../validators/authValidator');

// POST /api/auth/register
router.post('/register', registerValidator, authController.register);

// POST /api/auth/login
router.post('/login', loginValidator, authController.login);

module.exports = router;
