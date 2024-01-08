const express = require("express");
const router = express.Router();

router.post("/register", require("./Register"));


module.exports = router;
