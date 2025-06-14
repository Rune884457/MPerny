// 📦 Vereiste modules importeren
require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ChannelType,
  Events
} = require('discord.js');

// 🤖 Client aanmaken
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// ✅ Bot is klaar
client.once('ready', () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

// 🟦 Ticketpanel knop
client.on(Events.MessageCreate, async message => {
  if (message.content === '!ticketpanel') {
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('Buying_Ranks').setLabel('Ranks').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('Spawn_Suggestion').setLabel('Spawn').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('Update_Suggestion').setLabel('Update').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('Buying_Keys').setLabel('Keys').setStyle(ButtonStyle.Danger)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('Claim_Tools').setLabel('Claim').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('Staff_Apply').setLabel('Apply').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('Need_Help').setLabel('Help').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('Bug_Report').setLabel('Bugs').setStyle(ButtonStyle.Danger)
    );

    await message.channel.send({
      content: `📩 **Ticket Panel**

**Ranks** — Wil je een rank kopen of upgraden?
**Spawn** — Suggesties over wat gebouwd kan worden op spawn?
**Update** — Ideeën voor aankomende updates?
**Keys** — Wil je keys verkrijgen?

**Claim** — Hulp nodig bij claim tools?
**Apply** — Wil je helper worden? (Min. 2 weken in de server)
**Help** — Hulp nodig met iets anders?
**Bugs** — Bug gevonden? Meld het hier!`,
      components: [row1, row2]
    });
  }
});

// 🔒 Ticket sluiten met !close
client.on(Events.MessageCreate, async message => {
  if (message.content === '!close') {
    if (!message.channel.name.startsWith('ticket-')) {
      return message.reply('❌ Dit commando kan alleen in een ticketkanaal worden gebruikt.');
    }

    await message.reply('🔒 Ticket wordt gesloten in 5 seconden...');

    setTimeout(() => {
      message.channel.delete().catch(console.error);
    }, 5000);
  }
});

// 🟥 Ticket maken bij button-click
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  const ticketTypes = {
    'Buying_Ranks':      { name: 'Ranks',   message: 'Je hebt een **Ranks** ticket geopend.' },
    'Spawn_Suggestion':  { name: 'Spawn',   message: 'Je hebt een **Spawn** ticket geopend.' },
    'Update_Suggestion': { name: 'Update',  message: 'Je hebt een **Update** ticket geopend.' },
    'Buying_Keys':       { name: 'Keys',    message: 'Je hebt een **Keys** ticket geopend.' },
    'Claim_Tools':       { name: 'Claim',   message: 'Je hebt een **Claim** ticket geopend.' },
    'Staff_Apply':       { name: 'Apply',   message: 'Je hebt een **Apply** ticket geopend.' },
    'Need_Help':         { name: 'Help',    message: 'Je hebt een **Help** ticket geopend.' },
    'Bug_Report':        { name: 'Bugs',    message: 'Je hebt een **Bugs** ticket geopend.' }
  };

  const ticketType = ticketTypes[interaction.customId];
  if (!ticketType) return;

  const existingChannel = interaction.guild.channels.cache.find(c =>
    c.name === `ticket-${ticketType.name}-${interaction.user.id}`
  );

  if (existingChannel) {
    return interaction.reply({ content: '🛑 Je hebt al een open ticket van dit type.', ephemeral: true });
  }

  const supportRoleId = '1341731400759644231'; // <- Pas aan naar jouw rol ID
  const categoryId = '1341466039187279923';     // <- Pas aan naar jouw categorie ID

  try {
    const ticketChannel = await interaction.guild.channels.create({
      name: `ticket-${ticketType.name}-${interaction.user.id}`,
      type: ChannelType.GuildText,
      parent: categoryId,
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
          id: supportRoleId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageChannels
          ]
        }
      ]
    });

    await ticketChannel.send(`📨 <@${interaction.user.id}> ${ticketType.message}`);
    await interaction.reply({ content: `✅ Ticket aangemaakt: ${ticketChannel}`, ephemeral: true });

  } catch (err) {
    console.error(err);
    await interaction.reply({ content: '❌ Er ging iets mis bij het aanmaken van de ticket.', ephemeral: true });
  }
});

// 🔑 Bot starten met veilige token
client.login(process.env.DISCORD_TOKEN);
