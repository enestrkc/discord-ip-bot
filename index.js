const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField 
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});


// ==================== READY ====================

client.once("ready", () => {
  console.log(`${client.user.tag} aktif!`);
});


// ==================== IP KOMUTU ====================

const SERVER_IP = "connect 185.193.165.62"; // değiştir

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const mesaj = message.content.toLowerCase();

  // !ip komutu
  if (mesaj === "!ip") {
    return message.channel.send(`🌐 Sunucu IP: **${SERVER_IP}**`);
  }

  // ==================== STEAM SERBEST ====================

  if (mesaj.includes("steamcommunity.com/profiles/")) return;

  // ==================== REKLAM ENGEL ====================

  const reklamKelime = [
    "discord.gg/",
    "discord.com/invite/",
    ".gg/"
  ];

  if (reklamKelime.some(kelime => mesaj.includes(kelime))) {

    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    await message.delete().catch(() => {});

    message.channel.send(`🚫 ${message.author}, reklam yapmak yasak!`)
      .then(msg => {
        setTimeout(() => msg.delete().catch(()=>{}), 5000);
      });
  }
});


// ==================== RAILWAY KEEP ALIVE ====================

setInterval(() => {
  console.log("Bot ayakta...");
}, 60000);


// ==================== LOGIN ====================

client.login(process.env.TOKEN);
