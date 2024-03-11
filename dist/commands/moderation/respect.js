"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RespectCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class RespectCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "respect",
            usage: "/respect <utilisateur>",
            examples: ["/respect <@utilisateur>"],
            description: "Permet de notifier un utilisateur pour manque de respect",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            userPermissions: [discord_js_1.PermissionsBitField.Flags.ManageMessages],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.ManageMessages],
            options: [
                {
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    name: "membre",
                    description: "Le membre à notifier",
                    required: true
                }
            ],
        });
    }
    async execute(interaction) {
        const membre = interaction.options.getMember("membre");
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('Manque de respect !!')
            .setDescription(`
        Merci de respecter notre règlement et les membres de la communauté, bonjour et merci sont un minimum !!! 😒
        `)
            // @ts-expect-error
            .setColor(config_1.default.EMBED_COLOR)
            .setThumbnail("https://www.team-occitanie.fr/images/discord/interdit.png");
        interaction.reply({ content: `${membre}`, embeds: [embed] });
    }
}
exports.RespectCommand = RespectCommand;
