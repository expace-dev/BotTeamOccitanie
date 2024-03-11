"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyEvent = void 0;
const sheweny_1 = require("sheweny");
const databaseConnect_1 = require("../../utils/databaseConnect");
const config_1 = __importDefault(require("../../config"));
class ReadyEvent extends sheweny_1.Event {
    constructor(client) {
        super(client, "ready", {
            description: "Client is logged in",
            once: true,
            emitter: client,
        });
    }
    execute() {
        databaseConnect_1.db.connect(function (err) {
            if (err) {
                console.log('Impossible de se connecter à MySql');
                return;
            }
            console.log("Conneté avec succès à la base de donnée");
        });
        console.log(`${this.client.user.tag} is logged in`);
        const devGuild = this.client.guilds.cache.get(config_1.default.GUILD_ID);
        const nbreModerateurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config_1.default.ROLE_MODERATEUR)).size;
        const nbreAgriculteurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config_1.default.ROLE_AGRICULTEUR)).size;
        const nbreChauffeurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config_1.default.ROLE_CHAUFFEUR)).size;
        const nbreModeurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config_1.default.ROLE_MODEUR)).size;
        devGuild?.channels.edit(config_1.default.SALON_UTILISATEURS, { name: `Utilisateurs: ${devGuild.memberCount}` }).then().catch(console.error);
        devGuild?.channels.edit(config_1.default.SALON_MODERATEURS, { name: `Modérateurs: ${nbreModerateurs}` }).then().catch(console.error);
        devGuild?.channels.edit(config_1.default.SALON_AGRICULTEURS, { name: `Agriculteurs: ${nbreAgriculteurs}` }).then().catch(console.error);
        devGuild?.channels.edit(config_1.default.SALON_CHAUFFEURS, { name: `Chauffeurs: ${nbreChauffeurs}` }).then().catch(console.error);
        devGuild?.channels.edit(config_1.default.SALON_MODEURS, { name: `Modeurs: ${nbreModeurs}` }).then().catch(console.error);
    }
}
exports.ReadyEvent = ReadyEvent;
;
