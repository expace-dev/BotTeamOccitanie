"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const sheweny_1 = require("sheweny");
const databaseConnect_1 = require("../../utils/databaseConnect");
class default_1 extends sheweny_1.Event {
    constructor(client) {
        super(client, discord_js_1.Events.GuildDelete, {
            description: "Evenement appelé lors de la suppression d'un serveur",
            once: false,
        });
    }
    execute(guild) {
        databaseConnect_1.db.query(`DELETE FROM guilds WHERE guildId="${guild.id}"`);
    }
}
exports.default = default_1;
;
