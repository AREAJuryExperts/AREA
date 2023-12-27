const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send({ msg: "NoAuth" }));

router.use("/trello/", require("./Trello"));
router.use("/github/", require("./Github"));
router.use("/discord/", require("./Discord"));
router.use("/asana/", require("./Asana"));
module.exports = router;