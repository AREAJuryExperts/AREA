const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send({ msg: "jira" }));
router.post("/register", require("./Register"));

module.exports = router;