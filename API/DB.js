const AWS = require("aws-sdk");
const utils = require("./src/Utils");

const path = require("path");
const { Client, GatewayIntentBits, Partials } = require("discord.js");

var client_ = null;

var services_ = {};

var discordClient_ = null;

module.exports = {
    connect: async function (callback) {
        AWS.config.update({
            region: "eu-west-3",
            accessKeyId: process.env.DB_ACCESS_KEY,
            secretAccessKey: process.env.DB_SECRET_KEY,
            // endpoint: process.env.DB_ENDPOINT,
        });
        client_ = new AWS.DynamoDB.DocumentClient();
        discordClient_ = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
            ],
            partials: [Partials.Channel],
        });

        try {
            services_ = utils.readJSON(path.join(__dirname, "services.json"));
            if (services_ == null) {
                throw "No services.json";
            }
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
        console.log("connecting to discord...")
        await discordClient_.login(process.env.DISCORD_TOKEN);
        console.log("connected to discord !")
        callback();
    },
    client: function () {
        return client_;
    },

    services: function () {
        return services_;
    },

    discordClient: function () {
        return discordClient_;
    },
};
