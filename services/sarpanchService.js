const Sarpanch = require("../models/Sarpanch");

const sarpanchService = {

    register: function (sarpanchData, callback) {

        if (!sarpanchData.fullName) {
            return callback(null, {
                status: 400,
                message: "Full name is required"
            });
        }

        if (!sarpanchData.mobile) {
            return callback(null, {
                status: 400,
                message: "Mobile number is required"
            });
        }

        if (!sarpanchData.email) {
            return callback(null, {
                status: 400,
                message: "Email is required"
            });
        }

        if (!sarpanchData.address) {
            return callback(null, {
                status: 400,
                message: "Address is required"
            });
        }

        if (!sarpanchData.state) {
            return callback(null, {
                status: 400,
                message: "State is required"
            });
        }

        if (!sarpanchData.profession) {
            return callback(null, {
                status: 400,
                message: "Profession is required"
            });
        }

        if (!sarpanchData.password) {
            return callback(null, {
                status: 400,
                message: "Password is required"
            });
        }

        if (!sarpanchData.confirmPassword) {
            return callback(null, {
                status: 400,
                message: "Confirm password is required"
            });
        }

        if (sarpanchData.password !== sarpanchData.confirmPassword) {
            return callback(null, {
                status: 400,
                message: "Password and confirm password do not match"
            });
        }
        if (!sarpanchData.pincode) {
    return callback(null, {
        status: 400,
        message: "Pincode is required"
    });
}

        Sarpanch.findByEmail(sarpanchData.email, function (err, result) {

            if (err) {
                return callback(err);
            }

            if (result.length > 0) {
                return callback(null, {
                    status: 409,
                    message: "Email already registered"
                });
            }

            Sarpanch.findByMobile(sarpanchData.mobile, function (err, result) {

                if (err) {
                    return callback(err);
                }

                if (result.length > 0) {
                    return callback(null, {
                        status: 409,
                        message: "Mobile number already registered"
                    });
                }

                Sarpanch.create(sarpanchData, function (err, result) {

    if (err) {
        return callback(err);
    }

    Sarpanch.findById(result.insertId, function (err, sarpanchResult) {

        if (err) {
            return callback(err);
        }

        callback(null, {
            status: 201,
            message: "Sarpanch registration successful",
            response: sarpanchResult[0]
        });
    });
});
            });
        });
    }
};

module.exports = sarpanchService;