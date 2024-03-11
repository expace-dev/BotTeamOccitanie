import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, GuildMember, TextChannel, Message } from "discord.js";

export class ClearCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "clear",
      usage: "/clear <nombre> <utilisateur (optionnel)>",
      examples: ["/clear <nombre> <@utilisateur>"],
      description: "La commande clear permet de supprimmer des messages dans le salon ou elle est exécuté",
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      options: [
        {
          name: "message",
          type: ApplicationCommandOptionType.Number,
          description: "le nombre de message à supprimer",
          required: true
        },
        {
          name: "membre",
          type: ApplicationCommandOptionType.User,
          description: "Sélectionnez l'utilisateur pour la suppression de messages",
        },
      ],
      userPermissions: [PermissionsBitField.Flags.ManageMessages],
      clientPermissions: [PermissionsBitField.Flags.ManageMessages]
    });
  }

  async execute(interaction: CommandInteraction) {
    
    const amountToDelete = interaction.options.get("message", false)?.value as number;
    if (amountToDelete > 100 || amountToDelete < 2) return interaction.reply({ content: '❌ Le nombre doit être inférieur à 100 et supérieur à 1!', ephemeral: true });
    const membre = interaction.options.getMember("membre") as GuildMember;
    const channelTextMessages = interaction.channel as TextChannel;
    
    if (membre) {
        const messagesToDelete = await channelTextMessages.messages.fetch();
        let i = 0;
        const filteredTargetMessages: Message[] = [];
        (messagesToDelete)?.filter(msg => {
            if (msg.author.id == membre.id && amountToDelete > i) {
                filteredTargetMessages.push(msg); i++;
            }
        });

        channelTextMessages.bulkDelete(filteredTargetMessages, true).then(messages => {
            interaction.reply({ content: `J'ai supprimé ${messages.size} messages de l'utilisateur ${membre}`, ephemeral: true });
        });
    }
    else {
        channelTextMessages.bulkDelete(amountToDelete, true).then(messages => {
            interaction.reply({ content: `J'ai supprimé ${messages.size} messages sur ce salon`, ephemeral: true });
        });
    }

  }
}
