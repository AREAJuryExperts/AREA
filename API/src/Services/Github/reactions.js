const db = require("../../../DB");

const GithubCreateNewRepo = async (user, repoName = "testReaction") => {

    let params = {
        TableName: "GithubUsers",
        IndexName: "userId",
        KeyConditionExpression: "userId = :n",
        ExpressionAttributeValues: {
            ":n": user.id,
        },
    };
    let tmpUser = await db.client().query(params).promise();
    if (tmpUser.Count == 0) return null;

    let githubUser = tmpUser.Items[0];
    if (!githubUser) return null;
    if (!githubUser.token) return null;

    await fetch(`https://api.github.com/orgs/AREAJuryExperts/repos/?name=${repoName}&token=${githubUser.token}`, {method: "POST"})

};

module.exports = {GithubCreateNewRepo};