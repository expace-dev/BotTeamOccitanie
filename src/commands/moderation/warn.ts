import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, GuildMember, EmbedBuilder, TextChannel } from "discord.js";
import { db } from "../../utils/databaseConnect";
import ms from "ms";
import config from "../../config";

export class WarnCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "warn",
      usage: "/warn <utilisateur>",
      examples: ["/warn <@utilisateur>"],
      description: "Permet d'avertir un utilisateur",
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
    const date = Date.now();
    const convertedTime = ms('1 hour');
    const logChannel = this.client.channels.cache.get('1094612818176778291') as TextChannel;
    let action ="";


    if (!membre.moderatable) return interaction.reply({ content: '❌ Je ne peux pas avertir cet utilisateur!', ephemeral: true });

    if (!membre) return interaction.reply({ content: `❌ L'utilisateur n'as pas été trouvé!`, ephemeral: true });

    if (membre === interaction.member) return interaction.reply({ content: `❌ Vous ne pouvez pas vous avertir!`, ephemeral: true });

    db.query(`SELECT COUNT(*) AS warnings FROM sanctions WHERE utilisateur=${membre.id}`, async (error, results, fields) => {
        const warnings = results[0].warnings;

        if (warnings < 2) {
            db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("warnings", "${membre.id}", "${raison}", "${date}")`);

            interaction.reply({ content: `Je viens de donner un avertissement à l'utilisateur ${membre} pour la raison suivante:\n ${raison}`, ephemeral: true });

            action = "Avertissement";


        }
        else if (warnings < 4) {
            membre.timeout(convertedTime, raison);

            db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("warnings", "${membre.id}", "${raison}", "${date}")`);

            db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("mute", "${membre.id}", "${raison}", "${date}")`);

            interaction.reply({ content: `Suite à plusieurs avertissements j'ai réduit au silence l'utilisateur ${membre} pour la raison suivante: **${raison}**`, ephemeral: true });

            action = "Mute";
        }
        else {
            interaction.guild?.bans.create(membre.id, {reason: raison});

            db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("warnings", "${membre.id}", "${raison}", "${date}")`);

            db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("bann", "${membre.id}", "${raison}", "${date}")`);

            interaction.reply({ content: `Suite à plusieurs avertissements j'ai bloqué l'utilisateur ${membre} pour la raison suivante: **${raison}**`, ephemeral: true });

            try {
                membre.send({ content: `Vous avez été bloqué par **${interaction.user.username}** sur le serveur ${interaction.guild?.name} pour la raison suivante: **${raison}**`});
            } catch (err) {
                console.log("Bann: Impossible d'envoyer le message privé");
            }

            action = "Ban"
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setColor(config.EMBED_COLOR)
            .setDescription(`**Membre**: ${membre.user.tag} (${membre.id})
            **Action**: ${action}
            **Raison**: ${raison}`);

        logChannel.send({ embeds: [embed] });
    });
  }
}
