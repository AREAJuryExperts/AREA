const utils = require("../../Utils");
const dynamo = require("../../../DB");
// const request = require("./request");


const getBearerToken = async (req, res) => {

    let formBody = {
        "grant_type": "access_token",
        "client_id": process.env.JIRA_CLIENT_ID,
        "client_secret": process.env.JIRA_CLIENT_SECRET,
        "code": req.query.code,
        "redirect_uri": process.env.JIRA_REDIRECT_URI,
    }
    const requ = await fetch("https://auth.atlassian.com/oauth/token", {
        headers : {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        method : "POST", 
        body : JSON.stringify(formBody)})
    if (!requ.ok) {
        let txt = await requ.json();
        console.log("text", txt)
        console.log("Error cannot get a token status", requ.status)
        return res.status(400).send({ "msg": "Error cannot get a token" })
    }
    const data = await requ.json();
    let jiraUser = {
        access_token: data.access_token,
        userId : req.user.id,
        id : req.user.id,
        refresh_token: data.refresh_token,
    };
    if (!jiraUser.access_token || !jiraUser.refresh_token) {
        console.log("Error cannot get a token", data);
        return res.status(400).send({ msg: "Error cannot get a token" });
    }
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