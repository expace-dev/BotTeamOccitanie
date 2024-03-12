import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import {db} from "../../utils/databaseConnect"
import config from "../../config";
import express from "express";
import { Guild, TextChannel } from "discord.js";

export class ReadyEvent extends Event {
  constructor(client: ShewenyClient) {
    super(client, "ready", {
      description: "Client is logged in",
      once: true,
      emitter: client,
    });
  }

  async execute(guild: Guild) {


    const devGuild = this.client.guilds.cache.get(config.GUILD_ID);
    await devGuild?.members.fetch().then(console.log).catch(console.error);
    

    function updateStats() {
      const nbreModerateurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config.ROLE_MODERATEUR)).size;
      const nbreAgriculteurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config.ROLE_AGRICULTEUR)).size;
      const nbreChauffeurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config.ROLE_CHAUFFEUR)).size;
      const nbreModeurs = devGuild?.members.cache.filter(member => member.roles.cache.has(config.ROLE_MODEUR)).size;

      devGuild?.channels.edit(config.SALON_UTILISATEURS, { name: `Utilisateurs: ${devGuild.memberCount}` }).then().catch(console.error);
      devGuild?.channels.edit(config.SALON_MODERATEURS, { name: `Modérateurs: ${nbreModerateurs}` }).then().catch(console.error);
      devGuild?.channels.edit(config.SALON_AGRICULTEURS, { name: `Agriculteurs: ${nbreAgriculteurs}` }).then().catch(console.error);
      devGuild?.channels.edit(config.SALON_CHAUFFEURS, { name: `Chauffeurs: ${nbreChauffeurs}` }).then().catch(console.error);
      devGuild?.channels.edit(config.SALON_MODEURS, { name: `Modeurs: ${nbreModeurs}` }).then().catch(console.error);

      setTimeout(updateStats,10000); /* rappel après 10 secondes = 10000 millisecondes */

    }


    updateStats();

    db.connect(function(err) {
      if (err) {
        console.log('Impossible de se connecter à MySql');
        return;
      }

      console.log("Conneté avec succès à la base de donnée");
    });

    console.log(`${this.client.user!.tag} is logged in`);

    const app = express();
    const port = 3000;
    

    app.get('/article', (req, res) => 
    {

      const logChannel = this.client.channels.cache.get('965896004316585994') as TextChannel;
      
      const exampleEmbed = {
        color: 0x82a800,
        title: 'Synchronisation des mods',
        url: 'https://www.team-occitanie.fr/publications/synchronisation-des-mods',
        author: {
          name: 'Fredy34560',
          icon_url: 'https://www.team-occitanie.fr/images/avatars/9f3a23c03735e12e99c21863e2b27d05.jpg',
        },
        description: 'Dans cet article nous allons voir comment mettre en place le système de synchronisation. Vous devez au préalable vous être inscris sur le site, avoir activé votre compte et reçu le mail confirmant la création de votre compte Cloud',
        image: {
          url: 'https://www.team-occitanie.fr/images/blog/a8142a95577525c52713731984e19bf7.jpg',
        },
        timestamp: new Date().toISOString(),
      };

      logChannel.send({ content: `Bonjour @everyone, **Fredy34560** a posté un nouvel article! Allez y jeter un oeil!`, embeds: [exampleEmbed] })
      return res.status(200).send()
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}/`));

    
  }
};
