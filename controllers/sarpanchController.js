const sarpanchService = require("../services/sarpanchService");

const sarpanchController = {

    register: function (req, res) {

        const sarpanchData = req.body;

        sarpanchService.register(sarpanchData, function (err, result) {

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

module.exports = sarpanchController;