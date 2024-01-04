const utils = require("../../Utils");
const dynamo = require("../../../DB");

const Register = async (req, res) => {
    try {
        utils.checkArgs(req.body, ["code", "scope"]);
    } catch (err) {
        res.status(err.status).send(err.msg);
        return;
    }

    const {scope, code} = req.body;

    if (code) {
        let token = null;
        let me = null;
        const params = new URLSearchParams();
        params.append("client_id", process.env.GOOGLE_CLIENT_ID);
        params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
        params.append("grant_type", "authorization_code");
        params.append("redirect_uri", process.env.GOOGLE_REDIRECT_URI);
        try {
            token = await fetch("https://oauth2.googleapis.com/token?code=" + code, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                },
                body: params.toString(),
            });

            if (token.status != 200) throw { status: 400, msg: "Invalid code" };
            token = await token.json();
            me = await fetch("https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
            });

            if (me.status != 200) throw { status: 400, msg: "Invalid access_token" };
            me = await me.json();
        } catch (err) {
            res.status(err.status).send(err.msg);
            return;
        }
        if (!me) {
            res.status(400).send({ msg: "Invalid access_token" });
            return;
        }
        let expiresIn = new Date();
        expiresIn.setHours(expiresIn.getHours() + 1);
        let googleUser = {
            userId: req.user.id,
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            scope: scope,
            id: me.names[0].metadata.source.id,
            expiresIn: expiresIn.toDateString(),
        };
        await dynamo
        .client()
        .put({
            TableName: "GoogleUsers",
            Item: googleUser,
        })
        .promise();
        if (!req.user.connected) req.user.connected = [];
        req.user.connected.push("Google");
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
    res.status(400).send({ msg: "Invalid code" });
};

module.exports = Register;
