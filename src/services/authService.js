const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const User   = require('../../models/User');
const PasswordReset = require('../../models/PasswordReset');
const { sendResetEmail } = require('../../utils/emailService');

/* ───────────── helpers ───────────── */

const generateToken = (user) =>
    jwt.sign(
        { id: user.id || user.insertId, userType: user.user_type },
        process.env.JWT_SECRET || 'super_secret_fallback_key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

/* ═══════════════════════════════════════════
   REGISTER
   POST /api/auth/register
═══════════════════════════════════════════ */

const register = async (userData) => {
    const {
        fullName,
        mobile,
        email,
        address,
        pincode,
        state,
        profession,
        userType,
        password
    } = userData;

    /* ── 1. duplicate checks ── */

    const findByEmail = (e) => new Promise((resolve, reject) => {
        User.findByEmail(e, (err, rows) => err ? reject(err) : resolve(rows));
    });
    const emailRows = await findByEmail(email);
    if (emailRows.length > 0)
        throw Object.assign(new Error('Email is already registered'), { statusCode: 409 });

    const findByMobile = (m) => new Promise((resolve, reject) => {
        User.findByMobile(m, (err, rows) => err ? reject(err) : resolve(rows));
    });
    const mobileRows = await findByMobile(mobile);
    if (mobileRows.length > 0)
        throw Object.assign(new Error('Mobile number is already registered'), { statusCode: 409 });

    /* ── 2. hash password ── */

    const hashedPassword = await bcrypt.hash(password, 12);

    /* ── 3. insert user ── */

    const createUser = (data) => new Promise((resolve, reject) => {
        User.create(data, (err, result) => err ? reject(err) : resolve(result));
    });

    const { insertId } = await createUser({
        fullName,
        mobile,
        email,
        address,
        pincode,
        state,
        profession,
        userType,
        password: hashedPassword
    });

    /* ── 4. fetch newly created user ── */

    const findById = (id) => new Promise((resolve, reject) => {
        User.findById(id, (err, rows) => err ? reject(err) : resolve(rows));
    });

    const rows = await findById(insertId);
    const newUser = rows[0] || { id: insertId };

    /* ── 5. generate JWT ── */

    const token = generateToken(newUser);

    return { user: newUser, token };
};

/* ═══════════════════════════════════════════
   LOGIN
   POST /api/auth/login
═══════════════════════════════════════════ */

const login = async (emailOrMobile, password) => {

    /* ── 1. find user ── */
    const findUser = (eOrM) => new Promise((resolve, reject) => {
        User.findByEmailOrMobile(eOrM, (err, rows) => err ? reject(err) : resolve(rows));
    });

    const rows = await findUser(emailOrMobile);
    if (rows.length === 0)
        throw Object.assign(new Error('User not found'), { statusCode: 404 });

    const user = rows[0];

    /* ── 3. verify password ── */

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

    /* ── 4. generate token ── */

    const token = generateToken(user);

    /* ── 5. return safe user object (no password) ── */

    const userResponse = {
        id:         user.id,
        fullName:   user.full_name,
        mobile:     user.mobile,
        email:      user.email,
        address:    user.address,
        pincode:    user.pincode,
        state:      user.state,
        profession: user.profession,
        userType:   user.user_type,
        status:     user.status,
        createdAt:  user.created_at,
        updatedAt:  user.updated_at
    };

    return { user: userResponse, token };
};

/* ═══════════════════════════════════════════
   FORGOT PASSWORD
   POST /api/auth/forgot-password
═══════════════════════════════════════════ */

const forgotPassword = async (email) => {
    const findUser = (email) => new Promise((resolve, reject) => {
        User.findByEmailOrMobile(email, (err, rows) => err ? reject(err) : resolve(rows));
    });

    const rows = await findUser(email);
    if (!rows || rows.length === 0) {
        throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    const user = rows[0];

    // Generate secure Token (UUID)
    const token = crypto.randomUUID();
    
    // Expires in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    const createResetRecord = () => new Promise((resolve, reject) => {
        PasswordReset.create({
            userId: user.id,
            otp: 'NA', // Dummy OTP since schema still requires it
            token,
            expiresAt
        }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });

    await createResetRecord();

    // Send Email
    try {
        await sendResetEmail(user.email, token);
    } catch (err) {
        console.error("Email send error:", err);
        // Continue even if email fails in local testing due to bad SMTP config
    }

    return { message: 'Password reset link sent to your email.', token: token };
};

/* ═══════════════════════════════════════════
   RESET PASSWORD
   POST /api/auth/reset-password
═══════════════════════════════════════════ */

const resetPassword = async (token, newPassword) => {
    
    const findToken = () => new Promise((resolve, reject) => {
        PasswordReset.findByToken(token, (err, rows) => err ? reject(err) : resolve(rows));
    });

    const rows = await findToken();
    if (!rows || rows.length === 0) {
        throw Object.assign(new Error('Invalid token'), { statusCode: 400 });
    }

    const resetRecord = rows[0];

    // Check expiry
    if (new Date(resetRecord.expires_at) < new Date()) {
        throw Object.assign(new Error('Token has expired'), { statusCode: 400 });
    }

    // Check if used
    if (resetRecord.used) {
        throw Object.assign(new Error('Token has already been used'), { statusCode: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const updatePwd = () => new Promise((resolve, reject) => {
        User.updatePassword(resetRecord.user_id, hashedPassword, (err, result) => err ? reject(err) : resolve(result));
    });

    await updatePwd();

    // Mark token as used
    const markUsed = () => new Promise((resolve, reject) => {
        PasswordReset.markAsUsed(resetRecord.id, (err, result) => err ? reject(err) : resolve(result));
    });

    await markUsed();

    return { message: 'Password updated successfully' };
};

module.exports = { register, login, forgotPassword, resetPassword };
