const express = require("express");
const router = express.Router();

// router.get("/", require("./getMe"));
router.post("/register", require("./Register"));
// router.post("/webhook", require("./webHook"));

// require("./webHook")()

module.exports = router;


// action
// j'ennvoie un mp au bot
// Un utilisateur à parler dans le serveur

// reaction:
// recevoir un mp du bot
// le bot annonce sur le serveur