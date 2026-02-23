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

client.login("MTQ3MTE2Nzk1Njg0NjM3OTA5OQ.G-Q75Y.nO5IVCYLI5XgdmkoNg09-jIY06p6QweY0o2tIs");
