import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import config from "../../config";

export class HelpCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "help",
      usage: "/help <command (optionnel)>",
      examples: ["/help", "/help <command>"],
      description: "Liste les commandes du bot",
      type: "SLASH_COMMAND",
      category: "utilitaires",
      cooldown: 5,
      channel: "GUILD",
      options: [
        {
          name: "command",
          type: ApplicationCommandOptionType.String,
          description: "Tapez le nom de la commande",
        },
      ],
      userPermissions: [PermissionsBitField.Flags.SendMessages],
      clientPermissions: [PermissionsBitField.Flags.SendMessages]
    });
  }

  async execute(interaction: CommandInteraction) {

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('help-menu')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: "Acceuil",
                    description: "Le menu d'acceuil.",
                    value: "home",
                    default: true,
                    emoji: "🏠"
                },
                {
                    label: "Utilitaire",
                    description: "Les commandes utilitaires disponible.",
                    value: "utils",
                    emoji: "🛠️"
                },
                {
                    label: "Modération",
                    description: "Les commandes de modération disponible.",
                    value: "modo",
                    emoji: "👮‍♂️"
                },
                {
                    label: "Administration",
                    description: "Les commandes administrateur",
                    value: "admin",
                    emoji: "⚙️"
                },
            ])
    );
    
    const cmdName = interaction.options.get("command")?.value as string;

    if (!cmdName) {
        const embed = new EmbedBuilder()
            .setTitle("Commandes disponibles")
            .setDescription(`Si vous souhaitez voir mes différentes commandes, je vous pris d'utiliser le menu déroulant ci-dessous. Les commandes sont rangées par catégories.

            - Utilisez \`aide <commande>\` pour voir les détails d'une commande.

            **Quelques liens utiles :**
            [Les site web de la Team](https://www.team-occitatanie.fr)
            [Le cloud de la Team](https://cloud.team-occitanie.fr)
            `)
            // @ts-expect-error
            .setColor(config.EMBED_COLOR);

        interaction.reply({ embeds: [embed], components: [row], ephemeral:true });
    }
    else {

        const filterCommandsByName = (name: string) => {
            let description = "";
            this.client.collections.commands.forEach((command) => {
              if (command[0].name === cmdName) {
                const argsEmbed = new EmbedBuilder()
                // @ts-expect-error
                .setColor(config.EMBED_COLOR)
                .setTitle(`Aide de la commande \`${command[0].name}\``)
                .setDescription(`${command[0].description}
                
                Utilisation: **\`${command[0].usage}\`**
                Exemples: **\`${command[0].examples}\`**

                Ne pas inclure ces caractères -> <> dans vos commandes.
                `)

            return interaction.reply({ embeds: [argsEmbed], ephemeral: true });
              }
            });
            return description;
          };

          

          const miscCommands = filterCommandsByName(cmdName);

        //const miscCommands = this.client.collections.commands.map(cmd: );
        console.log(miscCommands);
    }


  }
}
