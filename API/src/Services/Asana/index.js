const express = require("express");
const router = express.Router();


router.post("/webhook", require("./registerWebHook"));
router.post("/register", require("./Register"));

module.exports = router;