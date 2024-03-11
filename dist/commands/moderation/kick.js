"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KickCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const databaseConnect_1 = require("../../utils/databaseConnect");
const config_1 = __importDefault(require("../../config"));
class KickCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "kick",
            usage: "/kick <utilisateur>",
            examples: ["/kick <@utilisateur>"],
            description: "La commande kick permet d'expulser un utilisateur, celui-ci pourras à tout moment revenir",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "membre",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    description: "L'utilisateur que l'on souhaite expulser",
                    required: true
                },
                {
                    name: "raison",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "La raison de l'expulsion",
                    required: true
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.KickMembers],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.KickMembers]
        });
    }
    async execute(interaction) {
        const membre = interaction.options.getMember("membre");
        const raison = interaction.options.get("raison", true)?.value;
        const date = Date.now();
        const logChannel = this.client.channels.cache.get(config_1.default.LOGS_MODERATION);
        if (!membre.kickable)
            return interaction.reply({ content: `❌ Je ne peux pas expulser se membre!` });
        if (!membre)
            return interaction.reply({ content: `❌ L'utilisateur n'as pas été trouvé!`, ephemeral: true });
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`**KICK** - ${membre.user.username}`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            // @ts-expect-error
            .setColor(config_1.default.EMBED_COLOR)
            .setDescription(`<@${membre.user.id}> a été expulsé
      
      **Raison**
      ${raison}`);
        await interaction.reply({ content: `L'utilisateur' **${membre.displayName}** a été expulsé Pour la raison suivante:\n ${raison}`, ephemeral: true });
        databaseConnect_1.db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("kick", "${membre.id}", "${raison}", "${date}")`);
        //await membre.kick(raison);
        logChannel.send({ embeds: [embed] });
        try {
            membre.send({ content: `Vous avez été bloqué par **${interaction.user.username}** sur le serveur ${interaction.guild?.name} pour la raison suivante: **${raison}**` });
        }
        catch (error) {
            console.log("Bann: Impossible d'envoyer le message privé");
        }
    }
}
exports.KickCommand = KickCommand;
