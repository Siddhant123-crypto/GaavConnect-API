const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "pass@123",
    database: process.env.DB_NAME || "gaavconnect",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
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