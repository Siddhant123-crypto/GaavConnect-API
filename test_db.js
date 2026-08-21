require("dotenv").config();
const db = require("./config/db");

db.query("SHOW TABLES", (err, result) => {
    if (err) {
        console.error("Error showing tables:", err);
    } else {
        console.log("Tables:", result);
    }
    process.exit();
});
