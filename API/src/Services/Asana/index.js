const express = require("express");
const router = express.Router();


router.post("/regsiterWebhook", require("./registerWebHook"));
router.post("/register", require("./Register"));

module.exports = router;