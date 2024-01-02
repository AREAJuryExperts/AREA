const utils = require("../../Utils");
const dynamo = require("../../../DB");

const Register = async (req, res) => {
    try {
        utils.checkArgs(req.body, ["access_token", "scope"]);
    } catch (err) {
        res.status(err.status).send(err.msg);
        return;
    }

    const {scope, access_token} = req.body;

    if (access_token) {
        let me = null;
        try {
            me = await fetch("https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (me.status != 200) throw { status: 400, msg: "Invalid code" };
            me = await me.json();
        } catch (err) {
            res.status(err.status).send(err.msg);
            return;
        }
        if (!me) {
            res.status(400).send({ msg: "Invalid code" });
            return;
        }
        let googleUser = {
            userId: req.user.id,
            access_token: access_token,
            scope: scope,
            id: me.names[0].metadata.source.id,
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
