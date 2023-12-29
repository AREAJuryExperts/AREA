const db = require("../../../DB");

const TrelloCreateNewBoard = async (user, boardName = "New board") => {

    let params =  {
        TableName: "TrelloUsers",
        IndexName: "userId",
        KeyConditionExpression: "userId = :n",
        ExpressionAttributeValues: {
            ":n": user.id,
        },
    };
    let tmpUser = await db.client().query(params).promise();
    if (tmpUser.Count == 0) return null;

    let trelloUser = tmpUser.Items[0];
    if (!trelloUser) return null;
    if (!trelloUser.token) return null;

    await fetch(`https://api.trello.com/1/boards/?name=${boardName}&idOrganization=6565d4cda86aff70f260708f&key=${process.env.TRELLO_KEY}&token=${trelloUser.token}`, {method: "POST"})
};

module.exports = { TrelloCreateNewBoard };
