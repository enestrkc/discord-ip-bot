const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ChannelType
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const SERVER_IP = process.env.SERVER_IP;
const TICKET_CATEGORY = process.env.TICKET_CATEGORY;
const STAFF_ROLE = process.env.STAFF_ROLE;

client.once("ready", () => {
  console.log(`Bot aktif: ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  // Ticket aç
  if (interaction.customId === "ticket_ac") {
    await interaction.deferReply({ ephemeral: true });

    const existing = interaction.guild.channels.cache.find(
      c => c.topic === interaction.user.id
    );

    if (existing) {
      return interaction.editReply({
        content: `Zaten açık bir destek talebin var: ${existing}`
      });
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: TICKET_CATEGORY,
      topic: interaction.user.id,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        },
        {
          id: STAFF_ROLE,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        }
      ]
    });

    const closeButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_kapat")
        .setLabel("Destek Talebini Kapat")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({
      content: `<@${interaction.user.id}> destek ekibi seninle ilgilenecek.`,
      components: [closeButton]
    });

    interaction.editReply({
      content: `Destek talebin oluşturuldu: ${channel}`
    });
  }

  // Ticket kapat
  if (interaction.customId === "ticket_kapat") {
    await interaction.deferReply({ ephemeral: true });

    await interaction.editReply({
      content: "Ticket 5 saniye içinde kapanacak."
    });

    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 5000);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // IP komutu
  if (message.content === "!ip") {
    message.reply(`🎮 CS2 Sunucu IP: **${SERVER_IP}**`);
  }

  // Destek panel kur
  if (message.content === "!destekkur") {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_ac")
        .setLabel("Destek Oluştur")
        .setStyle(ButtonStyle.Success)
    );

    message.channel.send({
      embeds: [{
        title: "Destek Sistemi",
        description: "Destek talebi oluşturmak için aşağıdaki butona bas.",
        color: 0x2ecc71
      }],
      components: [row]
    });
  }
});

client.login(process.env.TOKEN);
