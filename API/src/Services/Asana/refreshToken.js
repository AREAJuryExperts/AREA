const dynamo = require("../../../DB");

const refreshBearerToken = async (refreshToken) => {
    let details = {
        "grant_type": "refresh_token",
        "client_id": process.env.ASANA_CLIENT_ID,
        "client_secret": process.env.ASANA_CLIENT_SECRET,
        "redirect_uri": process.env.ASANA_REDIRECT_URI,
        "refresh_token": refreshToken,
    };
    let formBody = [];
    for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    let res = await fetch("https://app.asana.com/-/oauth_token", {method : "POST", headers : { 'Content-Type': 'application/x-www-form-urlencoded'}, body : formBody})
    if (!res.ok) {
        let data = await res.text();
        console.log("Refresh Token failed", data)
        return {};
    }
    let data = await res.json();
    if (!data)
        return {};
    return {access_token : data.access_token};
}

const refreshToken = async (refreshToken, user) => {
    let newBearerToken = await refreshBearerToken(refreshToken);
    if (!newBearerToken.access_token) {
        return {}
    }
    let newUser = user;
    newUser.access_token = newBearerToken.access_token;
    await dynamo.client().put({
        TableName: "AsanaUsers",
        Item: newUser,
    }).promise();
    return newBearerToken;
}


module.exports = refreshToken;