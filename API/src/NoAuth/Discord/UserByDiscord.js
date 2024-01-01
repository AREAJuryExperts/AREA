const db = require("./../../../DB");

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

module.exports = getUserByDiscordId;