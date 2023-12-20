const express = require("express");
const router = express.Router();


router.head("/webhook", require("./Head"));
router.post("/webhook", require("./Post"));

module.exports = router;