const http = require('http');
const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "pass@123",
    database: process.env.DB_NAME || "gaavconnect",
    ssl: { rejectUnauthorized: false }
});

const request = (path, method, body = null, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    body: data ? JSON.parse(data) : null
                });
            });
        });

        req.on('error', e => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const runTests = async () => {
    try {
        const uniqueEmail = `test${Date.now()}@gmail.com`;
        
        console.log("=== 1. TEST REGISTER ===");
        const regRes = await request('/api/auth/user/register', 'POST', {
            fullName: 'Test User',
            mobile: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
            email: uniqueEmail,
            address: 'Pune',
            pincode: '411001',
            state: 'Maharashtra',
            profession: 'Farmer',
            userType: 'normal',
            password: 'password123',
            confirmPassword: 'password123'
        });
        console.log(`Register Status: ${regRes.status} -> ${regRes.status === 201 ? 'PASS' : 'FAIL'}`);

        console.log("\n=== 2. TEST FORGOT PASSWORD ===");
        const forgotRes = await request('/api/auth/forgot-password', 'POST', {
            email: uniqueEmail
        });
        console.log(`Forgot Password Status: ${forgotRes.status} -> ${forgotRes.status === 200 ? 'PASS' : 'FAIL'}`);
        
        let token = null;
        if(forgotRes.status === 200) {
            // Fetch token from DB
            const [user] = await db.query("SELECT id FROM users WHERE email = ?", [uniqueEmail]);
            if(user.length > 0) {
                const [reset] = await db.query("SELECT token FROM password_resets WHERE user_id = ? ORDER BY id DESC LIMIT 1", [user[0].id]);
                if (reset.length > 0) {
                    token = reset[0].token;
                }
            }
        }

        if (token) {
            console.log("\n=== 3. TEST RESET PASSWORD WITH BEARER TOKEN ===");
            const resetRes = await request('/api/auth/reset-password', 'POST', {
                emailOrMobile: uniqueEmail,
                password: 'newpassword123',
                confirmpassword: 'newpassword123'
            }, token); // Pass token to Authorization header
            console.log(`Reset Password Status: ${resetRes.status} -> ${resetRes.status === 200 ? 'PASS' : 'FAIL'}`);
        }

    } catch (error) {
        console.error("Test execution failed:", error);
    } finally {
        process.exit();
    }
};

runTests();
