const db = require("./../../../DB");
const router = require("../../Services/Router");

const getUserByDiscordId = async (id) => {
    let params = {
        TableName: "DiscordUsers",
        Key: {
            id: id,
        },
    };
    let tmpUser = await db.client().get(params).promise();
    if (tmpUser.Count == 0) return null;

    let user = tmpUser.Item;

    if (!user) return null;
    if (!user.userId) return null;
    params = {
        TableName: "Users",
        Key: {
            id: user.userId,
        },
    };
    tmpUser = await db.client().get(params).promise();
    if (tmpUser.Count == 0) return null;
    user = tmpUser.Item;
    return user;
};

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
