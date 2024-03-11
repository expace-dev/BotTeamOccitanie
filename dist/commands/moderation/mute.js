"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuteCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const databaseConnect_1 = require("../../utils/databaseConnect");
const config_1 = __importDefault(require("../../config"));
class MuteCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "mute",
            usage: "/mute <utilisateur> <raison> <durée>",
            examples: ["/mute <@utilisateur> <raison> <durée>"],
            description: "La commande mute permet de réduire un utilisateur au silence",
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
                {
                    name: "duree",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "La durée du mute",
                    choices: [
                        {
                            name: '15 minutes',
                            value: '15 minutes'
                        },
                        {
                            name: '30 minutes',
                            value: '30 minutes'
                        },
                        {
                            name: '1 heure',
                            value: '1 hour'
                        },
                        {
                            name: '3 heures',
                            value: '3 hour'
                        },
                        {
                            name: 'Une journée',
                            value: '1 days'
                        },
                        {
                            name: 'Une semaine',
                            value: '7 days'
                        },
                    ],
                    required: true,
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.MuteMembers],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.MuteMembers]
        });
    }
    async execute(interaction) {
        const membre = interaction.options.getMember("membre");
        const raison = interaction.options.get("raison", true).value;
        const duree = interaction.options.get("duree", true).value;
        const convertedTime = (0, ms_1.default)(duree);
        const logChannel = this.client.channels.cache.get(config_1.default.LOGS_MODERATION);
        if (!membre.moderatable)
            return interaction.reply({ content: `❌ Je ne peut pas mute ce membre!`, ephemeral: true });
        if (!convertedTime)
            return interaction.reply({ content: `❌ Spécifier une durée valide!`, ephemeral: true });
        membre.timeout(convertedTime, raison);
        const date = Date.now();
        databaseConnect_1.db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("mute", "${membre.id}", "${raison}", "${date}")`);
        interaction.reply({ content: `L'utilisateur ${membre} a été mute pour une durée de ${duree} pour la raison suivante:\n ${raison}`, ephemeral: true });
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`**MUTE** - ${membre.user.username}`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            // @ts-expect-error
            .setColor(config_1.default.EMBED_COLOR)
            .setDescription(`<@${membre.user.id}> a été réduit au silence pour une durée de ${duree}
      
      **Raison**
      ${raison}`);
        logChannel.send({ embeds: [embed] });
    }
}
exports.MuteCommand = MuteCommand;
