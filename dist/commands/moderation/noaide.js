"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoaideCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class NoaideCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "noaide",
            usage: "/noaide <salon>",
            examples: ["/noaide  <#salon>"],
            description: "Envoie un message précisant que le salon n'est pas destiné à demandé de l'aide",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            userPermissions: [discord_js_1.PermissionsBitField.Flags.ManageMessages],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.ManageMessages]
        });
    }
    async execute(interaction) {
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription(`
            Attention, le salon <#${interaction.channelId}> n'est PAS destiné à poser des questions d'aide, merci de choisir le bon salon !!
            `)
            // @ts-expect-error
            .setColor(config_1.default.EMBED_COLOR)
            .setThumbnail("https://www.team-occitanie.fr/images/discord/interdit.png");
        interaction.reply({ embeds: [embed] });
    }
}
exports.NoaideCommand = NoaideCommand;
