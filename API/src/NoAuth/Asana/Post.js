const utils = require("../../Utils");
const db = require("../../../DB");
const router = require("./../../Services/Router");
// const crypto = require("crypto");

const getUserByAsanaId = async (id) => {
    let params = {
        TableName: "AsanaUsers",
        Key: {
            id: id,
        },
    };
    let tmpUser = await db.client().get(params).promise();
    if (tmpUser.Count == 0) return null;

    let user = tmpUser.Item;
    if (!user) return null;
    if (!user.userId) return null;
    params = {
        TableName: "Users",
        Key: {
            id: user.userId,
        },
    };
    tmpUser = await db.client().get(params).promise();
    if (tmpUser.Count == 0) return null;
    user = tmpUser.Item;
    return user;
};



var webHookToken = "";
/*
{
  "data": [
    {
      "user": {
        "gid": "1205547534482551",
        "resource_type": "user",
        "name": "Robin Denni"
      },
      "created_at": "2023-12-27T13:40:30.654Z",
      "type": "story",
      "action": "added",
      "resource": {
        "gid": "1206244391225686",
        "resource_type": "story",
        "created_at": "2023-12-27T13:40:30.552Z",
        "created_by": {
          "gid": "1205547534482551",
          "resource_type": "user",
          "name": "Robin Denni"
        },
        "type": "system",
        "text": "Robin Denni a ajouté la tâche à Project name"
      },
      "parent": {
        "gid": "1206244732155824",
        "resource_type": "task",
        "name": "ecrire une tâche",
        "resource_subtype": "default_task"
      }
    },
    {
      "user": {
        "gid": "1205547534482551",
        "resource_type": "user",
        "name": "Robin Denni"
      },
      "created_at": "2023-12-27T13:40:30.584Z",
      "type": "task",
      "action": "added",
      "resource": {
        "gid": "1206244732155824",
        "resource_type": "task",
        "name": "ecrire une tâche",
        "resource_subtype": "default_task"
      },
      "parent": {
        "gid": "1206214170189176",
        "resource_type": "project",
        "name": "Project name"
      }
    },
    {
      "user": {
        "gid": "1205547534482551",
        "resource_type": "user",
        "name": "Robin Denni"
      },
      "created_at": "2023-12-27T13:40:30.644Z",
      "type": "task",
      "action": "added",
      "resource": {
        "gid": "1206244732155824",
        "resource_type": "task",
        "name": "ecrire une tâche",
        "resource_subtype": "default_task"
      },
      "parent": {
        "gid": "1206214170189187",
        "resource_type": "section",
        "name": "Section sans nom"
      }
    },
    {
      "user": {
        "gid": "1205547534482551",
        "resource_type": "user",
        "name": "Robin Denni"
      },
      "created_at": "2023-12-27T13:40:36.082Z",
      "type": "task",
      "action": "changed",
      "resource": {
        "gid": "1206244732155824",
        "resource_type": "task",
        "name": "ecrire une tâche",
        "resource_subtype": "default_task"
      },
      "parent": null,
      "change": {
        "field": "name",
        "action": "changed"
      }
    },
    {
      "user": {
        "gid": "1205547534482551",
        "resource_type": "user",
        "name": "Robin Denni"
      },
      "created_at": "2023-12-27T13:40:39.079Z",
      "type": "task",
      "action": "changed",
      "resource": {
        "gid": "1206244732155824",
        "resource_type": "task",
        "name": "ecrire une tâche",
        "resource_subtype": "default_task"
      },
      "parent": null,
      "change": {
        "field": "name",
        "action": "changed"
      }
    },
    {
      "user": {
        "gid": "1205547534482551",
        "resource_type": "user",
        "name": "Robin Denni"
      },
      "created_at": "2023-12-27T13:40:40.742Z",
      "type": "task",
      "action": "changed",
      "resource": {
        "gid": "1206244732155824",
        "resource_type": "task",
        "name": "ecrire une tâche",
        "resource_subtype": "default_task"
      },
      "parent": null,
      "change": {
        "field": "name",
        "action": "changed"
      }
    },
    {
      "user": {
        "gid": "1205547534482551",
        "resource_type": "user",
        "name": "Robin Denni"
      },
      "created_at": "2023-12-27T13:40:40.919Z",
      "type": "task",
      "action": "added",
      "resource": {
        "gid": "1206244732155826",
        "resource_type": "task",
        "name": "",
        "resource_subtype": "default_task"
      },
      "parent": {
        "gid": "1206214170189176",
        "resource_type": "project",
        "name": "Project name"
      }
    },
    {
      "user": {
        "gid": "1205547534482551",
        "resource_type": "user",
        "name": "Robin Denni"
      },
      "created_at": "2023-12-27T13:40:40.976Z",
      "type": "task",
      "action": "added",
      "resource": {
        "gid": "1206244732155826",
        "resource_type": "task",
        "name": "",
        "resource_subtype": "default_task"
      },
      "parent": {
        "gid": "1206214170189187",
        "resource_type": "section",
        "name": "Section sans nom"
      }
    },
    {
      "user": {
        "gid": "1205547534482551",
        "resource_type": "user",
        "name": "Robin Denni"
      },
      "created_at": "2023-12-27T13:40:40.990Z",
      "type": "story",
      "action": "added",
      "resource": {
        "gid": "1206244736502553",
        "resource_type": "story",
        "created_at": "2023-12-27T13:40:40.885Z",
        "created_by": {
          "gid": "1205547534482551",
          "resource_type": "user",
          "name": "Robin Denni"
        },
        "type": "system",
        "text": "Robin Denni a ajouté la tâche à Project name"
      },
      "parent": {
        "gid": "1206244732155826",
        "resource_type": "task",
        "name": "",
        "resource_subtype": "default_task"
      }
    }
  ],
  "sync": "cf471617683bc1753efb4c7b030fc14e:0",
  "has_more": false
}



*/


let secret = "";

const postWebhook = async (req, res) => {
    let user;
    if (req.body.data) {
      for (let i in req.body.data) {
          if (!user && req.body.data[i].user) {
              user = await getUserByAsanaId(req.body.data[i].user.gid);
          }
          if (req.body.data[i].type == "task" && req.body.data[i].action == "added") {
              await router("AsanaAction", user);
              break;
          }
      }
    }
    if (req.headers["x-hook-secret"])
      secret = req.headers["x-hook-secret"];
    await res.setHeader("X-Hook-Secret", secret);
    return res.status(200).json({ msg: "Request valid" });
    // return res.sendStatus(400).json({ msg: "Bad request" });
}

module.exports = postWebhook;
