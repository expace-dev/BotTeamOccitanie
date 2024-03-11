"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnmuteCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class UnmuteCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "unmute",
            usage: "/unmute <utilisateur> <raison>",
            examples: ["/unmute <@utilisateur> <raison>"],
            description: "Permet d'enlever la sanction réduire au silence",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "membre",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    description: "L'utilisateur à mute",
                    required: true
                },
                {
                    name: "raison",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "La raison du mute",
                    required: true
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.MuteMembers],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.MuteMembers]
        });
    }
    async execute(interaction) {
        const membre = interaction.options.getMember("membre");
        const raison = interaction.options.get("raison", true).value;
        const logChannel = this.client.channels.cache.get(config_1.default.LOGS_MODERATION);
        if (!membre.isCommunicationDisabled())
            return interaction.reply({ content: "❌ Cet utilisateur n'as pas été réduit au silence!", ephemeral: true });
        membre.timeout(null, raison);
        interaction.reply({ content: `L'utilisateur ${membre} a été unmute pour la raison suivante:\n ${raison}`, ephemeral: true });
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`**UNMUTE** - ${membre.user.username}`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            // @ts-expect-error
            .setColor(config_1.default.EMBED_COLOR)
            .setDescription(`<@${membre.user.id}> n'est plus réduit au silence
      
      **Raison**
      ${raison}`);
        logChannel.send({ embeds: [embed] });
    }
}
exports.UnmuteCommand = UnmuteCommand;
