import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, EmbedBuilder } from "discord.js";
import config from "../../config";

export class NoaideCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "noaide",
      usage: "/noaide <salon>",
      examples: ["/noaide  <#salon>"],
      description: "Envoie un message précisant que le salon n'est pas destiné à demandé de l'aide",
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      userPermissions: [PermissionsBitField.Flags.ManageMessages],
      clientPermissions: [PermissionsBitField.Flags.ManageMessages]
    });
  }

  async execute(interaction: CommandInteraction) {
    
    const embed = new EmbedBuilder()
        .setDescription(`
            Attention, le salon <#${interaction.channelId}> n'est PAS destiné à poser des questions d'aide, merci de choisir le bon salon !!
            `)
            .setColor(config.EMBED_COLOR)
            .setThumbnail("https://www.team-occitanie.fr/images/discord/interdit.png");

    interaction.reply({ embeds: [embed] });

  }
}
