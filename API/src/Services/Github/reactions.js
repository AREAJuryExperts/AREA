const db = require("../../../DB");

const getRandomRepoID = () => {
    return Math.floor(Math.random() * 10000);
};

const GithubCreateNewRepo = async (user, repoName = "testReaction") => {
    console.log("Entering GithubCreateNewRepo");
    let params = {
        TableName: "GitHubUsers",
        IndexName: "userId",
        KeyConditionExpression: "userId = :n",
        ExpressionAttributeValues: {
            ":n": user.id,
        },
    };
    let tmpUser = await db.client().query(params).promise();
    if (tmpUser.Count === 0) return null;
    console.log("tmpUser.Items[0]:", tmpUser.Items[0])

    let githubUser = tmpUser.Items[0];
    if (!githubUser) return null;
    if (!githubUser.token) return null;

    const apiUrl = "https://api.github.com/orgs/AREAJuryExperts/repos";
    const completeRepoName = `${repoName}-${getRandomRepoID()}`;
    let data = {
        name: completeRepoName,
        private: false,
    };

    try {
        let response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${githubUser.token}`,
            },
            body: JSON.stringify(data),
        });
        console.log("github response: ", response)
        if (response.ok) {
            console.log('Repository created successfully:', completeRepoName);
        } else {
            const errorData = await response.json();
            console.error('Error creating repository:', errorData);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

    // await fetch(`https://api.github.com/orgs/AREAJuryExperts/repos/?name=${repoName}&token=${githubUser.token}`, {method: "POST"})

module.exports = { GithubCreateNewRepo };
