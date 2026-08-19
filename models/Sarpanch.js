const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Sarpanch = {

    create: function (sarpanchData, callback) {

        const sarpanchId = uuidv4();

        const sql = `
            INSERT INTO sarpanch
            (id, full_name, mobile, email, address, pincode, state, profession, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            sarpanchId,
            sarpanchData.fullName,
            sarpanchData.mobile,
            sarpanchData.email,
            sarpanchData.address,
            sarpanchData.pincode,
            sarpanchData.state,
            sarpanchData.profession,
            sarpanchData.password
        ];

        db.query(sql, values, function (err, result) {

            if (err) {
                return callback(err);
            }

            callback(null, {
                insertId: sarpanchId
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
            FROM sarpanch
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    },

    findByEmail: function (email, callback) {

        const sql = `
            SELECT * FROM sarpanch
            WHERE email = ?
        `;

        db.query(sql, [email], callback);
    },

    findByMobile: function (mobile, callback) {

        const sql = `
            SELECT * FROM sarpanch
            WHERE mobile = ?
        `;

        db.query(sql, [mobile], callback);
    }
};

module.exports = Sarpanch;