"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoadaptCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class NoadaptCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "noadapt",
            usage: "/noadapt <salon>",
            examples: ["/noadapt <#salon>"],
            description: "Permet de dire à un utilisateur qu'il n'est pas dans le bon salon",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "salon",
                    type: discord_js_1.ApplicationCommandOptionType.Channel,
                    description: "Préciser le salon ou poster",
                    required: true
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.ManageMessages],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.ManageMessages]
        });
    }
    async execute(interaction) {
        //const salons = interaction.options.getMember("membre") as GuildMember;
        //const raison = interaction.options.get("raison", true)?.value as string;
        const salon = interaction.options.get("salon");
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription(`
            Cette discussion serait plus adaptée dans le salon ${salon?.channel}
            `)
            // @ts-expect-error
            .setColor(config_1.default.EMBED_COLOR)
            .setThumbnail("https://www.team-occitanie.fr/images/discord/help.png");
        interaction.reply({ embeds: [embed] });
    }
}
exports.NoadaptCommand = NoadaptCommand;
