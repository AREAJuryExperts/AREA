const utils = require("../Utils");
const dynamo = require("../../DB");

const confirm = async (req, res) => {
    try {
        utils.checkArgs(req.body, [
            "userId",
            "checkoutId",
        ]);
    } catch (err) {
        res.status(err.status).json({ msg: err.msg });
        return;
    }

    const params = {
        TableName: "Users",
        Key : {
            "id" : req.body.userId
        }
    };

    let tmpUser = await dynamo.client().get(params).promise();

    if (tmpUser.Count == 0) {
        res.status(400).json({ msg: "Invalid userId" });
        return;
    }
    let user = tmpUser.Item;
    if (user.confirmed) {
        res.status(403).json({ msg: "User already confirmed" });
        return; 
    }
    if (user.checkoutId == null) {
        res.status(400).json({ msg: "Invalid checkoutId" });
        return;
    }

    if (user.checkoutId != req.body.checkoutId) {
        res.status(400).json({ msg: "Invalid checkoutId" });
        return;
    }
    user.confirmed = true;
    user.checkoutId = null;

    await dynamo
        .client()
        .put({
            TableName: "Users",
            Item: user,
        })
        .promise();
    res.status(200).json({ msg: "ok" });
}

module.exports = confirm;