import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, EmbedBuilder, TextChannel } from "discord.js";
import config from "../../config";

export class UnbanCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "unban",
      usage: "/unban <utilisateur> <raison>",
      examples: ["/unban <@utilisateur> <raison>"],
      description: "Permet de débloquer un utilisateur",
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      options: [
        {
          name: "membre",
          type: ApplicationCommandOptionType.String,
          description: "L'id du membre à débloquer",
          required: true
        },
        {
          name: "raison",
          type: ApplicationCommandOptionType.String,
          description: "La raison du débloquage",
          required: true
        },
      ],
      userPermissions: [PermissionsBitField.Flags.BanMembers],
      clientPermissions: [PermissionsBitField.Flags.BanMembers]
    });
  }

    async execute(interaction: CommandInteraction) {
    
        const membre = interaction.options.get("membre, true")?.value as string;
        const raison = interaction.options.get("raison", false)?.value as string;
        const logChannel = this.client.channels.cache.get(config.LOGS_MODERATION) as TextChannel;

        interaction.guild?.bans.fetch(membre).then((membre) => {
            
            interaction.guild?.members.unban(membre.user.id).then(() => {
                
                interaction.reply({ content: `L'utilisateur' **${membre.user.username}** a été débloqué Pour la raison suivante:\n **${raison}**`, ephemeral: true });

                const embed = new EmbedBuilder()
      .setTitle(`**UNBAN** - ${membre.user.username}`)
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      // @ts-expect-error
      .setColor(config.EMBED_COLOR)
      .setDescription(`<@${membre.user.id}> a été débloqué
      
      **Raison**
      ${raison}`);

                logChannel.send({ embeds: [embed] });

                try {
                    membre.user.send({ content: `Vous avez été débloqué par **${interaction.user.username}** sur le serveur ${interaction.guild?.name} pour la raison suivante: **${raison}**`})
                } catch (error) {
                    console.log("Bann: Impossible d'envoyer le message privé");
                }

            });
        }).catch(() => {
            console.log("Ce membre n'est pas bloqué");
            interaction.reply({ content: "❌ Ce membre n'est pas bloqué!", ephemeral: true });
        });
    }

}
