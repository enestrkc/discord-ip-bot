const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const SERVER_IP = "185.193.165.62";

client.on("ready", () => {
  console.log(`${client.user.tag} aktif`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === "!ip") {
    message.channel.send(`connect ${SERVER_IP}`);
  }
});

client.login("");
