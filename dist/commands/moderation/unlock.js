"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnlockCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class UnlockCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "unlock",
            description: "Déverouille le salon ou la commande est tapée",
            usage: "/unlock>",
            examples: ["/unlock"],
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "raison",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "La raison du unmute",
                    required: true
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.ManageChannels],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.ManageChannels]
        });
    }
    async execute(interaction) {
        await interaction.guild?.channels.edit(interaction.channelId, {
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    allow: [
                        discord_js_1.PermissionFlagsBits.SendMessages
                    ]
                }
            ]
        });
        await interaction.reply({ content: `Le salon est bien déverrouillé`, ephemeral: true });
        const logChannel = this.client.channels.cache.get(config_1.default.LOGS_MODERATION);
        const raison = interaction.options.get("raison", true).value;
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`**UNLOCK**`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            // @ts-expect-error
            .setColor(config_1.default.EMBED_COLOR)
            .setDescription(`Le salon <#${interaction.channelId}> a été déverrouillé
      
      **Raison**
      ${raison}`);
        logChannel.send({ embeds: [embed] });
    }
}
exports.UnlockCommand = UnlockCommand;
