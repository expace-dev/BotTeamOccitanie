"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const databaseConnect_1 = require("../../utils/databaseConnect");
const config_1 = __importDefault(require("../../config"));
class BanCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "ban",
            usage: "/ban <utilisateur>",
            examples: ["/ban <@utilisateur>"],
            description: "La commande ban permet de bloquer un utilisateur, il ne pourras plus revenir à moins de le débloquer",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "membre",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    description: "L'utilisateur à bloquer",
                    required: true
                },
                {
                    name: "raison",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "La raison du bloquage",
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
        const logChannel = this.client.channels.cache.get(config_1.default.LOGS_MODERATION);
        if (!membre.bannable)
            return interaction.reply({ content: '❌ Je ne peux pas bloquer cet utilisateur!', ephemeral: true });
        if (!membre)
            return interaction.reply({ content: `❌ L'utilisateur n'as pas été trouvé!`, ephemeral: true });
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`**BANN** - ${membre.user.username}`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            //.setAuthor({ name: `@${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            // @ts-expect-error
            .setColor(config_1.default.EMBED_COLOR)
            .setDescription(`<@${membre.user.id}> a été bloqué
      
      **Raison**
      ${raison}`);
        await interaction.reply({ content: `L'utilisateur **${membre.displayName}** a été bloqué Pour la raison suivante:\n **${raison}**`, ephemeral: true });
        await membre.ban({ reason: raison });
        databaseConnect_1.db.query(`INSERT INTO sanctions (type, utilisateur, raison, date) VALUES ("bann", "${membre.id}", "${raison}", "${date}")`);
        logChannel.send({ embeds: [embed] });
        try {
            membre.send({ content: `Vous avez été bloqué par **${interaction.user.username}** sur le serveur ${interaction.guild?.name} pour la raison suivante: **${raison}**` });
        }
        catch (error) {
            console.log("Bann: Impossible d'envoyer le message privé");
        }
    }
}
exports.BanCommand = BanCommand;
