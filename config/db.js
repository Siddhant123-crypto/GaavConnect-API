const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass@123",
    database: "gaavconnect"
});

db.connect(function (err) {

    if (err) {
        console.log("Database connection failed");
        console.log(err);
        return;
    }

    console.log("MySQL connected successfully");
});

module.exports = db;