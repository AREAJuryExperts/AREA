const utils = require("../../Utils");
const dynamo = require("../../../DB");

const RefreshToken = async (user) => {

    const refresh_token = user.refresh_token;
    let token = null;
    const params = new URLSearchParams();
    params.append("client_id", process.env.GOOGLE_CLIENT_ID);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
    params.append("grant_type", "refresh_token");
    params.append("redirect_uri", process.env.GOOGLE_REDIRECT_URI);
    try {
        token = await fetch("https://oauth2.googleapis.com/token?refresh_token=" + refresh_token, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body: params.toString(),
        });

        if (token.status != 200) throw { status: 400, msg: "Invalid refresh_token" };
        token = await token.json();
    } catch (err) {
        res.status(err.status).send(err.msg);
        return;
    }
    let expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 1);
    user.access_token = token.access_token;
    user.expiresIn = expiresIn;
    await dynamo.client().put({
        TableName: "GoogleUsers",
        Item: user,
    }).promise();
    return (token.access_token);
};

module.exports = RefreshToken;
