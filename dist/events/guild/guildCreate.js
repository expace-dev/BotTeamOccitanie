"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const sheweny_1 = require("sheweny");
const databaseConnect_1 = require("../../utils/databaseConnect");
class default_1 extends sheweny_1.Event {
    constructor(client) {
        super(client, discord_js_1.Events.GuildCreate, {
            description: "Evenement appelé lors de l'ajout d'un nouveau serveur",
            once: false,
        });
    }
    execute(guild) {
        databaseConnect_1.db.query(`INSERT INTO guilds(guildId, guildOwnerId, guildName) VALUES ("${guild.id}", "${guild.ownerId}", "${guild.name}")`);
    }
}
exports.default = default_1;
;
