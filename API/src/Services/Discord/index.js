const express = require("express");
const router = express.Router();

router.post("/connect", require("./Register"));


module.exports = router;
