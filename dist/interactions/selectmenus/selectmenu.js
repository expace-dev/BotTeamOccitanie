"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectComponent = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class SelectComponent extends sheweny_1.SelectMenu {
    constructor(client) {
        super(client, ["help-menu"]);
    }
    async execute(selectMenu) {
        const selectHome = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
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
        const selectUtils = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('help-menu')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
            {
                label: "Acceuil",
                description: "Le menu d'acceuil.",
                value: "home",
                emoji: "🏠"
            },
            {
                label: "Utilitaire",
                description: "Les commandes utilitaires disponible.",
                value: "utils",
                default: true,
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
        const selectModo = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('help-menu')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
            {
                label: "Acceuil",
                description: "Le menu d'acceuil.",
                value: "home",
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
                default: true,
                emoji: "👮‍♂️"
            },
            {
                label: "Administration",
                description: "Les commandes administrateur",
                value: "admin",
                emoji: "⚙️"
            },
        ]));
        const selectAdmin = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('help-menu')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
            {
                label: "Acceuil",
                description: "Le menu d'acceuil.",
                value: "home",
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
                default: true,
                emoji: "⚙️"
            },
        ]));
        const filterCommandsByCategory = (category) => {
            let description = "";
            this.client.collections.commands.forEach((command) => {
                if (command[0].category === category) {
                    description += `/**${command[0].name}** - ${command[0].description}\n`;
                }
            });
            return description;
        };
        switch (selectMenu.values[0]) {
            case "home":
                const embedHome = new discord_js_1.EmbedBuilder()
                    .setTitle("Commandes disponibles")
                    .setDescription(`Si vous souhaitez voir mes différentes commandes, je vous pris d'utiliser le menu déroulant ci-dessous. Les commandes sont rangées par catégories.

            - Utilisez \`aide <commande>\` pour voir les détails d'une commande.

            **Quelques liens utiles :**
            [Notre site web](https://www.google.fr)
            [Page Facebook](https://www.google.fr)
            [Page Tweeter](https://www.google.fr)
            [Page Linkedin](https://www.google.fr)
            `)
                    // @ts-expect-error
                    .setColor(config_1.default.EMBED_COLOR);
                selectMenu.update({ embeds: [embedHome], components: [selectHome] });
                break;
            case "utils":
                const utilitaires = filterCommandsByCategory("utilitaires");
                const embedUtils = new discord_js_1.EmbedBuilder()
                    .setTitle("Utilitaires - Commandes utiles")
                    .setDescription(utilitaires)
                    // @ts-expect-error
                    .setColor(config_1.default.EMBED_COLOR);
                selectMenu.update({ embeds: [embedUtils], components: [selectUtils] });
                break;
            case "modo":
                const moderation = filterCommandsByCategory("moderation");
                const embedModo = new discord_js_1.EmbedBuilder()
                    .setTitle("Utilitaires - Commandes utiles")
                    .setDescription(moderation)
                    // @ts-expect-error
                    .setColor(config_1.default.EMBED_COLOR);
                selectMenu.update({ embeds: [embedModo], components: [selectModo] });
                break;
            case "admin":
                const administration = filterCommandsByCategory("administration");
                const embedAdmin = new discord_js_1.EmbedBuilder()
                    .setTitle("Utilitaires - Commandes utiles")
                    .setDescription(administration)
                    // @ts-expect-error
                    .setColor(config_1.default.EMBED_COLOR);
                selectMenu.update({ embeds: [embedAdmin], components: [selectAdmin] });
                break;
            /*
            case "utils":
      
            const miscCommands = this.client.collections.commands
                ?.filter((cmd: any) => cmd.category === 'moderation')
                ?.map((cmd: any) => `${cmd.name} - ${cmd.description}`)
                ?.join('\n');
            
              
              console.log(miscCommands);
      
              const embed = new EmbedBuilder().setTitle('Misc commands').setDescription(miscCommands);
      
            selectMenu.update({ embeds: [embed] });
      
              break;
            
            
              case "home":
              await selectMenu.reply({ content: "You have choose **second** option !" });
              break;
            */
        }
    }
}
exports.SelectComponent = SelectComponent;
;
