const { discordSendMp }  = require("./Discord/reactions")
const { TrelloCreateNewBoard } = require("./Trello/reactions")
const { GithubCreateNewRepo } = require("./Github/reactions")
const { AsanaCreateProject } = require("./Asana/reactions")
const db = require("../../DB");

const getReaction = async (action, user) => {
    if (! user || ! user.id) {
        return null;
    }

    const params = {
        TableName: "Area",
        IndexName: "userId",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": user.id
        }
    };

    let data = await db.client().query(params).promise();
    
    if (data.Count == 0) return null;
    let areas = data.Items.filter(item => item.action.action === action && item.active === true);
    let out = [];
    for (let i = 0; i < areas.length; i++) {
        for (let j = 0; j < areas[i].reactions.length; j++) {
            out.push(areas[i].reactions[j]);
        }
    }
    return out;
}

const router = async (action, user) => {
    let reactions = await getReaction(action, user);

    if (!reactions) return;
    for (let i = 0; i < reactions.length; i++) {
        if (reactions[i].reaction === "discordSendMp")
            await discordSendMp(user);
        if (reactions[i].reaction === "trelloCreateNewBoard")
            await TrelloCreateNewBoard(user);
        if (reactions[i].reaction === "GithubCreateNewRepo") {
            await GithubCreateNewRepo(user);
        }
        if (reactions[i].reaction === "AsanaCreateNewProject")
            await AsanaCreateProject(user);
    }
}

module.exports = router;