import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, GuildMember, TextChannel, EmbedBuilder } from "discord.js";
import ms from "ms";
import { db } from "../../utils/databaseConnect";
import config from "../../config";

export class MuteCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "mute",
      usage: "/mute <utilisateur> <raison> <durée>",
        examples: ["/mute <@utilisateur> <raison> <durée>"],
      description: "La commande mute permet de réduire un utilisateur au silence",
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
        {
          name: "duree",
          type: ApplicationCommandOptionType.String,
          description: "La durée du mute",
          choices: [
            {
                name: '15 minutes',
                value: '15 minutes'
            },
            {
                name: '30 minutes',
                value: '30 minutes'
            },
            {
                name: '1 heure',
                value: '1 hour'
            },
            {
                name: '3 heures',
                value: '3 hour'
            },
            {
                name: 'Une journée',
                value: '1 days'
            },
            {
                name: 'Une semaine',
                value: '7 days'
            },
          ],
          required: true,
        },
      ],
      userPermissions: [PermissionsBitField.Flags.MuteMembers],
      clientPermissions: [PermissionsBitField.Flags.MuteMembers]
    });
  }

  async execute(interaction: CommandInteraction) {
    const membre = interaction.options.getMember("membre") as GuildMember;
    const raison = interaction.options.get("raison", true).value as string;
    const duree = interaction.options.get("duree", true).value as string;
    const convertedTime = ms(duree);
    const logChannel = this.client.channels.cache.get(config.LOGS_MODERATION) as TextChannel;
    
    if (!membre.moderatable) return interaction.reply({ content: `❌ Je ne peut pas mute ce membre!`, ephemeral: true });

    if (!convertedTime) return interaction.reply({ content: `❌ Spécifier une durée valide!`, ephemeral: true });

    membre.timeout(convertedTime, raison);

    const date = Date.now();

    db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("mute", "${membre.id}", "${raison}", "${date}")`);

    interaction.reply({ content: `L'utilisateur ${membre} a été mute pour une durée de ${duree} pour la raison suivante:\n ${raison}`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle(`**MUTE** - ${membre.user.username}`)
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      .setColor(config.EMBED_COLOR)
      .setDescription(`<@${membre.user.id}> a été réduit au silence pour une durée de ${duree}
      
      **Raison**
      ${raison}`);

      logChannel.send({ embeds: [embed] });

   
  }
}
