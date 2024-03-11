"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class default_1 extends sheweny_1.Event {
    constructor(client) {
        super(client, discord_js_1.Events.GuildRoleCreate, {
            description: "Créer le message d'aurevoir'",
            once: false,
        });
    }
    async execute(member) {
        const devGuild = this.client.guilds.cache.get(config_1.default.GUILD_ID);
        devGuild?.members.fetch()
            .then(console.log)
            .catch(console.error);
        const nbreModerateurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config_1.default.ROLE_MODERATEUR)).size;
        const nbreAgriculteurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config_1.default.ROLE_AGRICULTEUR)).size;
        const nbreChauffeurs = devGuild?.members.cache.filter(member => member.roles.cache.has('964170042436624464')).size;
        const nbreModeurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config_1.default.ROLE_MODEUR)).size;
        devGuild?.channels.edit(config_1.default.SALON_UTILISATEURS, { name: `Utilisateurs: ${devGuild.memberCount}` }).then().catch(console.error);
        devGuild?.channels.edit(config_1.default.SALON_MODERATEURS, { name: `Modérateurs: ${nbreModerateurs}` }).then().catch(console.error);
        devGuild?.channels.edit(config_1.default.SALON_AGRICULTEURS, { name: `Agriculteurs: ${nbreAgriculteurs}` }).then().catch(console.error);
        devGuild?.channels.edit(config_1.default.SALON_CHAUFFEURS, { name: `Chauffeurs: ${nbreChauffeurs}` }).then().catch(console.error);
        devGuild?.channels.edit(config_1.default.SALON_MODEURS, { name: `Modeurs: ${nbreModeurs}` }).then().catch(console.error);
    }
}
exports.default = default_1;
;
