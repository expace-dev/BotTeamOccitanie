import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, GuildMember, EmbedBuilder, TextChannel } from "discord.js";
import { db } from "../../utils/databaseConnect";
import config from "../../config";

export class UnwarnCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "unwarn",
      usage: "/unwarn <utilisateur> <raison>",
      examples: ["/unwarn <@utilisateur> <raison>"],
      description: "Permet de supprimer les avertissements d'un utilisateur",
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      options: [
        {
          name: "membre",
          type: ApplicationCommandOptionType.User,
          description: "Le membre à avertir",
          required: true
        },
        {
          name: "raison",
          type: ApplicationCommandOptionType.String,
          description: "La raison de l'avertissement",
          required: true
        },
      ],
      userPermissions: [PermissionsBitField.Flags.BanMembers],
      clientPermissions: [PermissionsBitField.Flags.BanMembers]
    });
  }

  async execute(interaction: CommandInteraction) {
    
    const membre = interaction.options.getMember("membre") as GuildMember;
    const raison = interaction.options.get("raison", false)?.value as string;
    const logChannel = this.client.channels.cache.get(config.LOGS_MODERATION) as TextChannel;


        db.query(`SELECT COUNT(*) AS warnings FROM sanctions WHERE utilisateur=${membre.id}`, async (error, results, fields) => {
        const warnings = results[0].warnings;

        if (warnings === 0) {
            return interaction.reply({ content: `❌ L'utilisateur ${membre} n'as aucun avertissement !!`, ephemeral: true });
        }
        else {
            db.query(`DELETE FROM sanctions WHERE utilisateur="${membre.id}" AND type="warnings"`);

            interaction.reply({ content: `Je viens de supprimer les avertissements de l'utilisateur ${membre}`, ephemeral:true });

            const embed = new EmbedBuilder()
      .setTitle(`**UNWARN** - ${membre.user.username}`)
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      .setColor(config.EMBED_COLOR)
      .setDescription(`Les avertissements de <@${membre.user.id}> ont été supprimé
      
      **Raison**
      ${raison}`);

            logChannel.send({ embeds: [embed] });
        }

        
    });
  }
}
