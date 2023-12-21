const path = require("path");
const dotenv = require("dotenv");
const { Client, GatewayIntentBits, Partials } = require("discord.js");


dotenv.config({ path: path.join(__dirname, ".env") });

let discordClient = new Client({
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

discordClient.login(process.env.DISCORD_TOKEN);

discordClient.on("ready", () => {
    discordClient.on("messageCreate", async (message) => {
        if (message.author.id === "1183779111005597766") return;

        fetch(process.env.API_URL + "api/discord/webhook", {
            method: "POST",
            body: JSON.stringify(message)
        }) 
    });
});
