import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { Events, MessageReaction, User } from "discord.js";
import config from "../../config";

export default class  extends Event {
  constructor(client: ShewenyClient) {
    super(client, Events.MessageReactionAdd, {
      description: "Ajoute une reaction",
      once: false,
    });
  }

  async execute(messageReaction: MessageReaction, user: User) {

    const message = messageReaction.message;
    const emojiName = messageReaction.emoji.name;
    const member = message.guild?.members.cache.get(user.id);
    const channel = message.guild?.channels.cache.get(config.SALON_ROLES);


    if (member?.user.bot) return;

    if (messageReaction.partial) {
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.log('Impossible de récupérer les messages');
            return;
        }
    }


    if (message.channel.id === channel?.id) {
        console.log(member?.roles.cache);
        if (emojiName === '👨‍🦰') await member?.roles.add(config.ROLE_HOMME);
        if (emojiName === '👩‍🦰') await member?.roles.add(config.ROLE_FEMME);
        if (emojiName === '🚚') {
            await member?.roles.add(config.ROLE_JOUEUR);
            await member?.roles.add(config.ROLE_CHAUFFEUR);
        } 
        if (emojiName === '🚜') {
            await member?.roles.add(config.ROLE_JOUEUR);
            await member?.roles.add(config.ROLE_AGRICULTEUR);
        } 
    }

  }
};
