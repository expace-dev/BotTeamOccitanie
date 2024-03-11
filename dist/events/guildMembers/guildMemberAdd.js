"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sheweny_1 = require("sheweny");
const discord_js_1 = require("discord.js");
const index_js_1 = require("@napi-rs/canvas/index.js");
const undici_1 = require("undici");
const config_1 = __importDefault(require("../../config"));
class default_1 extends sheweny_1.Event {
    constructor(client) {
        super(client, discord_js_1.Events.GuildMemberAdd, {
            description: "Créer le message d'aurevoir'",
            once: false,
        });
    }
    async execute(member, guild) {
        index_js_1.GlobalFonts.loadFontsFromDir('./assets/fonts');
        const canvas = (0, index_js_1.createCanvas)(1000, 300);
        const context = canvas.getContext('2d');
        member.roles.add(config_1.default.ROLE_VISITEUR);
        const backgrounds = await (0, index_js_1.loadImage)('./assets/images/background.png');
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
        const { body } = await (0, undici_1.request)(member.user.displayAvatarURL({ extension: 'jpg' }));
        const avatar = await (0, index_js_1.loadImage)(await body.arrayBuffer());
        context.drawImage(avatar, 25, 25, 250, 250);
        const attachment = new discord_js_1.AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });
        const embedClient = new discord_js_1.EmbedBuilder()
            .setTitle(`**Ho ! Un nouveau membre !**`)
            .setDescription(`**Bienvenue ${member.user.username}**
            
        Nous sommes très heureux de vous accueillir sur notre serveur

        Dans un premier temps nous vous demanderons d'accepter notre règlement qui est disponible dans le salon <#${config_1.default.SALON_RULES}>
      `)
            .setColor(`#82a800`)
            .setImage('attachment://profile-image.png');
        const arrivedChannel = this.client.channels.cache.get(config_1.default.SALON_ARRIVEE);
        // @ts-expect-error
        arrivedChannel?.send({ embeds: [embedClient], files: [attachment] });
    }
}
exports.default = default_1;
;
