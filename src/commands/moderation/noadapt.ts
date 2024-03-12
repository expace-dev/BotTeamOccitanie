import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import config from "../../config";

export class NoadaptCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "noadapt",
      usage: "/noadapt <salon>",
      examples: ["/noadapt <#salon>"],
      description: "Permet de dire à un utilisateur qu'il n'est pas dans le bon salon",
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      options: [
        {
          name: "salon",
          type: ApplicationCommandOptionType.Channel,
          description: "Préciser le salon ou poster",
          required: true
        },
      ],
      userPermissions: [PermissionsBitField.Flags.ManageMessages],
      clientPermissions: [PermissionsBitField.Flags.ManageMessages]
    });
  }

  async execute(interaction: CommandInteraction) {
    //const salons = interaction.options.getMember("membre") as GuildMember;
    //const raison = interaction.options.get("raison", true)?.value as string;

    const salon = interaction.options.get("salon");

    const embed = new EmbedBuilder()
            .setDescription(`
            Cette discussion serait plus adaptée dans le salon ${salon?.channel}
            `)
            .setColor(config.EMBED_COLOR)
            .setThumbnail("https://www.team-occitanie.fr/images/discord/help.png");

            interaction.reply({ embeds: [embed] });

  }
}
