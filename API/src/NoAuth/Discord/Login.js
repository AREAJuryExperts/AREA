const utils = require("../../Utils");
const dynamo = require("../../../DB");
const request = require("../../Services/Discord/request");
const { v4: uuidv4 } = require("uuid");
const getUserByDiscordId = require("./UserByDiscord");

const Login = async (req, res) => {
    try {
        utils.checkArgs(req.body, ["code"]);
    } catch (err) {
        res.status(err.status).send(err.msg);
        return;
    }

    console.log(req.body.code);

    const data = {
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: req.body.code,
        redirect_uri: process.env.WEB_URL + "/confirmDiscordLogin",
    };

    let token = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: new URLSearchParams(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    token = await token.json();
    if (token.access_token) {
        let me = await fetch("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            },
        });
        me = await me.json();
        if (!me.id) {
            res.status(400).send({ msg: "Invalid code" });
            return;
        }

        let user = await getUserByDiscordId(me.id);

        if (user) {
            return res
                .status(200)
                .send({ msg: "ok", jwt: utils.encodeToken(user) });
        }

        user = {
            id: uuidv4(),
            email: me.email,
            password: null,
            firstName: me.global_name,
            lastName: "",
            checkoutId: null,
            confirmed: true,
            createdTime: Date.now(),
            connected: ["Discord"],
        };

        let discordUsr = {
            userId: user.id,
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            expire: Date.now() + token.expires_in * 1000,
            id: me.id,
            name: me.global_name,
        };
        await dynamo
            .client()
            .put({
                TableName: "Users",
                Item: user,
            })
            .promise();
        await dynamo
            .client()
            .put({
                TableName: "DiscordUsers",
                Item: discordUsr,
            })
            .promise();
        return res
            .status(200)
            .send({ msg: "ok", jwt: utils.encodeToken(user) });
    }
    res.status(400).send({ msg: "Invalid code" });
};

module.exports = Login;
