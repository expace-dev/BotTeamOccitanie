import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, GuildMember, EmbedBuilder, TextChannel } from "discord.js";
import { db } from "../../utils/databaseConnect";
import config from "../../config";

export class KickCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "kick",
      usage: "/kick <utilisateur>",
      examples: ["/kick <@utilisateur>"],
      description: "La commande kick permet d'expulser un utilisateur, celui-ci pourras à tout moment revenir",
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      options: [
        {
          name: "membre",
          type: ApplicationCommandOptionType.User,
          description: "L'utilisateur que l'on souhaite expulser",
          required: true
        },
        {
          name: "raison",
          type: ApplicationCommandOptionType.String,
          description: "La raison de l'expulsion",
          required: true
        },
      ],
      userPermissions: [PermissionsBitField.Flags.KickMembers],
      clientPermissions: [PermissionsBitField.Flags.KickMembers]
    });
  }

  async execute(interaction: CommandInteraction) {
    const membre = interaction.options.getMember("membre") as GuildMember;
    const raison = interaction.options.get("raison", true)?.value as string;
    const date = Date.now();
    const logChannel = this.client.channels.cache.get(config.LOGS_MODERATION) as TextChannel;

    if (!membre.kickable) return interaction.reply({ content: `❌ Je ne peux pas expulser se membre!` });

    if (!membre) return interaction.reply({ content: `❌ L'utilisateur n'as pas été trouvé!`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle(`**KICK** - ${membre.user.username}`)
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      // @ts-expect-error
      .setColor(config.EMBED_COLOR)
      .setDescription(`<@${membre.user.id}> a été expulsé
      
      **Raison**
      ${raison}`);

    await interaction.reply({ content: `L'utilisateur' **${membre.displayName}** a été expulsé Pour la raison suivante:\n ${raison}`, ephemeral: true });

    db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("kick", "${membre.id}", "${raison}", "${date}")`);

    //await membre.kick(raison);

    logChannel.send({ embeds: [embed] });

    try {
      membre.send({ content: `Vous avez été bloqué par **${interaction.user.username}** sur le serveur ${interaction.guild?.name} pour la raison suivante: **${raison}**`})
    } catch (error) {
      console.log("Bann: Impossible d'envoyer le message privé");
    }
  }
}
