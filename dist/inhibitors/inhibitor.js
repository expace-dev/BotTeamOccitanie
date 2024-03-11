"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackListInhibitor = void 0;
const sheweny_1 = require("sheweny");
class BlackListInhibitor extends sheweny_1.Inhibitor {
    constructor(client) {
        super(client, "blacklist", {
            type: ["ALL"],
        });
    }
    execute(structure, interaction) {
        // Put a guild id
        return !["<guildId>"].includes(interaction.guildId);
    }
    async onFailure(structure, interaction) {
        await interaction.reply("Your guild is blacklisted.");
    }
}
exports.BlackListInhibitor = BlackListInhibitor;
;
