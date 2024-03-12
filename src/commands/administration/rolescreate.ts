import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";

export class RoleCreateCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "role",
      usage: "/role",
      examples: ["/role"],
      description: "La commande role met en place les roles/réaction",
      type: "SLASH_COMMAND",
      category: "utilitaires",
      cooldown: 5,
      userPermissions: [PermissionsBitField.Flags.Administrator],
    });
  }

  async execute(interaction: CommandInteraction) {
        
        const embed = new EmbedBuilder()
            .setTitle('Choix des roles')
            .setDescription(`
                Maintenant que vous avez accepté le <#963041730066804786> choisissez le/les roles qui vous correspondent
            `)
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })

            interaction.channel?.send({ embeds: [embed] });

  }
}