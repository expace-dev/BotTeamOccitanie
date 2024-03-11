"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoftbanCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
class SoftbanCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "softban",
            description: "softban un utilisateur",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "membre",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    description: "L'utilisateur pour lequel supprimer les messages",
                    required: true
                },
                {
                    name: "raison",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "Veuillez préciser la raison",
                    required: true
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.BanMembers],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.BanMembers]
        });
    }
    async execute(interaction) {
        const membre = interaction.options.getMember("membre");
        const raison = interaction.options.get("raison", false)?.value;
        await interaction.reply({ content: `les messages de **${membre.displayName}** ont été supprimé Pour la raison suivante:\n **${raison}**`, ephemeral: true });
        await membre.ban({ reason: raison });
        await interaction.guild?.members.unban(membre.user.id);
    }
}
exports.SoftbanCommand = SoftbanCommand;
