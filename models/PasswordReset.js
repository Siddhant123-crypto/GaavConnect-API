const db = require("../config/db");

const PasswordReset = {
    create: function (resetData, callback) {
        const sql = `
            INSERT INTO password_resets (user_id, otp, token, expires_at)
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            resetData.userId,
            resetData.otp,
            resetData.token,
            resetData.expiresAt
        ];

        db.query(sql, values, callback);
    },

    findByTokenAndOtp: function (token, otp, callback) {
        const sql = `
            SELECT * FROM password_resets
            WHERE token = ? AND otp = ?
        `;
        db.query(sql, [token, otp], callback);
    },

    markAsUsed: function (id, callback) {
        const sql = `
            UPDATE password_resets
            SET used = 1
            WHERE id = ?
        `;
        db.query(sql, [id], callback);
    }
};

module.exports = PasswordReset;
