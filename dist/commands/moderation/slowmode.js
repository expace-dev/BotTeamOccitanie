"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlowmodeCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
class SlowmodeCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "slowmode",
            description: "Modifie le rate limite par utilisateur",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "valeur",
                    description: "Choisir la valeur pour le slowmode",
                    type: discord_js_1.ApplicationCommandOptionType.Number,
                    required: true
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.ManageChannels],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.ManageChannels]
        });
    }
    async execute(interaction) {
        const valeur = interaction.options.get("valeur", true).value;
        if (valeur === 0) {
            await interaction.guild?.channels.edit(interaction.channelId, {
                rateLimitPerUser: 0
            });
            return interaction.reply({ content: `Le slowmode est désactivé`, ephemeral: true });
        }
        else {
            await interaction.guild?.channels.edit(interaction.channelId, {
                rateLimitPerUser: valeur
            });
            return interaction.reply({ content: `Le slowmode est activé (${valeur} secondes)`, ephemeral: true });
        }
    }
}
exports.SlowmodeCommand = SlowmodeCommand;
