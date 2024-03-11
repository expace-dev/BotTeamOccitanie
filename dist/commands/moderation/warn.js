"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarnCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const databaseConnect_1 = require("../../utils/databaseConnect");
const ms_1 = __importDefault(require("ms"));
const config_1 = __importDefault(require("../../config"));
class WarnCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "warn",
            usage: "/warn <utilisateur>",
            examples: ["/warn <@utilisateur>"],
            description: "Permet d'avertir un utilisateur",
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
        const date = Date.now();
        const convertedTime = (0, ms_1.default)('1 hour');
        const logChannel = this.client.channels.cache.get('1094612818176778291');
        let action = "";
        if (!membre.moderatable)
            return interaction.reply({ content: '❌ Je ne peux pas avertir cet utilisateur!', ephemeral: true });
        if (!membre)
            return interaction.reply({ content: `❌ L'utilisateur n'as pas été trouvé!`, ephemeral: true });
        if (membre === interaction.member)
            return interaction.reply({ content: `❌ Vous ne pouvez pas vous avertir!`, ephemeral: true });
        databaseConnect_1.db.query(`SELECT COUNT(*) AS warnings FROM sanctions WHERE utilisateur=${membre.id}`, async (error, results, fields) => {
            const warnings = results[0].warnings;
            if (warnings < 2) {
                databaseConnect_1.db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("warnings", "${membre.id}", "${raison}", "${date}")`);
                interaction.reply({ content: `Je viens de donner un avertissement à l'utilisateur ${membre} pour la raison suivante:\n ${raison}`, ephemeral: true });
                action = "Avertissement";
            }
            else if (warnings < 4) {
                membre.timeout(convertedTime, raison);
                databaseConnect_1.db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("warnings", "${membre.id}", "${raison}", "${date}")`);
                databaseConnect_1.db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("mute", "${membre.id}", "${raison}", "${date}")`);
                interaction.reply({ content: `Suite à plusieurs avertissements j'ai réduit au silence l'utilisateur ${membre} pour la raison suivante: **${raison}**`, ephemeral: true });
                action = "Mute";
            }
            else {
                interaction.guild?.bans.create(membre.id, { reason: raison });
                databaseConnect_1.db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("warnings", "${membre.id}", "${raison}", "${date}")`);
                databaseConnect_1.db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("bann", "${membre.id}", "${raison}", "${date}")`);
                interaction.reply({ content: `Suite à plusieurs avertissements j'ai bloqué l'utilisateur ${membre} pour la raison suivante: **${raison}**`, ephemeral: true });
                try {
                    membre.send({ content: `Vous avez été bloqué par **${interaction.user.username}** sur le serveur ${interaction.guild?.name} pour la raison suivante: **${raison}**` });
                }
                catch (err) {
                    console.log("Bann: Impossible d'envoyer le message privé");
                }
                action = "Ban";
            }
            const embed = new discord_js_1.EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                // @ts-expect-error
                .setColor(config_1.default.EMBED_COLOR)
                .setDescription(`**Membre**: ${membre.user.tag} (${membre.id})
            **Action**: ${action}
            **Raison**: ${raison}`);
            logChannel.send({ embeds: [embed] });
        });
    }
}
exports.WarnCommand = WarnCommand;
