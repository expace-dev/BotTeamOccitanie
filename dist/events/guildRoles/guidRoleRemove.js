"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
class default_1 extends sheweny_1.Event {
    constructor(client) {
        super(client, discord_js_1.Events.GuildMemberUpdate, {
            description: "Créer le message d'aurevoir'",
            once: false,
        });
    }
    async execute(guild) {
    }
}
exports.default = default_1;
;
