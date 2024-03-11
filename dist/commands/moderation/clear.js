"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
class ClearCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "clear",
            usage: "/clear <nombre> <utilisateur (optionnel)>",
            examples: ["/clear <nombre> <@utilisateur>"],
            description: "La commande clear permet de supprimmer des messages dans le salon ou elle est exécuté",
            type: "SLASH_COMMAND",
            category: "moderation",
            cooldown: 5,
            channel: "GUILD",
            options: [
                {
                    name: "message",
                    type: discord_js_1.ApplicationCommandOptionType.Number,
                    description: "le nombre de message à supprimer",
                    required: true
                },
                {
                    name: "membre",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    description: "Sélectionnez l'utilisateur pour la suppression de messages",
                },
            ],
            userPermissions: [discord_js_1.PermissionsBitField.Flags.ManageMessages],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.ManageMessages]
        });
    }
    async execute(interaction) {
        const amountToDelete = interaction.options.get("message", false)?.value;
        if (amountToDelete > 100 || amountToDelete < 2)
            return interaction.reply({ content: '❌ Le nombre doit être inférieur à 100 et supérieur à 1!', ephemeral: true });
        const membre = interaction.options.getMember("membre");
        const channelTextMessages = interaction.channel;
        if (membre) {
            const messagesToDelete = await channelTextMessages.messages.fetch();
            let i = 0;
            const filteredTargetMessages = [];
            (messagesToDelete)?.filter(msg => {
                if (msg.author.id == membre.id && amountToDelete > i) {
                    filteredTargetMessages.push(msg);
                    i++;
                }
            });
            channelTextMessages.bulkDelete(filteredTargetMessages, true).then(messages => {
                interaction.reply({ content: `J'ai supprimé ${messages.size} messages de l'utilisateur ${membre}`, ephemeral: true });
            });
        }
        else {
            channelTextMessages.bulkDelete(amountToDelete, true).then(messages => {
                interaction.reply({ content: `J'ai supprimé ${messages.size} messages sur ce salon`, ephemeral: true });
            });
        }
    }
}
exports.ClearCommand = ClearCommand;
