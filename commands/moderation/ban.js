const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDMPermission(false)
		.setDescription('Ban a user from the server. (STAFF ONLY)')
		.addUserOption(option => option.setName('target')
        	.setDescription('The user to ban')
	        .setRequired(true))
		
		.addStringOption(option => option.setName('reason').setDescription('The reason for banning the user')),
		category: 'moderation',
		async execute(interaction) {
			 user =  interaction.options.getMember('target');
			const value = interaction.options.getString('reason') ?? 'No reason provided';


			if (!user) {
				user =	interaction.options.getUser('target');
				if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
					 await interaction.reply(':x: You do not have permission to ban users.');
					
				}
				await interaction.guild.bans.create(user, {reason: `${value} - ${interaction.user.tag}`} );
				 return await interaction.reply(`Successfully banned **${user.tag}**\n**Reason:** ${value}`);
				}
			if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
				return interaction.reply(':x: You do not have permission to ban users.');
				
			}

			if (user.id === interaction.user.id) {
				return interaction.reply(':warning: Please do not try to ban yourself.');
			}

			if (user.id === "872195259730386994") {
				return interaction.reply(`Please don't ban me :sob:`)
			}

			const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
			if (!botMember.permissions.has(PermissionsBitField.Flags.BanMembers)) {
				return interaction.reply(':warning: I do not have permission to ban users.');
				
			}			
			const highestRole = botMember.roles.highest;
			
			
			 if (user.roles.highest.comparePositionTo(interaction.member.roles.highest) >= 0) {
				  interaction.reply(":warning: You don't have permission to ban this member because your role is not high enough.");
				  
		
				} else if (user.roles.highest.comparePositionTo(highestRole) >= 0) {
					await interaction.reply(":warning: I don't have permission to ban this member because my role is not high enough.");
					
				  } else
			{
				user.send(`You were banned from **${interaction.guild.name}** by **${interaction.user.tag}**.\n**Reason:** ${value}`).catch(async (err) => {
					console.log(err)
				 return await interaction.reply(`Successfully banned **${user.user.tag}**\n**Reason:** ${value}\nI was unable to DM them`).catch((err) =>{
					 console.log(err)
				 })
})
				await interaction.guild.members.ban(user, {reason: `${value} - ${interaction.user.tag}`} );
				 await interaction.reply(`Successfully banned **${user.user.tag}**\n**Reason:** ${value}`);

			}
			

	},
};