const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require("discord.js");

const TOKEN = process.env.TOKEN;
const SERVER_IP = process.env.SERVER_IP;
const STAFF_ROLE = process.env.STAFF_ROLE;
const TICKET_CATEGORY = process.env.TICKET_CATEGORY;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const openTickets = new Set();

client.once("ready", () => {
  console.log(`Bot aktif: ${client.user.tag}`);
});

// MESAJ KOMUTLARI
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // IP KOMUTU
  if (message.content === "!ip") {
    message.reply(
      `🎮 Sunucuya bağlanmak için:\n\`\`\`connect ${SERVER_IP}\`\`\``
    );
  }

  // DESTEK PANELİ KUR
  if (message.content === "!destekkur") {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_ac")
        .setLabel("Destek Oluştur")
        .setStyle(ButtonStyle.Success)
    );

    message.channel.send({
      embeds: [
        {
          title: "🎫 Destek Sistemi",
          description:
            "Destek talebi oluşturmak için aşağıdaki butona bas.",
          color: 0x2ecc71
        }
      ],
      components: [row]
    });
  }
});

// BUTON OLAYI
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  // TICKET AÇ
  if (interaction.customId === "ticket_ac") {
    if (openTickets.has(interaction.user.id)) {
      return interaction.reply({
        content: "Zaten açık bir destek talebin var.",
        ephemeral: true
      });
    }

    const guild = interaction.guild;

    const channel = await guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: 0,
      parent: TICKET_CATEGORY,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        },
        {
          id: STAFF_ROLE,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        }
      ]
    });

    openTickets.add(interaction.user.id);

    const closeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_kapat")
        .setLabel("Ticket Kapat")
        .setStyle(ButtonStyle.Danger)
    );

    channel.send({
      content: `<@${interaction.user.id}> | <@&${STAFF_ROLE}>`,
      embeds: [
        {
          title: "Destek Talebi",
          description: "Yetkililer seninle ilgilenecek.",
          color: 0x3498db
        }
      ],
      components: [closeRow]
    });

    interaction.reply({
      content: `Ticket açıldı: ${channel}`,
      ephemeral: true
    });
  }

  // TICKET KAPAT
  if (interaction.customId === "ticket_kapat") {
    const userId = interaction.channel.name.split("-")[1];
    openTickets.delete(userId);

    await interaction.reply("Ticket 5 saniye sonra kapanacak.");

    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 5000);
  }
});

client.login(TOKEN);
