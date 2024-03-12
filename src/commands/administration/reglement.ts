import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, PermissionsBitField, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import config from "../../config";

export class ReglementCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "reglement",
      description: "Permet de générer le règlement dans le salon ou elle est exécuté",
      usage: "/reglement",
      examples: ["/reglement"],
      type: "SLASH_COMMAND",
      category: "administration",
      cooldown: 5,
      userPermissions: [PermissionsBitField.Flags.Administrator],
      clientPermissions: [PermissionsBitField.Flags.Administrator],
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "créer",
          description: "Créer un embed de règlement",
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction) {

    const buttons = new ActionRowBuilder<any>().addComponents(
      new ButtonBuilder()
          .setCustomId('accept-button')
          .setLabel('Accepter le règlement')
          .setStyle(ButtonStyle.Success),

    );

    const welcomeEmbed = new EmbedBuilder()
            .setTitle(`Acceptez le règlement de ${interaction.guild?.name}`)
            // @ts-expect-error
            .setColor(config.EMBED_COLOR)
            .setDescription(`
              **Accepter ce règlement vous permettras d'accéder à l'intégraité du serveur !!**

              🔞  NSFW
              NSFW, NSFL et le contenu malsain n'est pas autorise sur le serveur. 
              Il sera punissable d'un bannissement!

              ⚠️  Publicité
              Toute publicité non autorisé par un membre du staff est strictement interdite sur le serveur. Mais également dans les messages privés.
              Il sera punissable d'une exclusion et d'un bannissement temporaire!

              🚨  Mentions
              Evitez les mentions inutiles et réfléchissez avant de poser une question. 
              Vous n'êtes pas seuls et les réponses ont souvent déjà été données.
              Il seras punissable d'une exclusion ou d'un bannissement  en cas d'abus!

              🇫🇷 Français
              La structure est francophone, veuillez donc à écrire en français uniquement 
              pour une compréhension facile de tous les membres de la communauté

              👥  Vie privée
              Evitez d'être trop intrusif et respectez la vie privée des membres présents. 
              Ne réclamez pas la présence d'un membre de l'équipe si celle ci n'est pas possible.

              Règlement mis a jour le 09/03/2024

              Pour accepter le règlement, veuillez interagir avec les boutons ci-dessous !
          `);
          await interaction.channel?.send({ embeds: [welcomeEmbed], components: [buttons] });

          interaction.reply({ content: 'Le règlement a bien été généré', ephemeral: true });
  }
}

