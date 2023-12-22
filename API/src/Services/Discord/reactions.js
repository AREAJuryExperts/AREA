const db = require("../../../DB");

const discordSendMp = async (
    user,
    message = "An action have been triggered"
) => {
    console.log(user);
    if (!user || !user.id) {
        return;
    }
    let params = {
        TableName: "DiscordUsers",
        IndexName: "userId",
        KeyConditionExpression: "userId = :n",
        ExpressionAttributeValues: {
            ":n": user.id,
        },
    };
    let tmpUser = await db.client().query(params).promise();
    if (tmpUser.Count == 0) return;
    let discordUser = tmpUser.Items[0];
    try {
        let response = await fetch(
            `https://discord.com/api/v10/users/@me/channels`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                },
                body: JSON.stringify({ recipient_id: discordUser.id }),
            }
        );
        let channel = await response.json();
        let out = await fetch(
            `https://discord.com/api/v10/channels/${channel.id}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                },
                body: JSON.stringify({ content: message }),
            }
        );
        out = await out.json();
    } catch (error) {
        console.error(error);
    }
};

module.exports = { discordSendMp };
