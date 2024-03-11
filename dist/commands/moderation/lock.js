"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class LockCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "lock",
            description: "La commande lock verouille le salon ou la commande est exécuté",
            usage: "/lock>",
            examples: ["/lock"],
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            userPermissions: [discord_js_1.PermissionsBitField.Flags.ManageChannels],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.ManageChannels]
        });
    }
    async execute(interaction) {
        await interaction.guild?.channels.edit(interaction.channelId, {
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [
                        discord_js_1.PermissionFlagsBits.SendMessages
                    ]
                }
            ]
        });
        await interaction.reply({ content: `Le salon est bien verrouillé`, ephemeral: true });
        const logChannel = this.client.channels.cache.get(config_1.default.LOGS_MODERATION);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`**LOCK**`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            //.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            // @ts-expect-error
            .setColor(config_1.default.EMBED_COLOR)
            .setDescription(`Le salon <#${interaction.channelId}> a été verrouyé`);
        logChannel.send({ embeds: [embed] });
    }
}
exports.LockCommand = LockCommand;
