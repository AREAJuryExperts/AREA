const utils = require("../../Utils");
const dynamo = require("../../../DB");
// const request = require("./request");


const getBearerToken = async (req, res) => {
    var details = {
        "grant_type": "authorization_code",
        "client_id": process.env.ASANA_CLIENT_ID,
        "client_secret": process.env.ASANA_CLIENT_SECRET,
        "redirect_uri": process.env.ASANA_REDIRECT_URI,
        "code": req.query.code,
    };
    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    const requ = await fetch("https://app.asana.com/-/oauth_token", {
        headers : {"Access-Control-Allow-Origin" : "*",
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        method : "POST", mode : 'cors', body : formBody})
    if (!requ.ok) {
        console.log("Error cannot get a token")
        return res.status(400).send({ "msg": "Error cannot get a token" })
    }
    const data = await requ.json();
    console.log(data)
    let asanaUser = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        userId : req.user.id,
        id : data.data.id,
        email : data.data.email,
        webhookSecret : "empty"
    };

    try {
        await dynamo
            .client()
            .put({
                TableName: "AsanaUsers",
                Item: asanaUser,
            })
            .promise();
        if (!req.user.connected) req.user.connected = [];
        req.user.connected.push("Asana");
        await dynamo
            .client()
            .put({
                TableName: "Users",
                Item: req.user,
            })
            .promise();
        res.status(200).send({ msg: "ok" });
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: "Internal server error database" });
    }
}

const Register = async (req, res) => {
    return getBearerToken(req, res);
};


module.exports = Register;