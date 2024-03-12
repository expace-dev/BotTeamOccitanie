import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, PermissionFlagsBits, EmbedBuilder, TextChannel } from "discord.js";
import config from "../../config";

export class LockCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "lock",
      description: "La commande lock verouille le salon ou la commande est exécuté",
      usage: "/lock>",
      examples: ["/lock"],
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      userPermissions: [PermissionsBitField.Flags.ManageChannels],
      clientPermissions: [PermissionsBitField.Flags.ManageChannels]
    });
  }

  async execute(interaction: CommandInteraction) {
      await interaction.guild?.channels.edit(interaction.channelId, { 
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [
              PermissionFlagsBits.SendMessages
            ]
          }
        ] 
      });

      await interaction.reply({ content: `Le salon est bien verrouillé`, ephemeral: true });

      const logChannel = this.client.channels.cache.get(config.LOGS_MODERATION) as TextChannel;

      const embed = new EmbedBuilder()
      .setTitle(`**LOCK**`)
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      //.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setColor(config.EMBED_COLOR)
      .setDescription(`Le salon <#${interaction.channelId}> a été verrouyé`);

      logChannel.send({ embeds: [embed] });
  }
}
