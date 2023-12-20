const utils = require("../../Utils");
const dynamo = require("../../../DB");

const Register = async (req, res) => {
    try {
        utils.checkArgs(req.body, ["code"]);
    } catch (err) {
        res.status(err.status).send(err.msg);
        return;
    }

    let data = await fetch("https://accounts.google.com/o/oauth2/auth", {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            redirect_uri: process.env.GOOGLE_REDIRECT_ID,
            scope: process.env.GOOGLE_SCOPE,
            response_type: "code",
        }),
    });

    if (data.status != 200) {
        res.status(data.status).send({ msg: "Invalid code" });
        return;
    }

    // data = await data.json();
    // if (data.access_token) {
    //     let me = null;
    //     try {
    //         me = await fetch("https://api.github.com/user", {
    //             method: "GET",
    //             headers: {
    //                 Authorization: `Bearer ${data.access_token}`,
    //             },
    //         });

    //         if (me.status != 200) throw { status: 400, msg: "Invalid code" };
    //         me = await me.json();
    //     } catch (err) {
    //         res.status(err.status).send(err.msg);
    //         return;
    //     }
    //     if (!me) {
    //         res.status(400).send({ msg: "Invalid code" });
    //         return;
    //     }
    //     let githubUsr = {
    //         userId: req.user.id,
    //         access_token: data.access_token,
    //         id: me.id,
    //         login: me.login,
    //     };
    //     await dynamo
    //         .client()
    //         .put({
    //             TableName: "GitHubUsers",
    //             Item: githubUsr,
    //         })
    //         .promise();
    //     if (!req.user.connected) req.user.connected = [];
    //     req.user.connected.push("Github");
    //     await dynamo
    //         .client()
    //         .put({
    //             TableName: "Users",
    //             Item: req.user,
    //         })
    //         .promise();
    //     res.status(200).send({ msg: "ok" });
    //     return;
    // }
    // res.status(400).send({ msg: "Invalid code" });
};

module.exports = Register;
