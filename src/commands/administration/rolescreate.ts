import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import config from "../../config";

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
      clientPermissions: [PermissionsBitField.Flags.Administrator],
    });
  }

  async execute(interaction: CommandInteraction) {
        
        const embed = new EmbedBuilder()
            .setTitle('Choix des roles')
            // @ts-expect-error
            .setColor(config.EMBED_COLOR)
            .setDescription(`
                Maintenant que vous avez accepté le <#963041730066804786> choisissez le ou les roles qui vous correspondent

                👨‍🦰  Si tu est un homme
                
                👩‍🦰  Si tu est une femme
                
                🚚  Si tu est un chauffeur
                
                🚜  Si tu est un agriculteur
            `)

            interaction.channel?.send({ embeds: [embed] }).then(async msg => {
              await msg.react('👨‍🦰');
              await msg.react('👩‍🦰');
              await msg.react('🚚');
              await msg.react('🚜');
            });

            interaction.reply({ content: 'Les roles réactions ont bien été activé', ephemeral: true });

  }
}