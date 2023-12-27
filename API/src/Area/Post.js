const utils = require("../Utils");
const { v4: uuidv4 } = require("uuid");
const dynamo = require("../../DB");

const PostArea = async (req, res) => {
    try {
        utils.checkArgs(req.body, [
            "action",
            "app",
            "reactions",
        ]);
    } catch (err) {
        res.status(err.status).json({ msg: err.msg });
        return;
    }


    if (req.user.connected) {
        let found = false;
        for(let i = 0; i < req.user.connected.length; ++i) {
            if (req.user.connected[i] === req.body.app) {
                found = true;
                break;
            }
        }
        if (!found)
            return res.status(400).json({ msg: "App not connected" });
    }
    
    for (let i = 0; i < req.body.reactions.length; i++) {
        if (!req.body.reactions[i].app || !req.body.reactions[i].reaction) {
            res.status(400).json({ msg: "Invalid reaction" });
            return;
        }
    }

    let services = dynamo.services()
    let action = false;
    let actionDisplayName = "";
    for(let i = 0; i < services.length; ++i) {
        if (services[i].app === req.body.app) {
            for(let j = 0; j < services[i].actions.length; ++j) {
                if (services[i].actions[j].code === req.body.action) {
                    action = true;
                    actionDisplayName = services[i].actions[j].displayName;
                    break;
                }
            }
            break;
        }
    }

    if (!action) {
        res.status(400).json({ msg: "Invalid action" });
        return;
    }

    let area = {
        id : uuidv4(),
        action : {
            app : req.body.app,
            action : req.body.action,
            displayName : actionDisplayName
        },
        reactions : req.body.reactions,
        userId : req.user.id,
        active : true,
    }

    await dynamo
        .client()
        .put({
            TableName: "Area",
            Item: area,
        })
        .promise();
    res.status(201).json({ msg: "ok" });
}

module.exports = PostArea;