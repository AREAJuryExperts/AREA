const dynamo = require("../../../DB");

const refreshBearerToken = async (refreshToken) => {
    let details = {
        "grant_type": "refresh_token",
        "client_id": process.env.JIRA_CLIENT_ID,
        "client_secret": process.env.JIRA_CLIENT_SECRET,
        "redirect_uri": process.env.JIRA_REDIRECT_URI,
        "refresh_token": refreshToken,
    };
    let res = await fetch("https://auth.atlassian.com/oauth/token", {method : "POST", headers : { 'Content-Type': 'application/json'}, body : details})
    if (!res.ok) {
        let data = await res.text();
        console.log("Refresh Token failed", data)
        console.log(details)
        return {};
    }
    let data = await res.json();
    if (!data)
        return {};
    return {access_token : data.access_token, refresh_token : data.refresh_token};
}

const refreshToken = async (refreshToken, user) => {
    let newBearerToken = await refreshBearerToken(refreshToken);
    if (!newBearerToken.access_token) {
        return {}
    }
    let newUser = user;
    newUser.access_token = newBearerToken.access_token;
    newUser.refresh_token = newBearerToken.refresh_token;
    await dynamo.client().put({
        TableName: "JiraUsers",
        Item: newUser,
    }).promise();
    return newBearerToken;
}


module.exports = refreshToken;