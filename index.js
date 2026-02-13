const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ================== AYARLAR ==================
const KANAL_ADI = "『➕』destek-oluştur";
const YETKILI_ROL_ADI = "Yetkili Ekip";
const KATEGORI_ADI = "----------DESTEK SİSTEMİ----------";
const SUNUCU_IP = "185.193.165.62";
// ============================================

// BOT AÇILDIĞINDA
client.once("ready", async () => {
  console.log(`Bot giriş yaptı: ${client.user.tag}`);

  client.guilds.cache.forEach(async (guild) => {
    // KATEGORI
    let kategori = guild.channels.cache.find(
      c => c.name === KATEGORI_ADI && c.type === ChannelType.GuildCategory
    );
    if (!kategori) {
      kategori = await guild.channels.create({
        name: KATEGORI_ADI,
        type: ChannelType.GuildCategory
      });
    }

    // DESTEK KANALI
    let kanal = guild.channels.cache.find(c => c.name === KANAL_ADI);
    if (!kanal) {
      kanal = await guild.channels.create({
        name: KANAL_ADI,
        type: ChannelType.GuildText,
        parent: kategori.id,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            allow: [PermissionsBitField.Flags.ViewChannel]
          }
        ]
      });

      const embed = new EmbedBuilder()
        .setTitle("🎫 Destek Sistemi")
        .setDescription("Destek talebi oluşturmak için aşağıdaki butona bas.")
        .setColor("Green");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("destek_ac")
          .setLabel("➕ Destek Oluştur")
          .setStyle(ButtonStyle.Success)
      );

      kanal.send({ embeds: [embed], components: [row] });
    }
  });
});

// ================== MESAJ KOMUTU ==================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ip") {
    message.reply(`Sunucu IP: **${SUNUCU_IP}**`);
  }
});

// ================== BUTON İŞLEMLERİ ==================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const guild = interaction.guild;
  const member = interaction.member;

  // DESTEK AÇ
  if (interaction.customId === "destek_ac") {
    const yetkiliRol = guild.roles.cache.find(r => r.name === YETKILI_ROL_ADI);
    if (!yetkiliRol) {
      return interaction.reply({ content: "❌ Yetkili rolü bulunamadı.", ephemeral: true });
    }

    const kategori = guild.channels.cache.find(
      c => c.name === KATEGORI_ADI && c.type === ChannelType.GuildCategory
    );

    const kanalAdi = `ticket-${member.user.username}`.toLowerCase();

    const kanal = await guild.channels.create({
      name: kanalAdi,
      type: ChannelType.GuildText,
      parent: kategori.id,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: member.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        },
        {
          id: yetkiliRol.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle("📨 Destek Talebi Açıldı")
      .setDescription("Yetkili ekip seninle ilgilenecek.\nKapatmak için aşağıdaki butonu kullan.")
      .setColor("Blue");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("destek_kapat")
        .setLabel("🔒 Destek Kapat")
        .setStyle(ButtonStyle.Danger)
    );

    kanal.send({ content: `<@${member.id}>`, embeds: [embed], components: [row] });
    interaction.reply({ content: "✅ Destek talebin oluşturuldu.", ephemeral: true });
  }

  // DESTEK KAPAT
  if (interaction.customId === "destek_kapat") {
    await interaction.channel.delete();
  }
});

// RAILWAY KAPATMAMASI İÇİN
setInterval(() => {
  console.log("Bot ayakta...");
}, 60000);
156  // 🔥 REKLAM ENGELLEME
     (BURAYA YAPIŞTIR)

...reklam kodu...

// LOGIN
client.login(process.env.TOKEN);

// LOGIN
client.login(process.env.TOKEN);
