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

const forgotPassword = async (emailOrMobile, newPassword) => {
    // 1. Find the user
    const findUser = () => new Promise((resolve, reject) => {
        User.findByEmail(emailOrMobile, (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) {
                User.findByMobile(emailOrMobile, (err, mobileRows) => {
                    if (err) return reject(err);
                    resolve(mobileRows);
                });
            } else {
                resolve(rows);
            }
        });
    });

    const rows = await findUser();
    if (!rows || rows.length === 0) {
        throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    const user = rows[0];

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const updatePwd = () => new Promise((resolve, reject) => {
        User.updatePassword(user.id, hashedPassword, (err, result) => err ? reject(err) : resolve(result));
    });

    await updatePwd();

    return { message: 'Password updated successfully' };
};

module.exports = { register, login, forgotPassword };
