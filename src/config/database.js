const mysql = require('mysql2');

const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: { rejectUnauthorized: false },  // required for Aiven cloud MySQL

    connectionLimit:    10,
    waitForConnections: true,
    queueLimit:         0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL connection error:', err.message);
        return;
    }
    console.log('✅ Connected to MySQL database');
    connection.release();
});

module.exports = pool.promise();
