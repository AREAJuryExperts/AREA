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
        let googleUser = {
            userId: req.user.id,
            access_token: access_token,
            scope: scope,
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
