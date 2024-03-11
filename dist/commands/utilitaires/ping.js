"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
class PingCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "ping",
            usage: "/ping",
            examples: ["/ping"],
            description: "La commande ping renvoie la latence du bot et de l'API Discord",
            type: "SLASH_COMMAND",
            category: "utilitaires",
            cooldown: 5,
            channel: "GUILD"
        });
    }
    async execute(interaction) {
        const tryPong = await interaction.reply({ content: 'On essaye de pong... un instant!', fetchReply: true, ephemeral: true });
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields({ name: 'Latence API', value: `\`\`\`${interaction.client.ws.ping}ms\`\`\``, inline: true }, { name: 'Latence BOT', value: `\`\`\`${tryPong.createdTimestamp - interaction.createdTimestamp}ms\`\`\``, inline: true })
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });
        interaction.editReply({ content: ' ', embeds: [embed] });
    }
}
exports.PingCommand = PingCommand;
