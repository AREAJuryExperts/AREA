const utils = require("../../Utils");
const db = require("../../../DB");
const router = require("./../../Services/Router");
// const crypto = require("crypto");

const getUserByAsanaId = async (id) => {
    let params = {
        TableName: "AsanaUsers",
        Key: {
            id: id,
        },
    };
    let tmpUser = await db.client().get(params).promise();
    if (tmpUser.Count == 0) return null;

    let user = tmpUser.Item;
    if (!user) return null;
    if (!user.userId) return null;
    params = {
        TableName: "Users",
        Key: {
            id: user.userId,
        },
    };
    tmpUser = await db.client().get(params).promise();
    if (tmpUser.Count == 0) return null;
    user = tmpUser.Item;
    return user;
};



var webHookToken = "";


const postWebhook = async (req, res) => {
    if (req.headers["x-hook-secret"]) {
        console.log("This is a new webhook");
        webHookToken = req.headers["x-hook-secret"];
    
        res.setHeader("X-Hook-Secret", webHookToken);
        return res.sendStatus(200);
    }
    if (req.headers["x-hook-signature"]) {
        // const computedSignature = crypto
        //   .createHmac("SHA256", webHookToken)
        //   .update(JSON.stringify(req.body))
        //   .digest("hex");
    
        // if (!crypto.timingSafeEqual(Buffer.from(req.headers["x-hook-signature"]),Buffer.from(computedSignature)))
        //     return res.sendStatus(401);
        console.log(`Events on ${Date()}:`);
        console.log(req.body.events);
        await router("trelloUpdateCard", user);
        return res.sendStatus(200);
    }
    return res.sendStatus(400);
}

module.exports = postWebhook;
