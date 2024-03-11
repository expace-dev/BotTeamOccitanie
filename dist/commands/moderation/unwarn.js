"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnwarnCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const databaseConnect_1 = require("../../utils/databaseConnect");
const config_1 = __importDefault(require("../../config"));
class UnwarnCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "unwarn",
            usage: "/unwarn <utilisateur> <raison>",
            examples: ["/unwarn <@utilisateur> <raison>"],
            description: "Permet de supprimer les avertissements d'un utilisateur",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "membre",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    description: "Le membre à avertir",
                    required: true
                },
                {
                    name: "raison",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "La raison de l'avertissement",
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
        const logChannel = this.client.channels.cache.get(config_1.default.LOGS_MODERATION);
        databaseConnect_1.db.query(`SELECT COUNT(*) AS warnings FROM sanctions WHERE utilisateur=${membre.id}`, async (error, results, fields) => {
            const warnings = results[0].warnings;
            if (warnings === 0) {
                return interaction.reply({ content: `❌ L'utilisateur ${membre} n'as aucun avertissement !!`, ephemeral: true });
            }
            else {
                databaseConnect_1.db.query(`DELETE FROM sanctions WHERE utilisateur="${membre.id}" AND type="warnings"`);
                interaction.reply({ content: `Je viens de supprimer les avertissements de l'utilisateur ${membre}`, ephemeral: true });
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`**UNWARN** - ${membre.user.username}`)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp()
                    // @ts-expect-error
                    .setColor(config_1.default.EMBED_COLOR)
                    .setDescription(`Les avertissements de <@${membre.user.id}> ont été supprimé
      
      **Raison**
      ${raison}`);
                logChannel.send({ embeds: [embed] });
            }
        });
    }
}
exports.UnwarnCommand = UnwarnCommand;
