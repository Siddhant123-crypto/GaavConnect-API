const express = require("express");
const router = express.Router();

const sarpanchController = require("../controllers/sarpanchController");

router.post("/register", sarpanchController.register);

module.exports = router;