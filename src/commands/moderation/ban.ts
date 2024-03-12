import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, GuildMember, EmbedBuilder, TextChannel } from "discord.js";
import { db } from "../../utils/databaseConnect";
import config from "../../config";

export class BanCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "ban",
      usage: "/ban <utilisateur>",
      examples: ["/ban <@utilisateur>"],
      description: "La commande ban permet de bloquer un utilisateur, il ne pourras plus revenir à moins de le débloquer",
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      options: [
        {
          name: "membre",
          type: ApplicationCommandOptionType.User,
          description: "L'utilisateur à bloquer",
          required: true
        },
        {
          name: "raison",
          type: ApplicationCommandOptionType.String,
          description: "La raison du bloquage",
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
    const logChannel = this.client.channels.cache.get(config.LOGS_MODERATION) as TextChannel;


    if (!membre.bannable) return interaction.reply({ content: '❌ Je ne peux pas bloquer cet utilisateur!', ephemeral: true });

    if (!membre) return interaction.reply({ content: `❌ L'utilisateur n'as pas été trouvé!`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle(`**BANN** - ${membre.user.username}`)
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp()
      //.setAuthor({ name: `@${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
      .setColor(config.EMBED_COLOR)
      .setDescription(`<@${membre.user.id}> a été bloqué
      
      **Raison**
      ${raison}`);


    await interaction.reply({ content: `L'utilisateur **${membre.displayName}** a été bloqué Pour la raison suivante:\n **${raison}**`, ephemeral: true });

    await membre.ban({reason: raison});

    db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("bann", "${membre.id}", "${raison}", "${date}")`);

    logChannel.send({ embeds: [embed] });

    try {
      membre.send({ content: `Vous avez été bloqué par **${interaction.user.username}** sur le serveur ${interaction.guild?.name} pour la raison suivante: **${raison}**`})
    } catch (error) {
      console.log("Bann: Impossible d'envoyer le message privé");
    }

  }


}
