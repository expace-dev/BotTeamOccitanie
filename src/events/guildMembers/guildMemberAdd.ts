import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { Events, GuildMember, AttachmentBuilder, EmbedBuilder, Guild } from "discord.js"
import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas/index.js";
import { request } from "undici";
import config from "../../config";

export default class  extends Event {
  constructor(client: ShewenyClient) {
    super(client, Events.GuildMemberAdd, {
      description: "Créer le message d'aurevoir'",
      once: false,
    });
  }

  async execute(member: GuildMember, guild: Guild) {

    GlobalFonts.loadFontsFromDir('./assets/fonts');
    const canvas = createCanvas(1000, 300);
		const context = canvas.getContext('2d');
    member.roles.add(config.ROLE_VISITEUR);
    const backgrounds = await loadImage('./assets/images/background.png');
    context.drawImage(backgrounds, 0, 0, canvas.width, canvas.height);
    context.font = '110px Quantify';
		context.fillStyle = '#ffffff';
		context.fillText('Bienvenue', canvas.width / 3.2, canvas.height / 2.4);
    context.font = '45px Quantify';
		context.fillStyle = '#ffffff';
		context.fillText('sur le serveur Discord', canvas.width / 3.2, canvas.height / 1.7);
    context.font = '55px Quantify, Segoe UI Emoji';
		context.fillStyle = '#ffffff';
		context.fillText(`${member.guild.name}`, canvas.width / 3.2, canvas.height / 1.2);
		context.beginPath();
		context.arc(145, 150, 110, 0, Math.PI * 2);
		context.closePath();
		context.clip();
    const { body } = await request(member.user.displayAvatarURL({ extension: 'jpg' }));
		const avatar = await loadImage(await body.arrayBuffer());
		context.drawImage(avatar, 25, 25, 250, 250);
		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

    const embedClient = new EmbedBuilder()
			.setTitle(`**Ho ! Un nouveau membre !**`)
			.setDescription(`**Bienvenue ${member.user.username}**
            
        Nous sommes très heureux de vous accueillir sur notre serveur

        Dans un premier temps nous vous demanderons d'accepter notre règlement qui est disponible dans le salon <#${config.SALON_RULES}>
      `)
			.setColor(`#82a800`)
			.setImage('attachment://profile-image.png');

      const arrivedChannel = this.client.channels.cache.get(config.SALON_ARRIVEE);
      // @ts-expect-error
      arrivedChannel?.send({ embeds: [embedClient], files: [attachment] });


  }
};
