const db = require("../../../DB");

const getRandomRepoID = () => {
    Math.floor(Math.random() * 10000);
};

const GithubCreateNewRepo = async (user, repoName = "testReaction") => {

    let params = {
        TableName: "GitHubUsers",
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

    const apiUrl = "https://api.github.com/orgs/AREAJuryExperts/repos";
    const completeRepoName = `${repoName}-${getRandomRepoID()}`;
    let data = {
        name: completeRepoName,
        private: false,
    };

    let response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${githubUser.token}`,
        },
        body: JSON.stringify(data),
    });

    // await fetch(`https://api.github.com/orgs/AREAJuryExperts/repos/?name=${repoName}&token=${githubUser.token}`, {method: "POST"})

};

module.exports = {GithubCreateNewRepo};