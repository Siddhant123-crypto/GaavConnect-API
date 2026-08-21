const http = require('http');

const makeRequest = (path, method, data) => {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
};

(async () => {
    try {
        console.log("--- TEST REGISTER ---");
        const registerResponse = await makeRequest('/api/auth/register', 'POST', {
            fullName: "Prerana Patil",
            mobile: "9876543210",
            email: "prerana@example.com",
            address: "Pune",
            pincode: "411001",
            state: "Maharashtra",
            profession: "Engineer",
            userType: "normal",
            password: "password123",
            confirmPassword: "password123"
        });
        console.log(registerResponse);

        console.log("--- TEST LOGIN ---");
        const loginResponse = await makeRequest('/api/auth/login', 'POST', {
            emailOrMobile: "prerana@example.com",
            password: "password123"
        });
        console.log(loginResponse);
        
        if (loginResponse.data && loginResponse.data.token) {
            console.log("SUCCESS: JWT token generated ->", loginResponse.data.token);
        } else {
            console.error("FAIL: JWT token is missing!");
        }
    } catch(err) {
        console.error(err);
    }
})();
