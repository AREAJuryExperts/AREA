const utils = require("../Utils");
const bcrypt = require("bcryptjs");
const dynamo = require("../../DB");

const login = async (req, res) => {
    try {
        utils.checkArgs(req.body, [
            "email",
            "password",
        ]);
    } catch (err) {
        res.status(err.status).json({ msg: err.msg });
        return;
    }

    const params = {
        TableName: "Users",
        IndexName: "Email",
        KeyConditionExpression: "email = :n",
        ExpressionAttributeValues: {
            ":n": req.body.email,
        },
    };

    let tmpUser = await dynamo.client().query(params).promise();
    if (tmpUser.Count == 0) {
        res.status(400).json({ msg: "Invalid credentials" });
        return;
    }

    let user = tmpUser.Items[0];
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.status(400).json({ msg: "Invalid credentials" });
        return;
    }

    if (!user.confirmed) {
        res.status(403).json({ msg: "User not confirmed" });
        return;
    }

    res.status(200).json({ msg: "ok", "jwt" : utils.encodeToken(user) });
}


module.exports = login;