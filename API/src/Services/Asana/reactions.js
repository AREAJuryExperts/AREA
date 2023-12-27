const db = require("../../../DB");
const { refreshToken} = require("./refreshToken");

const AsanaCreateProject = async (user, projectName = "testReactionAs", projectId= -1) => {

    let params = {
        TableName: "AsanaUsers",
        IndexName: "userId",
        KeyConditionExpression: "userId = :n",
        ExpressionAttributeValues: {
            ":n": user.id,
        },
    };
    let tmpUser = await db.client().query(params).promise();
    if (tmpUser.Count === 0) return null;

    let AsanaUser = tmpUser.Items[0];
    if (!AsanaUser) return null;
    if (!AsanaUser.token) return null;
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
                if (!token.access_token) return null;
                AsanaUser.access_token = token.access_token;
                res = await fetch(url, options);
                if (res.status !== 200) return null;
            }
            let data = await res.json();
            projectId = data.data[0].id;
        } catch (err) {
            console.log(err);
            return null;
        }

    }
    let url = `https://app.asana.com/api/1.0/projects`;
    fetch(url, {headers : {accept: 'application/json', authorization: `Bearer ${AsanaUser.access_token}`}, 
    method : "POST", body : JSON.stringify({data : {name : projectName, workspace : projectId}})})
};

module.exports = AsanaCreateProject;