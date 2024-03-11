"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class HelpCommand extends sheweny_1.Command {
    constructor(client) {
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
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "Tapez le nom de la commande",
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.SendMessages],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.SendMessages]
        });
    }
    async execute(interaction) {
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
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
        ]));
        const cmdName = interaction.options.get("command")?.value;
        if (!cmdName) {
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle("Commandes disponibles")
                .setDescription(`Si vous souhaitez voir mes différentes commandes, je vous pris d'utiliser le menu déroulant ci-dessous. Les commandes sont rangées par catégories.

            - Utilisez \`aide <commande>\` pour voir les détails d'une commande.

            **Quelques liens utiles :**
            [Les site web de la Team](https://www.team-occitatanie.fr)
            [Le cloud de la Team](https://cloud.team-occitanie.fr)
            `)
                // @ts-expect-error
                .setColor(config_1.default.EMBED_COLOR);
            interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
        }
        else {
            const filterCommandsByName = (name) => {
                let description = "";
                this.client.collections.commands.forEach((command) => {
                    if (command[0].name === cmdName) {
                        const argsEmbed = new discord_js_1.EmbedBuilder()
                            // @ts-expect-error
                            .setColor(config_1.default.EMBED_COLOR)
                            .setTitle(`Aide de la commande \`${command[0].name}\``)
                            .setDescription(`${command[0].description}
                
                Utilisation: **\`${command[0].usage}\`**
                Exemples: **\`${command[0].examples}\`**

                Ne pas inclure ces caractères -> <> dans vos commandes.
                `);
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
exports.HelpCommand = HelpCommand;
