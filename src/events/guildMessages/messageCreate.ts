import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { Events } from "discord.js";

export default class  extends Event {
  constructor(client: ShewenyClient) {
    super(client, Events.MessageCreate, {
      description: "Créer le message d'aurevoir'",
      once: false,
    });
  }

  async execute() {

    
   


    
    
  }
};
