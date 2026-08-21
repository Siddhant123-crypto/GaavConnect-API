const db = require("../config/db");
const { randomUUID } = require("crypto");

const User = {

    create: function (userData, callback) {

        const sql = `
            INSERT INTO users
            (full_name, mobile, email, address, pincode, state, profession, user_type, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            userData.fullName,
            userData.mobile,
            userData.email,
            userData.address,
            userData.pincode,
            userData.state,
            userData.profession,
            userData.userType,
            userData.password
        ];

        db.query(sql, values, function (err, result) {
            if (err) {
                return callback(err);
            }
            callback(null, {
                insertId: result.insertId
            });
        });
    },

    findById: function (id, callback) {

        const sql = `
            SELECT *
            FROM users
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    },

    findByEmail: function (email, callback) {

        const sql = `
            SELECT * FROM users
            WHERE email = ?
        `;

        db.query(sql, [email], callback);
    },

    findByMobile: function (mobile, callback) {

        const sql = `
            SELECT * FROM users
            WHERE mobile = ?
        `;

        db.query(sql, [mobile], callback);
    },

    findByEmailOrMobile: function (emailOrMobile, callback) {
        const sql = `
            SELECT * FROM users
            WHERE email = ? OR mobile = ?
        `;
        db.query(sql, [emailOrMobile, emailOrMobile], callback);
    },

    updatePassword: function (id, newPassword, callback) {
        const sql = `
            UPDATE users
            SET password = ?
            WHERE id = ?
        `;
        db.query(sql, [newPassword, id], callback);
    }
};

module.exports = User;