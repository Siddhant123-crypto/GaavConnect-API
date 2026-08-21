require("dotenv").config();
const sarpanchService = require("./services/sarpanchService");

const sarpanchData = {
    fullName: "test user",
    mobile: "1234567890",
    email: "test@gmail.com",
    address: "Nashik",
    pincode: "422002",
    state: "Maharashtra",
    profession: "Sarpanch",
    password: "123",
    confirmPassword: "123"
};

sarpanchService.register(sarpanchData, (err, result) => {
    if (err) {
        console.error("SERVICE ERROR:", err);
    } else {
        console.log("SERVICE SUCCESS:", result);
    }
    process.exit();
});
