import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, TextChannel } from "discord.js";
import config from "../../config";

export class UnlockCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "unlock",
      description: "Déverouille le salon ou la commande est tapée",
      usage: "/unlock>",
      examples: ["/unlock"],
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      options: [
        {
          name: "raison",
          type: ApplicationCommandOptionType.String,
          description: "La raison du unmute",
          required: true
        },
      ],
      userPermissions: [PermissionsBitField.Flags.ManageChannels],
      clientPermissions: [PermissionsBitField.Flags.ManageChannels]
    });
  }

  async execute(interaction: CommandInteraction) {
      await interaction.guild?.channels.edit(interaction.channelId, { 
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            allow: [
              PermissionFlagsBits.SendMessages
            ]
          }
        ] 
      });

      await interaction.reply({ content: `Le salon est bien déverrouillé`, ephemeral: true });

      const logChannel = this.client.channels.cache.get(config.LOGS_MODERATION) as TextChannel;
      const raison = interaction.options.get("raison", true).value as string;

      const embed = new EmbedBuilder()
      .setTitle(`**UNLOCK**`)
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      .setColor(config.EMBED_COLOR)
      .setDescription(`Le salon <#${interaction.channelId}> a été déverrouillé
      
      **Raison**
      ${raison}`);

                logChannel.send({ embeds: [embed] });
  }
}
