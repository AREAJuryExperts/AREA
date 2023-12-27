const { refreshToken} = require("./refreshToken");
const utils = require("../../Utils");
const db = require("../../../DB");


let currentApiUrl = "area.david-benistant.com:8080";

const registerWebhook = async (req, res) => {
    let projectId = 0;
    let params = {
        TableName: "AsanaUsers",
        IndexName: "userId",
        KeyConditionExpression: "userId = :n",
        ExpressionAttributeValues: {
            ":n": req.user.id,
        },
    };
    console.log("req user id", req.user.id);
    let tmpUser = await db.client().query(params).promise();
    if (tmpUser.Count === 0) return res.status(400).send({msg: "User not found"});

    let AsanaUser = tmpUser.Items[0];
    if (!AsanaUser) return res.status(400).send({msg: "User not found"});
    if (!AsanaUser.token) return res.status(400).send({msg: "User token not found"});
    let url = 'https://app.asana.com/api/1.0/workspaces?opt_fields=';
    let options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        authorization: `Bearer ${AsanaUser.access_token}`
        }
    };
    try {
        let res = await fetch(url, options);
        if (res.status !== 201) {
            let token = await refreshToken(AsanaUser.refresh_token, AsanaUser);
            if (!token.access_token) return res.status(400).send({msg: "Error while refreshing token"});
            AsanaUser.access_token = token.access_token;
            res = await fetch(url, options);
            if (res.status !== 200) return res.status(400).send({msg: "Error while fetching data"});
        }
        let data = await res.json();
        projectId = data.data[0].id;
    } catch (err) {
        console.log(err);
        return res.status(400).send({msg: "Error while fetching data"});
    }

    url = 'https://app.asana.com/api/1.0/webhooks';
    options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json', authorization: `Bearer ${AsanaUser.access_token}`},
        body: JSON.stringify({
            data: {
                resource: projectId,
                filters: [
                    {
                        resource_type: 'task'
                    }
                ],
                target: `http://${currentApiUrl}/api/asana`,
            }
        })
    };
    try {
        let res = await fetch(url, options);
        if (res.status !== 201)
            return res.status(400).send({msg: "Error while creating webhook"});
        return res.status(201).send({msg: "Webhook created"});
    } catch (err) {
        console.log(err);
        return res.status(400).send({msg: "Error while creating webhook"});
    }

}

module.exports = registerWebhook;