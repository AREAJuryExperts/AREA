const getUserByDiscordId = require("./UserByDiscord");
const router = require("../../Services/Router");

const webHook = async (req, res) => {
    let message = req.body;
    let user = await getUserByDiscordId(message.author.id);
    if (user == null) {
        res.status(400).send({ msg: "Invalid message" });
        return;
    }
    if (message.channel.type == 1) {
        await router("discordReceiveMp", user);
    }
    if (message.channel.type == 0) {
        await router("discordReceiveServer", user);
    }
    res.send({ msg: "ok" });
};

module.exports = webHook;
