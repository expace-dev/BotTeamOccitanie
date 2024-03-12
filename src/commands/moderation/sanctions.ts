import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, GuildMember, EmbedBuilder } from "discord.js";
import { db } from "../../utils/databaseConnect";
import config from "../../config";

export class SanctionsCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "sanctions",
      usage: "/sanctions <utilisateur>",
      examples: ["/sanctions <@utilisateur>"],
      description: "Permet de lister les sanctions d'un utilisateur",
      type: "SLASH_COMMAND",
      category: "moderation",
      cooldown: 5,
      channel: "GUILD",
      options: [
        {
          name: "membre",
          type: ApplicationCommandOptionType.User,
          description: "Quel est l'utilisateur ?",
          required: true
        },
      ],
      userPermissions: [PermissionsBitField.Flags.BanMembers],
      clientPermissions: [PermissionsBitField.Flags.BanMembers]
    });
  }

  async execute(interaction: CommandInteraction) {
    
    const membre = interaction.options.getMember("membre") as GuildMember;


        db.query(`SELECT COUNT(*) AS sanctions FROM sanctions WHERE utilisateur=${membre.id}`, async (error, results, fields) => {
        
            const nbre = results[0].sanctions;

            db.query(`SELECT type, raison, date FROM sanctions WHERE utilisateur=${membre.id}`, async (error, donnees, fields) => {
               let raisons = "";

                donnees.forEach((donnee: any) => {
                    const date = (donnee.date/1000);
                    
                    raisons += `**${donnee.type}**\n${donnee.raison}\nLe: <t:${parseInt(date.toString())}:f>\n\n`
                });

                const embed = new EmbedBuilder()
                    .setTitle("Sanctions")
                    .setColor(config.EMBED_COLOR)
                    .setDescription(`l'utilisateur ${membre} a été sanctionné ${nbre} fois pour le(s) raison(s): \n\n${raisons}`)
                    .setFooter({ text: `Demandé par ${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` });


                return interaction.reply({embeds: [embed], ephemeral: true});
            });

    });
  }
}
