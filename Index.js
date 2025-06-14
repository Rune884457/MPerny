const { Client, GatewayIntentBits, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');
require('dotenv').config(); // helemaal bovenaan in Index.js

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.login(process.env.BOT_TOKEN);

// ✅ Bot klaar
client.once('ready', () => {
  console.log(`Bot online als ${client.user.tag}`);
});

// 🟦 Stuur ticketpaneel met knop
client.on('messageCreate', async message => {
  if (message.content === '!ticketpanel') {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('Buying_Ranks')
          .setLabel('Ranks')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('Spawn_Suggestion')
          .setLabel('Spawn')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('Update_Suggestion')
          .setLabel('Upate')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('Buying_Keys')
          .setLabel('Keys')
          .setStyle(ButtonStyle.Danger)
      );

    await message.channel.send({
      content: `Hello and welcome to the ticket panel with the reasons Ranks, Spawn and Update!
    
Would you like to buy a Rank or a Rank Upgrade? Then create a ticket with the reason Ranks!
    
Would you like to make a suggestion about what can be built on Spawn? Then create a ticket with the reason Spawn!
    
Would you like to make a suggestion about possible elements of an upcoming update? Then create a ticket with the reason Update!
    
Would you like to get some keys? Then create a ticket with the reason Keys!`,
      components: [row]
    });
  }
});
client.on('messageCreate', async message => {
  if (message.content === '!ticketpanel') {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('Claim_Tools')
          .setLabel('Claim')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('Staff_Apply')
          .setLabel('Apply')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('Need_Help')
          .setLabel('Help')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('Bug_Report')
          .setLabel('Bugs')
          .setStyle(ButtonStyle.Danger)
      );
const { Events } = require('discord.js');
client.on(Events.MessageCreate, async message => {
  if (message.content === '!close') {
    // Zorg dat dit alleen werkt in ticket-kanalen
    if (!message.channel.name.startsWith('ticket-')) {
      return message.reply('❌ Dit commando kan alleen in een ticketkanaal worden gebruikt.');
    }

    // Eventueel bevestiging vragen
    await message.reply('🔒 Ticket wordt gesloten in 5 seconden...');
    
    setTimeout(() => {
      message.channel.delete().catch(console.error);
    }, 5000); // 5 seconden vertraging
  }
});

    await message.channel.send({
      content: `Hello and welcome to the ticket panel with the reasons Claim, Apply and Help!

Are you new and do you need Claim Tools? Then create a ticket with the reason 'Claim'

Do you want to apply for helper? Then create a ticket with the reason 'Apply'. Then someone will come to you asap. This is only possible after you have been in this discord for 2 weeks!

Do you need help with something? Then create a ticket with the reason 'Help'! Then someone will come to you asap to you!

Do you find any bugs in the minecraft server MPerny? Then create a ticket with the reason 'Bugs' and report it to us. If it is a bug which could cause you a big unfair advantage we maybe give you some in-game money/mpernycoins or maybe a free rank. How big it is depends on how big the unfair advantage could be. This only counts If you didnt use it. If you use it (no matter the fact If you report it or not) you will be banned forever because its considered Hacking!`,
      components: [row]
    });
  }
});

// 🟥 Actie wanneer op de knop gedrukt wordt
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const ticketTypes = {
    'Buying_Ranks': {
      name: 'Ranks',
      message: 'You have opened a **Ranks** ticket. A Staffmember comes asap to you!'
    },
    'Spawn_Suggestion': {
      name: 'Spawn',
      message: 'You have opened a **Spawn** ticket. A Staffmember comes asap to you!'
    },
    'Update_Suggestion': {
      name: 'Update',
      message: 'You have opened an **Update** ticket. A Staffmember comes asap to you!'
    },
    'Buying_Keys': {
      name: 'Keys',
      message: 'You have opened a **Keys** ticket. A Staffmember comes asap to you!'
    },
    'Claim_Tools': {
      name: 'Claim',
      message: 'You have opened a **Claim** ticket. A Staffmember comes asap to you!'
    },
    'Staff_Apply': {
      name: 'Apply',
      message: 'You have opened a **Apply** ticket. A Staffmember comes asap to you!'
    },
    'Need_Help': {
      name: 'Help',
      message: 'You have opened an **Help** ticket. A Staffmember comes asap to you!'
    },
    'Bug_Report': {
      name: 'Bugs',
      message: 'You have opened a **Bugs** ticket. A Staffmember comes asap to you!'
    }
  };

  const ticketType = ticketTypes[interaction.customId];
  if (!ticketType) return;

  const existingChannel = interaction.guild.channels.cache.find(c =>
    c.name === `ticket-${ticketType.name}-${interaction.user.id}`
  );
  if (existingChannel) {
    return interaction.reply({ content: '🛑 Je hebt al een open ticket van dit type.', ephemeral: true });
  }

  const supportRoleId = '1341731400759644231'; // <-- Zet hier de juiste rol-ID

  try {
    const ticketChannel = await interaction.guild.channels.create({
  name: `ticket-${ticketType.name}-${interaction.user.id}`,
  type: ChannelType.GuildText,
  parent: '1341466039187279923', // Vervang dit met jouw categorie-ID
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
    await interaction.reply({ content: '❌ Er ging iets mis met het maken van het ticket.', ephemeral: true });
  }
});

client.login('client.login(process.env.BOT_TOKEN);');