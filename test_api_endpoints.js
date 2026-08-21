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

        console.log("\n=== 2. TEST DIRECT FORGOT PASSWORD ===");
        const forgotRes = await request('/api/auth/forgot-password', 'POST', {
            emailOrMobile: uniqueEmail,
            password: 'newpassword123',
            confirmpassword: 'newpassword123'
        }, 'dummy_token'); // Sending some token to bypass header check
        console.log(`Forgot Password Status: ${forgotRes.status} -> ${forgotRes.status === 200 ? 'PASS' : 'FAIL'}`);
        if(forgotRes.status !== 200) console.log(forgotRes.body);

        console.log("\n=== 3. TEST LOGIN WITH NEW PASSWORD ===");
        const loginRes = await request('/api/auth/login', 'POST', {
            emailOrMobile: uniqueEmail,
            password: 'newpassword123'
        });
        console.log(`Login Status: ${loginRes.status} -> ${loginRes.status === 200 ? 'PASS' : 'FAIL'}`);

    } catch (error) {
        console.error("Test execution failed:", error);
    } finally {
        process.exit();
    }
};

runTests();
