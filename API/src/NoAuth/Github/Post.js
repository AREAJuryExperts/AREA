const utils = require("../../Utils");
const db = require("../../../DB");
const router = require("./../../Services/Router");

const getUserByGithubId = async (id) => {
    const params = {
        TableName: "GithubUsers",
        Key: {
            id: id,
        },
    };
    let tmpUser = await dynamo.client().get(params).promise();
    if (tmpUser.Count == 0) return null;

    let user = tmpUser.Item;
    if (!user) return null;
    if (!user.userId) return null;

    params = {
        TableName: "Users",
        Key: {
            id: user.userId,
        },
    };

    tmpUser = await dynamo.client().get(params).promise();
    if (tmpUser.Count == 0) return null;
    user = tmpUser.Item;
    return user;
};

const postWebhook = async (req, res) => {
    const data = req.body;
    const githubEvent = req.headers["x-github-event"];
    
    let user = await getUserByGithubId(data.sender.id);
    if (!user) return;
    
    if (githubEvent == "repository") {
        let actionType = data.action;
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
