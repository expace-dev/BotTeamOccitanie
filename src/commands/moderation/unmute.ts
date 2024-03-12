import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, GuildMember, TextChannel, EmbedBuilder } from "discord.js";
import config from "../../config";

export class UnmuteCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "unmute",
      usage: "/unmute <utilisateur> <raison>",
      examples: ["/unmute <@utilisateur> <raison>"],
      description: "Permet d'enlever la sanction réduire au silence",
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      options: [
        {
          name: "membre",
          type: ApplicationCommandOptionType.User,
          description: "L'utilisateur à mute",
          required: true
        },
        {
          name: "raison",
          type: ApplicationCommandOptionType.String,
          description: "La raison du mute",
          required: true
        },
      ],
      userPermissions: [PermissionsBitField.Flags.MuteMembers],
      clientPermissions: [PermissionsBitField.Flags.MuteMembers]
    });
  }

  async execute(interaction: CommandInteraction) {
    const membre = interaction.options.getMember("membre") as GuildMember;
    const raison = interaction.options.get("raison", true).value as string;
    const logChannel = this.client.channels.cache.get(config.LOGS_MODERATION) as TextChannel;

    if (!membre.isCommunicationDisabled()) return interaction.reply({ content: "❌ Cet utilisateur n'as pas été réduit au silence!", ephemeral: true });

    membre.timeout(null, raison);
    
    interaction.reply({ content: `L'utilisateur ${membre} a été unmute pour la raison suivante:\n ${raison}`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle(`**UNMUTE** - ${membre.user.username}`)
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      // @ts-expect-error
      .setColor(config.EMBED_COLOR)
      .setDescription(`<@${membre.user.id}> n'est plus réduit au silence
      
      **Raison**
      ${raison}`);

      logChannel.send({ embeds: [embed] });

   
  }
}
