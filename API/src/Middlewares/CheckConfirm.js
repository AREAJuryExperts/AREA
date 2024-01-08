const dynamo = require("../../DB");

const checkConfirm = async (req, res, next) => {
    const params = {
        TableName: "Users",
        Key : {
            "id" : req.user.id
        }
    };

    let tmpUser = await dynamo.client().get(params).promise();
    if (tmpUser.Count == 0) {
        res.status(400).json({ msg: "Invalid Token" });
        return;
    }
    if (!tmpUser.Item) {
        res.status(400).json({ msg: "Invalid Token" });
        return;
    
    }
    req.user = tmpUser.Item;
    if (!req.user.confirmed) {
        res.status(403).json({ msg: "User not confirmed" });
        return;
    }
    next()
}

module.exports = checkConfirm;