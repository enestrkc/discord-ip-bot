const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// TOKEN Railway'de eklenecek
const TOKEN = process.env.TOKEN;

client.once("ready", () => {
  console.log(`Bot aktif: ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === "!ip") {
    message.channel.send("connect 185.193.165.62");
  }
});

client.login(TOKEN);
