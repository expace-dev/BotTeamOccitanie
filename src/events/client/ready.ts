import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import {db} from "../../utils/databaseConnect"
import config from "../../config";
import express from "express";
import cors from "cors";
import { Guild, TextChannel } from "discord.js";
//import bodyParser from "body-parser";

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

 /*   
    const allowLocalhostOnly = (req:any, res:any, next:any) => {
      const remoteAdress = req.ip;

      if (remoteAdress === '::ffff:127.0.0.1') {
        next();
      }
      else {
        req.status(403).send('Forbidden');
      }
    };

    app.use(allowLocalhostOnly);
    app.use(bodyParser.json());
   */ 
   //var whitelist = ['http://127.0.0.1']
    
   
   var allowedOrigins = ['http://localhost:3000',
                      'http://yourapp.com'];
  
  app.use(cors({
  origin: function(origin, callback){    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }    return callback(null, true);
  }
}));


    app.get('/post-article/query', (req, res) => 
    {

      
      const logChannel = this.client.channels.cache.get(config.SALON_ACTUALITE) as TextChannel;
      const title  = req.query.title;
      const url = req.query.url;
      const username = req.query.username;
      const avatar = req.query.avatar;
      const description = req.query.description;
      const image = req.query.image;
      // @ts-expect-error
      const newDescription = description.replaceAll('<br />', '\n');
      
      const embed = {
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
      logChannel.send({ content: `Bonjour @everyone, **${username}** a posté un nouvel article! Allez y jeter un oeil!`, embeds: [embed] })
      
      return res.status(200).json(
        {
          "statut": "Votre article a bien été partagé sur Discord",
        }
      );
      
      
    });

    app.get('/post-photo/query', (req, res) => 
    {
      
      const channel = this.client.channels.cache.get(config.SALON_PHOTOS) as TextChannel;
      const username = req.query.username;
      const avatar = req.query.avatar;
      const image = req.query.image;

      const embed = {
        color: 0x82a800,
        image: {
          url: image,
        },
        footer: {
          text: username,
          icon_url: avatar,
        },
        timestamp: new Date().toISOString(),
      };
      // @ts-expect-error
      channel.send({ embeds: [embed] }).then(message => {
        return res.status(200).json(
          {
            "messageId": message.id
          }
        );
      });
      
      

    });

    app.get('/remove-photo/query', (req, res) => 
    {

      const messageId = req.query.id;
      const channel = this.client.channels.cache.get(config.SALON_PHOTOS) as TextChannel;

      // @ts-expect-error
      channel.messages.delete(messageId)

      return res.status(200).json(
        {
          "status": "photo supprimé"
        }
      );


    });

    app.get('/add-tache/query', (req, res) => 
    {

      const channel = this.client.channels.cache.get(config.SALON_TACHES) as TextChannel;
      

      const embed = {
        color: 0x82a800,
        title: `Tache a effectuer sur ${req.query.map}`,
        description: req.query.description,
        thumbnail: {
          url: 'https://www.team-occitanie.fr/images/discord/help.png',
        },
        footer: {
          text: req.query.username,
          icon_url: req.query.avatar,
        },
        timestamp: new Date().toISOString(),
      };
      // @ts-expect-error
      channel.send({ embeds: [embed] }).then(message => {
        return res.status(200).json(
          {
            "messageId": message.id
          }
        );
      });

    });

    app.get('/remove-tache/query', (req, res) => 
    {

      const messageId = req.query.id;
      const channel = this.client.channels.cache.get(config.SALON_TACHES) as TextChannel;

      // @ts-expect-error
      channel.messages.delete(messageId)

      return res.status(200).json(
        {
          "status": "tache supprimé"
        }
      );


    });

    app.get('/add-evenement/query', (req, res) => 
    {

      const channel = this.client.channels.cache.get(config.SALON_EVENEMENTS) as TextChannel;
      

      const embed = {
        color: 0x82a800,
        title: `Evenement du <t:${req.query.date}:F>`,
        image: {
          url: req.query.image,
        },
        description: req.query.description,
        footer: {
          text: req.query.username,
          icon_url: req.query.avatar,
        },
        timestamp: new Date().toISOString(),
      };
      // @ts-expect-error
      channel.send({ embeds: [embed] }).then(message => {
        return res.status(200).json(
          {
            "messageId": message.id
          }
        );
      });

    });

    app.get('/remove-evenement/query', (req, res) => 
    {

      const messageId = req.query.id;
      const channel = this.client.channels.cache.get(config.SALON_EVENEMENTS) as TextChannel;

      // @ts-expect-error
      channel.messages.delete(messageId)

      return res.status(200).json(
        {
          "status": "tache supprimé"
        }
      );


    });

    app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}/`));

    
  }
};
