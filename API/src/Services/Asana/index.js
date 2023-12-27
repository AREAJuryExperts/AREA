const express = require("express");
const router = express.Router();


router.post("/webhook", require("./registerWebhook"));
router.post("/", require("./webHook"))
router.post("/register", require("./Register"));

module.exports = router;