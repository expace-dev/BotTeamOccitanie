import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, ChannelType, EmbedBuilder } from "discord.js";
import { db } from "../../utils/databaseConnect";

export class SetvocCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "setvoc",
      description: "Permet de créer un salon vocal privé",
      usage: "/setvoc <categorie>",
      examples: ["/setvoc <#categorie>"],
      type: "SLASH_COMMAND",
      category: "administration",
      cooldown: 5,
      userPermissions: [PermissionsBitField.Flags.Administrator],
      clientPermissions: [PermissionsBitField.Flags.Administrator],
      options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: "categorie",
            description: "Choisir la catégorie",
            required: true
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction) {

    const categorie = interaction.options.get('categorie');

    const embedvocadd = new EmbedBuilder()
        .setDescription(`VOUS AVEZ BIEN ACTIVÉ LES VOCAUX PRIVÉ`);

    const guild = interaction.guild;

    await guild?.channels.create({
        type: ChannelType.GuildVoice,
        name: `➕ Créer votre salon`,
        parent: categorie?.channel?.id
    }).then(channel => {
        db.query(`SELECT * FROM privatevoc WHERE guildID = '${interaction.guild?.id}'`, async (err, req) => {
            db.query(`UPDATE privatevoc SET channelID = '${channel.id}' WHERE guildID = '${interaction.guild?.id}'`);
        });
    });

    interaction.reply({ embeds: [embedvocadd], ephemeral: true });



  }
}
