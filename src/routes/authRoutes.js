const express = require('express');
const router  = express.Router();

const authController                  = require('../controllers/authController');
const { registerValidator,
        loginValidator }              = require('../validators/authValidator');

// POST /api/auth/user/register
router.post('/user/register', (req, res, next) => {
    req.body.userType = 'normal';
    next();
}, registerValidator, authController.register);

// POST /api/auth/sarpanch/register
router.post('/sarpanch/register', (req, res, next) => {
    req.body.userType = 'sarpanch';
    next();
}, registerValidator, authController.register);

// POST /api/auth/login
router.post('/login', loginValidator, authController.login);

module.exports = router;
