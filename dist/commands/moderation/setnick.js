"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetnickCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
class SetnickCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "setnick",
            description: "Permet de modifier le nom d'un utilisateur",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "membre",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    description: "L'utilisateur sur lequel il faut changer le nom",
                    required: true
                },
                {
                    name: "nickname",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "Le nouveau nom de l'utilisateur",
                    required: true
                },
                {
                    name: "raison",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "La raison deu changement de nom",
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.ManageNicknames],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.ManageNicknames]
        });
    }
    async execute(interaction) {
        const membre = interaction.options.getMember("membre");
        const nickname = interaction.options.get("nickname", true).value;
        const raison = interaction.options.get("raison", false)?.value || "Aucune raison indiquée";
        await interaction.reply({ content: `Le pseudonyme de ${membre.displayName} a été changé en ${nickname}\n Pour la raison suivante: ${raison}`, ephemeral: true });
        await membre.setNickname(nickname, raison);
    }
}
exports.SetnickCommand = SetnickCommand;
