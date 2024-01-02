const utils = require("../../Utils");
const dynamo = require("../../../DB");
// const request = require("./request");


const getBearerToken = async (req, res) => {

    let formBody = {
        "grant_type": "authorization_code",
        "client_id": process.env.JIRA_CLIENT_ID,
        "client_secret": process.env.JIRA_CLIENT_SECRET,
        "code": req.query.code,
        "redirect_uri": process.env.JIRA_REDIRECT_URI,
    }
    const requ = await fetch("https://auth.atlassian.com/oauth/token", {
        headers : {"Access-Control-Allow-Origin" : "*",
        'Content-Type': 'Content-Type: application/json'},
        method : "POST", mode : 'cors', body : JSON.stringify(formBody)})
    if (!requ.ok) {
        console.log("Error cannot get a token")
        return res.status(400).send({ "msg": "Error cannot get a token" })
    }
    const data = await requ.json();
    console.log(data)
    let jiraUser = {
        access_token: data.access_token,
        userId : req.user.id,
        id : req.user.id,
    };

    try {
        await dynamo
            .client()
            .put({
                TableName: "JiraUsers",
                Item: jiraUser,
            })
            .promise();
        if (!req.user.connected) req.user.connected = [];
        req.user.connected.push("Jira");
        await dynamo
            .client()
            .put({
                TableName: "Users",
                Item: req.user,
            })
            .promise();
        return res.status(200).send({ msg: "ok" });
    } catch (err) {
        console.log(err)
        return res.status(500).send({ msg: "Internal server error database" });
    }
}

const Register = async (req, res) => {
    return getBearerToken(req, res);
};


module.exports = Register;