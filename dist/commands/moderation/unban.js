"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnbanCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class UnbanCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "unban",
            usage: "/unban <utilisateur> <raison>",
            examples: ["/unban <@utilisateur> <raison>"],
            description: "Permet de débloquer un utilisateur",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "membre",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "L'id du membre à débloquer",
                    required: true
                },
                {
                    name: "raison",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    description: "La raison du débloquage",
                    required: true
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.BanMembers],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.BanMembers]
        });
    }
    async execute(interaction) {
        const membre = interaction.options.get("membre, true")?.value;
        const raison = interaction.options.get("raison", false)?.value;
        const logChannel = this.client.channels.cache.get(config_1.default.LOGS_MODERATION);
        interaction.guild?.bans.fetch(membre).then((membre) => {
            interaction.guild?.members.unban(membre.user.id).then(() => {
                interaction.reply({ content: `L'utilisateur' **${membre.user.username}** a été débloqué Pour la raison suivante:\n **${raison}**`, ephemeral: true });
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`**UNBAN** - ${membre.user.username}`)
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp()
                    // @ts-expect-error
                    .setColor(config_1.default.EMBED_COLOR)
                    .setDescription(`<@${membre.user.id}> a été débloqué
      
      **Raison**
      ${raison}`);
                logChannel.send({ embeds: [embed] });
                try {
                    membre.user.send({ content: `Vous avez été débloqué par **${interaction.user.username}** sur le serveur ${interaction.guild?.name} pour la raison suivante: **${raison}**` });
                }
                catch (error) {
                    console.log("Bann: Impossible d'envoyer le message privé");
                }
            });
        }).catch(() => {
            console.log("Ce membre n'est pas bloqué");
            interaction.reply({ content: "❌ Ce membre n'est pas bloqué!", ephemeral: true });
        });
    }
}
exports.UnbanCommand = UnbanCommand;
