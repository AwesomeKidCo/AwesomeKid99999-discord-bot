const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Guild = require('../../models/guild')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Configure stuff for when a member joins the server. (STAFF ONLY)')
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName('channel')
            .setDescription('Add, change, or remove the welcome channel in the server. (STAFF ONLY)')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel to set')))
        .addSubcommand(subcommand => subcommand
            .setName('message')
            .setDescription('Add, change, or remove the welcome message in the server. (STAFF ONLY)')
            .addStringOption(option => option
                .setName('message')
                .setDescription('The message to set. Use placeholders like {user}, {username}, {tag}, {server}, and \\n for new lines.')))
        .addSubcommand(subcommand => subcommand
            .setName('test')
            .setDescription('Test the welcome message. (STAFF ONLY)')),

    category: 'moderation',
    async execute(interaction) {
        
        if (interaction.options.getSubcommand() === 'channel') {
            const channel = interaction.options.getChannel('channel');
            const [guild] = await Guild.findOrCreate({where: {id: await interaction.guild.id}});




            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return interaction.reply(':x: You do not have permission to manage channels.');

            }

            const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
            if (!botMember.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return interaction.reply(':warning: I do not have permission to manage channels.');

            }


            if (!channel) {
                await guild.update({ welcomeChannelId: null });
                return await interaction.reply('Welcome channel has been set to **none**.');



            } else {
                await guild.update({ welcomeChannelId: channel.id });
                return await interaction.reply(`Welcome channel has been set to **${channel}**`);
            }
        }
        
       if (interaction.options.getSubcommand() === 'message') {

           const message = interaction.options.getString('message');
           const [guild] = await Guild.findOrCreate({where: {id: await interaction.guild.id}});




           if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
               return interaction.reply(':x: You do not have permission to manage messages.');

           }

           const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
           if (!botMember.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
               return interaction.reply(':warning: I do not have permission to manage messages.');

           }


           if (!message) {
               await guild.update({ welcomeMessage: null });
               return await interaction.reply('Removed the welcome message.');



           } else {
               // Replace \n with actual newlines
               const formattedMessage = message.replace(/\\n/g, '\n');

               await guild.update({ welcomeMessage: formattedMessage });
               return interaction.reply({ content: `Welcome message has been set to:\n\`${formattedMessage}\`` });

           }
       }

       if (interaction.options.getSubcommand() === 'test') {
           const [guild] = await Guild.findOrCreate({where: {id: await interaction.guild.id}});

           if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
               return interaction.reply(':x: You do not have permission to manage messages.');

           }

           if (!guild.welcomeMessage) {
               return await interaction.reply('No welcome message has been set.');
           } else {
               return await interaction.reply(`${guild.welcomeMessage
                   .replace('{user}', `<@${interaction.user.id}>`) // Mention the user
                   .replace('{username}', interaction.user.username) // Username of the user
                   .replace('{tag}', interaction.user.tag) // Full tag of the user (e.g., "User#1234")
                   .replace('{server}', interaction.guild.name) // Server name
               }`);
           }
       }

    },
};