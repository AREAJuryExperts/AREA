const utils = require("../../Utils");
const db = require("../../../DB");
const router = require("./../../Services/Router");

const getUserByAsanaId = async (id) => {
    let params = {
        TableName: "AsanaUsers",
        Key: {
            id: Number(id),
        },
    };
    try {
      let tmpUser = await db.client().get(params).promise();
      if (tmpUser.Count == 0) return null;
  
      let AsanaUser = tmpUser.Item;
      if (!AsanaUser) return null;
      if (!AsanaUser.userId) return null;
      params = {
          TableName: "Users",
          Key: {
              id: AsanaUser.userId,
          },
      };
      tmpUser = await db.client().get(params).promise();
      if (tmpUser.Count == 0) return null;
      let user = tmpUser.Item;
      return {user : user, asanaUser : AsanaUser};
    } catch (err) {
      console.log(err);
      return {}
    }
};


const postWebhook = async (req, res) => {
    let user;
    let secret = "";

    if (req.body.events) {
      for (let i in req.body.events) {
          if (!user && req.body.events[i].user) {
              user = await getUserByAsanaId(req.body.events[i].user.gid);
              if (!user.asanaUser || !user.user)
                return res.status(400).send({msg: "User not found"});
          }
          if (req.body.events[i].action === "added") {
              await router("ProjectCreated", user.user);
              break;
          }
          if ((req.body.events[i].action === "removed" || req.body.events[i].action === "deleted")) {
            await router("ProjectRemoved", user.user);
            break;
        }
      }
    }
    if (req.headers["x-hook-secret"]) {
      user = await getUserByAsanaId(req.query.userAsanaId);
      if (!user.asanaUser || !user.user) return res.status(400).send({msg: "User not found"});
      user.asanaUser.webhookSecret = req.headers["x-hook-secret"];
      try {
        await db.client().put({TableName: "AsanaUsers",Item: user.asanaUser}).promise();
      } catch (err) {
        console.error(err);
        return res.status(500).send({msg: "Internal server error database"});
      }
      secret = req.headers["x-hook-secret"];
    } else {
      if (!user) {
        user = await getUserByAsanaId(req.query.userAsanaId);
        if (!user.asanaUser || !user.user) return res.status(400).send({msg: "User not found"});
      }
      secret = user.asanaUser.webhookSecret;
    }
    res.header("X-Hook-Secret", secret)
    return res.status(200).json({ msg: "Request valid" });
}

module.exports = postWebhook;
