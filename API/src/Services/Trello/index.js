const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send({ msg: "Trello" }));
router.post("/register", require("./Register"));


module.exports = router;