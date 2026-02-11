const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// BOT AÇILDIĞINDA
client.once("ready", () => {
  console.log(`Bot giriş yaptı: ${client.user.tag}`);
});

// KOMUT
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!ip") {
    message.reply("connect 185.193.165.62"); // burayı istersen değiştir
  }
});

// RAILWAY KAPATMASIN DİYE (ÇOK ÖNEMLİ)
setInterval(() => {
  console.log("Bot ayakta...");
}, 60000);

// LOGIN (TOKEN ENV'DEN OKUNUR)
client.login(process.env.TOKEN);
