const utils = require("../../Utils");
const dynamo = require("../../../DB");

const Register = async (req, res) => {
    try {
        utils.checkArgs(req.body, ["code"]);
    } catch (err) {
        res.status(err.status).send(err.msg);
        return;
    }

    let data = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body: new URLSearchParams({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: req.body.code,
            redirect_uri: process.env.WEB_URL + "/confirmGithub",
        }),
    });
    if (data.status != 200) {
        console.log("data", await data.text());
        res.status(data.status).send({ msg: "Invalid code"});
        return;
    }

    data = await data.json();
    if (data.access_token) {
        let me = null;
        try {
            me = await fetch("https://api.github.com/user", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${data.access_token}`,
                },
            });

            if (me.status != 200) throw { status: 400, msg: "Invalid code 2" };
            me = await me.json();
        } catch (err) {
            res.status(err.status).send(err.msg);
            return;
        }
        if (!me) {
            res.status(400).send({ msg: "Invalid code 3" });
            return;
        }
        let githubUsr = {
            userId: req.user.id,
            access_token: data.access_token,
            id: me.id,
            login: me.login,
        };
        await dynamo
            .client()
            .put({
                TableName: "GitHubUsers",
                Item: githubUsr,
            })
            .promise();
        if (!req.user.connected) req.user.connected = [];
        req.user.connected.push("Github");
        await dynamo
            .client()
            .put({
                TableName: "Users",
                Item: req.user,
            })
            .promise();
        res.status(200).send({ msg: "ok" });
        return;
    }
    res.status(400).send({ msg: "Invalid code 4" });
};

module.exports = Register;
