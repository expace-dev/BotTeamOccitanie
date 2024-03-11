import { Events, Guild } from "discord.js";
import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { db } from "../../utils/databaseConnect"
export default class  extends Event {
  constructor(client: ShewenyClient) {
    super(client, Events.GuildCreate, {
      description: "Evenement appelé lors de l'ajout d'un nouveau serveur",
      once: false,
    });
  }

  execute(guild: Guild) {

      db.query(`INSERT INTO guilds(guildId, guildOwnerId, guildName) VALUES ("${guild.id}", "${guild.ownerId}", "${guild.name}")`);

  }
};
