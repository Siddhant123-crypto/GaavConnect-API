const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const User = {

    create: function (userData, callback) {

        const userId = uuidv4();

        const sql = `
            INSERT INTO users
            (id, full_name, mobile, email, address, pincode, state, profession, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            userId,
            userData.fullName,
            userData.mobile,
            userData.email,
            userData.address,
            userData.pincode,
            userData.state,
            userData.profession,
            userData.password
        ];

        db.query(sql, values, function (err, result) {

            if (err) {
                return callback(err);
            }

            callback(null, {
                insertId: userId
            });
        });
    },

    findById: function (id, callback) {

        const sql = `
            SELECT
                id,
                full_name,
                mobile,
                email,
                address,
                pincode,
                state,
                profession
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
    }
};

module.exports = User;