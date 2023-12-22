const express = require("express");
const router = express.Router();

router.post("/webhook", require("./Post"));

module.exports = router;