import { ShewenyClient } from "sheweny";
import config from "./config";

const client = new ShewenyClient({
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
  mode : "development", // Change to production for production bot

});


client.login(config.DISCORD_TOKEN);
