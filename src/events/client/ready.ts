import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import {db} from "../../utils/databaseConnect"
import config from "../../config";
import express from "express";
import cors from "cors";
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

    app.use(cors());

    var corsOptions = {
      origin: 'https://www.team-occitanie.fr',
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }

    app.get('/', (req, res) => 
    {
      return res.send('hello world');
    });


    app.put('/post-article/query', cors(corsOptions), (req, res) => 
    {

      

      const logChannel = this.client.channels.cache.get('963409987873415219') as TextChannel;
      const title  = req.query.title;
      const url = req.query.url;
      const username = req.query.username;
      const avatar = req.query.avatar;
      const description = req.query.description;
      const image = req.query.image;
      // @ts-expect-error
      const newDescription = description.replaceAll('<br />', '\n');
      
      const exampleEmbed = {
        color: 0x82a800,
        title: title,
        url: url,
        author: {
          name: username,
          icon_url: avatar,
        },
        description: newDescription,
        image: {
          url: image,
        },
        timestamp: new Date().toISOString(),
      };
      // @ts-expect-error
      logChannel.send({ content: `Bonjour @everyone, **${username}** a posté un nouvel article! Allez y jeter un oeil!`, embeds: [exampleEmbed] })
      
      return res.status(200).json(
        {
          "statut": "Votre article a bien été partagé sur Discord",
        }
      );
      
      
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}/`));

    
  }
};
