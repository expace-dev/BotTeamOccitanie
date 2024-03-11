"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanctionsCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const databaseConnect_1 = require("../../utils/databaseConnect");
const config_1 = __importDefault(require("../../config"));
class SanctionsCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "sanctions",
            usage: "/sanctions <utilisateur>",
            examples: ["/sanctions <@utilisateur>"],
            description: "Permet de lister les sanctions d'un utilisateur",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "membre",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    description: "Quel est l'utilisateur ?",
                    required: true
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.BanMembers],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.BanMembers]
        });
    }
    async execute(interaction) {
        const membre = interaction.options.getMember("membre");
        databaseConnect_1.db.query(`SELECT COUNT(*) AS sanctions FROM sanctions WHERE utilisateur=${membre.id}`, async (error, results, fields) => {
            const nbre = results[0].sanctions;
            databaseConnect_1.db.query(`SELECT type, raison, date FROM sanctions WHERE utilisateur=${membre.id}`, async (error, donnees, fields) => {
                let raisons = "";
                donnees.forEach((donnee) => {
                    const date = (donnee.date / 1000);
                    raisons += `**${donnee.type}**\n${donnee.raison}\nLe: <t:${parseInt(date.toString())}:f>\n\n`;
                });
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle("Sanctions")
                    // @ts-expect-error
                    .setColor(config_1.default.EMBED_COLOR)
                    .setDescription(`l'utilisateur ${membre} a été sanctionné ${nbre} fois pour le(s) raison(s): \n\n${raisons}`)
                    .setFooter({ text: `Demandé par ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            });
        });
    }
}
exports.SanctionsCommand = SanctionsCommand;
