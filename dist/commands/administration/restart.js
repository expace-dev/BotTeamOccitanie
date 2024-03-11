"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestartCommand = void 0;
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
class RestartCommand extends sheweny_1.Command {
    constructor(client) {
        super(client, {
            name: "restart",
            description: "Permet de relancer le bot",
            usage: "/restart",
            examples: ["/restart"],
            type: "SLASH_COMMAND",
            category: "administration",
            userPermissions: [discord_js_1.PermissionsBitField.Flags.Administrator],
            clientPermissions: [discord_js_1.PermissionsBitField.Flags.Administrator]
        });
    }
    async execute(interaction) {
        await this.client.managers.commands?.deleteAllCommands("460449833128427530");
        await interaction.reply({ content: 'Bot relancé avec succès' });
        return process.exit();
    }
}
exports.RestartCommand = RestartCommand;
