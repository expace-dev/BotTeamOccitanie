"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetvocCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const databaseConnect_1 = require("../../utils/databaseConnect");
class SetvocCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "setvoc",
            description: "Permet de créer un salon vocal privé",
            usage: "/setvoc <categorie>",
            examples: ["/setvoc <#categorie>"],
            type: "SLASH_COMMAND",
            category: "administration",
            cooldown: 5,
            userPermissions: [discord_js_1.PermissionsBitField.Flags.ManageGuild],
            options: [
                {
                    type: discord_js_1.ApplicationCommandOptionType.Channel,
                    name: "categorie",
                    description: "Choisir la catégorie",
                    required: true
                },
            ],
        });
    }
    async execute(interaction) {
        const categorie = interaction.options.get('categorie');
        const embedvocadd = new discord_js_1.EmbedBuilder()
            .setDescription(`VOUS AVEZ BIEN ACTIVÉ LES VOCAUX PRIVÉ`);
        const guild = interaction.guild;
        await guild?.channels.create({
            type: discord_js_1.ChannelType.GuildVoice,
            name: `➕ Créer votre salon`,
            parent: categorie?.channel?.id
        }).then(channel => {
            databaseConnect_1.db.query(`SELECT * FROM privatevoc WHERE guildID = '${interaction.guild?.id}'`, async (err, req) => {
                databaseConnect_1.db.query(`UPDATE privatevoc SET channelID = '${channel.id}' WHERE guildID = '${interaction.guild?.id}'`);
            });
        });
        interaction.reply({ embeds: [embedvocadd], ephemeral: true });
    }
}
exports.SetvocCommand = SetvocCommand;
