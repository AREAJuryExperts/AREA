const db = require("../../../DB");

const getRandomRepoID = () => {
    return Math.floor(Math.random() * 10000);
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
    if (tmpUser.Count === 0) return null;

    let githubUser = tmpUser.Items[0];

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
                Authorization: `Bearer ${githubUser.access_token}`,
            },
            body: JSON.stringify(data),
        });
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

const GithubCreateNewIssue = async (user, repoName = "RepoIssues") => {
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

    let githubUser = tmpUser.Items[0];
    const issueName = "New issue n°" + getRandomRepoID();

    const apiUrl = `https://api.github.com/repos/AREAJuryExperts/RepoIssues/issues`
    let data = {
        title: issueName,
        body: "This is a new issue",
    };

    try {
        let response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${githubUser.access_token}`,
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            console.log('Issue created successfully:', issueName);
        } else {
            const errorData = await response.json();
            console.error('Error creating issue:', errorData);
        }
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
}


module.exports = { GithubCreateNewRepo, GithubCreateNewIssue };
