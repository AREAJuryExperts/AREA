const { refreshToken} = require("./refreshToken");
const utils = require("../../Utils");
const db = require("../../../DB");
const crypto = require("crypto");

var webHookToken = "";


const webHook = async (req, res) => {
    if (req.headers["x-hook-secret"]) {
        console.log("This is a new webhook");
        secret = req.headers["x-hook-secret"];
    
        res.setHeader("X-Hook-Secret", secret);
        return res.sendStatus(200);
    }
    if (req.headers["x-hook-signature"]) {
        const computedSignature = crypto
          .createHmac("SHA256", secret)
          .update(JSON.stringify(req.body))
          .digest("hex");
    
        if (!crypto.timingSafeEqual(Buffer.from(req.headers["x-hook-signature"]),Buffer.from(computedSignature)))
            return res.sendStatus(401);
        console.log(`Events on ${Date()}:`);
        console.log(req.body.events);
        return res.sendStatus(200);
    }
    return res.sendStatus(400);
};


module.exports = webHook;