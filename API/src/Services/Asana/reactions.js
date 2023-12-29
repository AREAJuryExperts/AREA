const db = require("../../../DB");
const { refreshToken} = require("./refreshToken");

const AsanaCreateProject = async (user, projectName = "Project" + Math.floor(Math.random() * 100000), projectId= -1) => {

    let params = {
        TableName: "AsanaUsers",
        IndexName: "userId",
        KeyConditionExpression: "userId = :n",
        ExpressionAttributeValues: {
            ":n": user.id,
        },
    };
    let tmpUser = await db.client().query(params).promise();
    console.log("hello 1");
    if (tmpUser.Count === 0) return null;
    console.log("hello 2");
    let AsanaUser = tmpUser.Items[0];
    if (!AsanaUser) return null;
    console.log("hello 3");
    if (!AsanaUser.token) return null;
    console.log("hello 4");
    if (projectId === -1) {
        let url = 'https://app.asana.com/api/1.0/workspaces?opt_fields=';
        let options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            authorization: `Bearer ${AsanaUser.access_token}`
          }
        };
        try {
            let res = await fetch(url, options);
            if (res.status !== 201) {
                let token = await refreshToken(AsanaUser.refresh_token, AsanaUser);
                console.log("hello 5");
                if (!token.access_token) return null;
                console.log("hello 66");
                AsanaUser.access_token = token.access_token;
                res = await fetch(url, options);
                if (res.status !== 200) return null;
                console.log("hello 777");
            }
            let data = await res.json();
            projectId = data.data[0].id;
        } catch (err) {
            console.log(err);
            return null;
        }

    }
    let url = `https://app.asana.com/api/1.0/projects`;
    console.log("hello 888");
    try {
        let lastres = await fetch(url, {headers : {accept: 'application/json', authorization: `Bearer ${AsanaUser.access_token}`}, 
        method : "POST", body : JSON.stringify({data : {name : projectName, workspace : projectId}})})
    } catch(err)
    {
        console.log(err);
        return null;
    }
    return "not null"
};

module.exports = {AsanaCreateProject};