import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, EmbedBuilder, ApplicationCommandOptionType, GuildMember } from "discord.js";
import config from "../../config";

export class RespectCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "respect",
      usage: "/respect <utilisateur>",
      examples: ["/respect <@utilisateur>"],
      description: "Permet de notifier un utilisateur pour manque de respect",
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      userPermissions: [PermissionsBitField.Flags.ManageMessages],
      clientPermissions: [PermissionsBitField.Flags.ManageMessages],
      options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "Le membre à notifier",
            required: true
        }
      ],
    });
  }

  async execute(interaction: CommandInteraction) {
    
    const membre = interaction.options.getMember("membre") as GuildMember;
    
    const embed = new EmbedBuilder()
        .setTitle('Manque de respect !!')
        .setDescription(`
        Merci de respecter notre règlement et les membres de la communauté, bonjour et merci sont un minimum !!! 😒
        `)
        // @ts-expect-error
        .setColor(config.EMBED_COLOR)
        .setThumbnail("https://www.team-occitanie.fr/images/discord/interdit.png");

        interaction.reply({ content: `${membre}`, embeds: [embed] });

  }
}
