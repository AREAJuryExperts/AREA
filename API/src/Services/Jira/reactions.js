const db = require("../../../DB");
const refreshToken = require("../Jira/refreshToken");

const JiraCreateSprint = async (user, sprintName = "Sprint " + Math.floor(Math.random() * 100000), scopeId = "b2da904e-e0b4-42d0-aa33-6218219ba69f") => {
    console.log("JiraCreateProject");
    let params = {
        TableName: "JiraUsers",
        IndexName: "userId",
        KeyConditionExpression: "userId = :n",
        ExpressionAttributeValues: {
            ":n": user.id,
        },
    };
    let tmpUser = await db.client().query(params).promise();
    if (tmpUser.Count === 0) return null;
    let JiraUser = tmpUser.Items[0];
    if (!JiraUser) return null;
    if (!JiraUser.access_token) return null;
    let resScopes = await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
        method: "GET",
        headers: {
            Authorization: "Bearer " + JiraUser.access_token,
        },
    });
    if (resScopes.status !== 200) {
        let newToken = await refreshToken(JiraUser.refresh_token, JiraUser);
        if (!newToken.access_token) {
            let data = await resScopes.text();
            console.log("scopes failed with a status", resScopes.status , "data", data);
        }
        JiraUser.access_token = newToken.access_token;
        JiraUser.refresh_token = newToken.refresh_token;
        resScopes = await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + JiraUser.access_token,
            },
        });
        if (resScopes.status !== 200) return null

    };
    let scopesData = await resScopes.json();
    for (let i in scopesData)
        if (scopesData[i].name !== "actionreaction") {
            // scopeId = scopesData[i].id;
            break;
        }
    if (scopeId === -1) {
        console.log("Scope id null");
        return null;
    }
    let resBoard = await fetch(`https://api.atlassian.com/ex/jira/${scopeId}/rest/agile/1.0/board`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + JiraUser.access_token,
        },
    });
    if (resBoard.status !== 200) {
        let data = await resBoard.text();
        console.log("board failed with a status", resBoard.status , "data", data);
        return null
    };
    let boardData = await resBoard.json();
    let boardId = boardData.values[0].id;
    let date = new Date();
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);
    let resSprint = await fetch(`https://api.atlassian.com/ex/jira/${scopeId}/rest/agile/1.0/sprint/`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + JiraUser.access_token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: sprintName,
            originBoardId: boardId,
            goal: "Created by ActionReaction " + sprintName,
            endDate: date.toISOString(),
            startDate: endDate.toISOString(),
        }),
    });
    if (resSprint.status !== 201) {
        let data = await resSprint.text();
        console.log("sprint failed with a status", resSprint.status , "data", data);
        return null
    }
};

module.exports = {JiraCreateSprint};