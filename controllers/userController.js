const userService = require("../services/userService");

const userController = {

    register: function (req, res) {

        const userData = req.body;

        userService.register(userData, function (err, result) {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Internal server error"
                });
            }

            return res.status(result.status).json({
    message: result.message,
    response: result.response || null
});
        });
    }
};

module.exports = userController;