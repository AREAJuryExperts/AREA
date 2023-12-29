const express = require("express");
const router = express.Router();

router.post("/webhook", require("./Post"));
router.post("/login", require("./Login"));

module.exports = router;