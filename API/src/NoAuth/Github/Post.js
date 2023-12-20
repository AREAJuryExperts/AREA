const utils = require("../../Utils");
const db = require("../../../DB");
const router = require("./../../Services/Router");

const getUserByGithubId = async (id) => {
    let params = {
        TableName: "GitHubUsers",
        Key: {
            id: id,
        },
    };
    console.log("ok 2 ");
    let tmpUser = await db.client().get(params).promise();
    if (tmpUser.Count == 0) return null;

    console.log("ok 3 ");


    let user = tmpUser.Item;
    if (!user) return null;
    if (!user.userId) return null;
    params = {
        TableName: "Users",
        Key: {
            id: user.userId,
        },
    };
    console.log("ok 3 ");

    tmpUser = await db.client().get(params).promise();
    if (tmpUser.Count == 0) return null;
    user = tmpUser.Item;
    console.log("ok 4 ");

    return user;
};


const postWebhook = async (req, res) => {
    console.log("ok");
    const data = req.body;
    const githubEvent = req.headers["x-github-event"];
    console.log("githubEvent = ", githubEvent);
    console.log(data.sender.id);
    let user = await getUserByGithubId(data.sender.id);

    if (!user) return;

    if (githubEvent == "repository") {
        let actionType = data.action;
        console.log("actionType = ", actionType);
        if (actionType == "created") {
            console.log("repo created");
            router("githubCreate", user);
            return;
        }
        if (actionType == "deleted") {
            console.log("repo deleted");
            router("githubDelete", user);
            return;
        }
    }

    if (githubEvent == "push") {
        console.log("push made");
        router("githubPush", user);
        return;
    }

    // if (githubEvent == "create") {
    //     router("githubCreate", user);
    // }

    // if (githubEvent == "pull_request") {
    //     let actionType = data.action;
    //     if (actionType == "opened") router("githubPullRequest", user);
    //     if (actionType == "closed") router("githubPullRequest", user);
    // }

    res.status(201).json({ message: "Data received and processed" });
}

module.exports = postWebhook;
