import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { Events, GuildMember, AttachmentBuilder, EmbedBuilder, Guild } from "discord.js"
import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas/index.js";
import { request } from "undici";
import config from "../../config";

export default class  extends Event {
  constructor(client: ShewenyClient) {
    super(client, Events.GuildMemberRemove, {
      description: "Créer le message de bienvenue",
      once: false,
    });
  }

  async execute(member: GuildMember, guild: Guild) {

    GlobalFonts.loadFontsFromDir('./assets/fonts');

    const start = Date.now();
		const rejoignedAt = member.joinedTimestamp;
		// @ts-expect-error
    const ecoule = (start - rejoignedAt);
	const seconds = Math.floor(ecoule / (1000));
	const minuts = Math.floor(ecoule / (1000*60));
	const hours = Math.floor(ecoule / (1000*60*60));
	const days = Math.floor(ecoule / (1000*60*60*24));
	const months = Math.floor(ecoule / (1000*60*60*24*30));
	const years = Math.floor(days / 365);
	let duree;

	if (years > 0) {
		duree = `${years} ans`;
    }
	else if (months > 0) {
		duree = `${months} mois`;
	}
	else if (days > 0) {
		duree = `${days} jours`;
	}
	else if (hours > 0) {
		duree = `${hours} heures`;
	}
	else if (minuts > 0) {
		duree = `${minuts} minutes`;
	}
	else {
		duree = `${seconds} secondes`;
    }

    const canvas = createCanvas(1000, 300);
	const context = canvas.getContext('2d');
    const backgrounds = await loadImage('./assets/images/background.png');
    context.drawImage(backgrounds, 0, 0, canvas.width, canvas.height);
    context.font = '110px Quantify';
	context.fillStyle = '#ffffff';
	context.fillText('A bientôt', canvas.width / 3.2, canvas.height / 2.4);
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
		.setTitle(`**Un membre vient de partir 😢**`)
		.setDescription(`**À bientôt ${member.user.username} 👋**`)
		.setColor(`#82a800`)
		.setImage('attachment://profile-image.png')
        .setFooter({ text: `Avait rejoint le serveur il y a ${duree}` });

        const arrivedChannel = this.client.channels.cache.get(config.SALON_DEPART);
        // @ts-expect-error
        arrivedChannel?.send({ embeds: [embedClient], files: [attachment] });


  }
};
