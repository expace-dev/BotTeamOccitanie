import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField } from "discord.js";

export class RestartCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "restart",
      description: "Permet de relancer le bot",
      usage: "/restart",
      examples: ["/restart"],
      type: "SLASH_COMMAND",
      category: "administration",
      userPermissions: [PermissionsBitField.Flags.Administrator],
      clientPermissions: [PermissionsBitField.Flags.Administrator]
    });
  }

  async execute(interaction: CommandInteraction) {
    await this.client.managers.commands?.deleteAllCommands("460449833128427530");
    await interaction.reply({ content: 'Bot relancé avec succès' });
    return process.exit();
  }
}
