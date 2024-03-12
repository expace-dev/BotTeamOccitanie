import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";

export class PingCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "ping",
      usage: "/ping",
      examples: ["/ping"],
      description: "La commande ping renvoie la latence du bot et de l'API Discord",
      type: "SLASH_COMMAND",
      category: "utilitaires",
      cooldown: 5,
      channel: "GUILD",
      userPermissions: [PermissionsBitField.Flags.SendMessages],
      clientPermissions: [PermissionsBitField.Flags.SendMessages]
    });
  }

  async execute(interaction: CommandInteraction) {
    const tryPong = await interaction.reply({ content: 'On essaye de pong... un instant!', fetchReply: true, ephemeral: true });
        
        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: 'Latence API', value: `\`\`\`${interaction.client.ws.ping}ms\`\`\``, inline: true },
                { name: 'Latence BOT', value: `\`\`\`${tryPong.createdTimestamp - interaction.createdTimestamp}ms\`\`\``, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })

            interaction.editReply({ content: ' ', embeds: [embed] });
  }
}