const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Guild = require('../../models/guild')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modmute')
		.setDescription('Mute a member in the server. (STAFF ONLY)')
		.setDMPermission(false)
		.addUserOption(option => option.setName('target')
        	.setDescription('The user to mute')
	        .setRequired(true)),
			
		
		category: 'moderation',
		async execute(interaction) {
			

			let target =  interaction.options.getMember('target');
			const guild = await Guild.findOne({ where: { id: await interaction.guild.id }});
			if (!guild) {
				console.log(`${interaction.guild.name} does not exist in the database`);
				return await  interaction.reply(`Please try to set a mute role first.`)
			}
			const role = await interaction.guild.roles.fetch(`${guild.muteRoleId}`);
			if (!role) {
				console.log(`${interaction.guild.name} does not have a muterole set`);
				return await interaction.reply(`:warning: There is no mute role set.`)
			}
			await interaction.deferReply();



			if (!target) {
				if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
					return await interaction.editReply( ':x: You do not have permission to manage roles.');
				}
				return await interaction.editReply(`You cannot mute **${target.tag}** because they are not in the server.`);
			}
			
			if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
				return await interaction.editReply(':x: You do not have permission to mute members.');
			}
			
			
			const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
			if (target === botMember) {
				return await interaction.editReply('Please don\'t mute me :sob:');
			}
			if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
				return await interaction.editReply(':warning: I do not have permission to mute members.');
				
			}
			const highestRole = botMember.roles.highest;
			
			const ownerPromise = interaction.guild.fetchOwner();
			const owner = await ownerPromise;
			
			if (interaction.member === owner) {
				if (role.comparePositionTo(highestRole) >= 0) {
					return await interaction.editReply( `:warning: I cannot mute **${target.user.tag}** because my role is not high enough.`);
				} else {
					await target.roles.remove(role);
					return await interaction.editReply(`Successfully muted **${target.user.tag}**`);
				}
			} else {
			 	if (user.roles.highest.comparePositionTo(interaction.member.roles.highest) >= 0) {
					return await interaction.editReply(`:warning: You cannot mute **${target.user.tag}** because your role is not high enough.`);
				} else if (user.roles.highest.comparePositionTo(highestRole) >= 0) {
					return await interaction.editReply( `:warning: I cannot mute **${target.user.tag}** because my role is not high enough.`);	
				} else {
				await user.roles.add(role);
				return await interaction.editReply(`Successfully muted **${target.user.tag}**`);
			}
		}	

	},
};