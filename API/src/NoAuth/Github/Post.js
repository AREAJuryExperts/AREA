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
    let tmpUser = await db.client().get(params).promise();
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

    tmpUser = await db.client().get(params).promise();
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
            await router("GithubCreatedNewRepo", user);
            return;
        }
        if (actionType == "deleted") {
            await router("GithubDeletedRepo", user);
            return;
        }
    }

    if (githubEvent == "push") {
        await router("GithubPushMade", user);
        return;
    }

    res.status(201).json({ message: "Data received and processed" });
}

module.exports = postWebhook;
