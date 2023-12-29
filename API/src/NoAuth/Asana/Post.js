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
};






const postWebhook = async (req, res) => {
    let user;
    let secret = "";
    if (req.body.data) {
      for (let i in req.body.data) {
          if (!user && req.body.data[i].user) {
              user = await getUserByAsanaId(req.body.data[i].user.gid);
          }
          if (req.body.data[i].type === "project" && req.body.data[i].action === "added") {
              await router("ProjectCreated", user.user);
              break;
          }
          if (req.body.data[i].type === "project" && (req.body.data[i].action === "removed" || req.body.data[i].action === "deleted")) {
            await router("ProjectRemoved", user.user);
            break;
        }
      }
    }
    if (req.headers["x-hook-secret"]) {
      user = await getUserByAsanaId(req.query.userAsanaId);
      user.asanaUser.webhookSecret = req.headers["x-hook-secret"];
      console.log(user);
      try {
        await dynamo.client().put({TableName: "AsanaUsers",Item: user.asanaUser}).promise();
      } catch (err) {
        console.log(err);
        return res.status(500).send({msg: "Internal server error database"});
      }
      secret = req.headers["x-hook-secret"];
    } else {
      if (!user)
        user = await getUserByAsanaId(req.query.userAsanaId);
      secret = user.asanaUser.webhookSecret;
    }
    res.header("X-Hook-Secret", secret)
    return res.status(200).json({ msg: "Request valid" });
}

module.exports = postWebhook;
