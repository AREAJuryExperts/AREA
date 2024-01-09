const db = require("../../../DB");
const refreshToken = require("./RefreshToken");

const GoogleCalendarCreateEvent = async (user) => {

    let endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() + 15);
    const event = {
        summary: 'AREA',
        description: 'An action have been triggered',
        start: {
          dateTime: new Date(),
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: endDate,
          timeZone: 'Europe/Paris',
        },
    };

    let params = {
        TableName: "GoogleUsers",
        IndexName: "userId",
        KeyConditionExpression: "userId = :n",
        ExpressionAttributeValues: {
            ":n": user.id,
        },
    };
    let tmpUser = await db.client().query(params).promise();
    if (tmpUser.Count === 0) return null;
    let GoogleUser = tmpUser.Items[0];
    if (!GoogleUser) return null;
    if (new Date() >= GoogleUser.expiresIn) {
        let newToken = await refreshToken(GoogleUser);
        if (!newToken) return null;
        GoogleUser.access_token = newToken;
    }
    let url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    let options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${GoogleUser.access_token}`
        },
        body: JSON.stringify(event),
    };
    try {
        let res = await fetch(url, options);
        if (res.status !== 200)
            res.status(400).send({ msg: "Error while creating an event." });
        else
            res.status(200).send({ msg: "ok" });
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

module.exports = {GoogleCalendarCreateEvent};