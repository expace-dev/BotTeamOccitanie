import { Events, Guild } from "discord.js";
import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { db } from "../../utils/databaseConnect"
export default class  extends Event {
  constructor(client: ShewenyClient) {
    super(client, Events.GuildDelete, {
      description: "Evenement appelé lors de la suppression d'un serveur",
      once: false,
    });
  }

  execute(guild: Guild) {

    db.query(`DELETE FROM guilds WHERE guildId="${guild.id}"`);

  }
};
