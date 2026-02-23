const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.on("ready", () => {
  console.log(`${client.user.tag} aktif`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!ip") {
    message.channel.send("connect 185.193.165.62");
  }
});

// TOKENINI BURAYA YAPISTIR
client.login(process.env.TOKEN);
