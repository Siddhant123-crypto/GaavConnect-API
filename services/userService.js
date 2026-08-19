const User = require("../models/User");

const userService = {

    register: function (userData, callback) {

        if (!userData.fullName) {
            return callback(null, {
                status: 400,
                message: "Full name is required"
            });
        }

        if (!userData.mobile) {
            return callback(null, {
                status: 400,
                message: "Mobile number is required"
            });
        }

        if (!userData.email) {
            return callback(null, {
                status: 400,
                message: "Email is required"
            });
        }

        if (!userData.address) {
            return callback(null, {
                status: 400,
                message: "Address is required"
            });
        }

        if (!userData.state) {
            return callback(null, {
                status: 400,
                message: "State is required"
            });
        }

        if (!userData.profession) {
            return callback(null, {
                status: 400,
                message: "Profession is required"
            });
        }

        if (!userData.password) {
            return callback(null, {
                status: 400,
                message: "Password is required"
            });
        }

        if (!userData.confirmPassword) {
            return callback(null, {
                status: 400,
                message: "Confirm password is required"
            });
        }

        if (userData.password !== userData.confirmPassword) {
            return callback(null, {
                status: 400,
                message: "Password and confirm password do not match"
            });
        }

        User.findByEmail(userData.email, function (err, result) {

            if (err) {
                return callback(err);
            }

            if (result.length > 0) {
                return callback(null, {
                    status: 409,
                    message: "Email already registered"
                });
            }

            User.findByMobile(userData.mobile, function (err, result) {

                if (err) {
                    return callback(err);
                }

                if (result.length > 0) {
                    return callback(null, {
                        status: 409,
                        message: "Mobile number already registered"
                    });
                }
                if (!userData.pincode) {
    return callback(null, {
        status: 400,
        message: "Pincode is required"
    });
}
User.create(userData, function (err, result) {

    if (err) {
        return callback(err);
    }

    User.findById(result.insertId, function (err, userResult) {

        if (err) {
            return callback(err);
        }

        callback(null, {
            status: 201,
            message: "Gavkari registration successful",
            response: userResult[0]
        });
    });
});
            });
        });
    }
};

module.exports = userService;