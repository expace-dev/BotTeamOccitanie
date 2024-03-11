"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sheweny_1 = require("sheweny");
const config_1 = __importDefault(require("./config"));
const client = new sheweny_1.ShewenyClient({
    intents: ["Guilds", "GuildMessages", "GuildMembers"],
    managers: {
        commands: {
            directory: "./commands",
            autoRegisterApplicationCommands: true,
            prefix: "!",
        },
        events: {
            directory: "./events",
        },
        buttons: {
            directory: "./interactions/buttons",
        },
        selectMenus: {
            directory: "./interactions/selectmenus",
        },
        modals: {
            directory: "./interactions/modals",
        },
        inhibitors: {
            directory: "./inhibitors",
        },
    },
    mode: "development", // Change to production for production bot
});
const devGuild = client.guilds.cache.get(config_1.default.GUILD_ID);
devGuild?.members.fetch()
    .then(console.log)
    .catch(console.error);
const nbreModerateurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config_1.default.ROLE_MODERATEUR)).size;
const nbreAgriculteurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config_1.default.ROLE_AGRICULTEUR)).size;
const nbreChauffeurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config_1.default.ROLE_CHAUFFEUR)).size;
const nbreModeurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config_1.default.ROLE_MODEUR)).size;
devGuild?.channels.edit(config_1.default.SALON_UTILISATEURS, { name: `Utilisateurs: ${devGuild.memberCount}` }).then().catch(console.error);
devGuild?.channels.edit(config_1.default.SALON_MODERATEURS, { name: `Modérateurs: ${nbreModerateurs}` }).then().catch(console.error);
devGuild?.channels.edit(config_1.default.SALON_AGRICULTEURS, { name: `Agriculteurs: ${nbreAgriculteurs}` }).then().catch(console.error);
devGuild?.channels.edit(config_1.default.SALON_CHAUFFEURS, { name: `Chauffeurs: ${nbreChauffeurs}` }).then().catch(console.error);
devGuild?.channels.edit(config_1.default.SALON_MODEURS, { name: `Modeurs: ${nbreModeurs}` }).then().catch(console.error);
function updateStats() {
    setTimeout(updateStats, 9); /* rappel après 10 secondes = 10000 millisecondes */
    console.log('mise a jour');
}
updateStats();
client.login(config_1.default.DISCORD_TOKEN);
