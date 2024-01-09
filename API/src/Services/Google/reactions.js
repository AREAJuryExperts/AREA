const db = require("../../../DB");
const refreshToken = require("./RefreshToken");

const GoogleCalendarCreateEvent = async (user) => {
    const startDate = new Date();
    const event = {
        summary: 'AREA',
        description: 'An action have been triggered',
        start: {
          dateTime: startDate,
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: new Date().setMinutes(startDate.getMinutes() + 15),
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
        if (res.ok)
            console.log('Event created successfully.');
        else {
            const errorData = await res.json();
            console.error('Error creating event:', errorData);
        }
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

module.exports = {GoogleCalendarCreateEvent};