const express = require("express");
const router = express.Router();


router.use("/asana/", require("./Asana"));
router.use("/discord/", require("./Discord"));
router.use("/github/", require("./Github"));
router.use("/trello/", require("./Trello"));
router.get("/me", require("./Get").getMe);
router.use("/google/", require("./Google"));
router.use("/jira/", require("./Jira"));

module.exports = router;