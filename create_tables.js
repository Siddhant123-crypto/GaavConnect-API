require("dotenv").config();
const db = require("./config/db");

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,
    pincode VARCHAR(20),
    state VARCHAR(100),
    profession VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createSarpanchTable = `
CREATE TABLE IF NOT EXISTS sarpanch (
    id VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,
    pincode VARCHAR(20),
    state VARCHAR(100),
    profession VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(createUsersTable, (err, result) => {
    if (err) console.error("Error creating users table:", err);
    else console.log("Users table created successfully");

    db.query(createSarpanchTable, (err, result) => {
        if (err) console.error("Error creating sarpanch table:", err);
        else console.log("Sarpanch table created successfully");
        
        process.exit();
    });
});
