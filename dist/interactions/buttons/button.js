"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonComponent = void 0;
const sheweny_1 = require("sheweny");
const config_1 = __importDefault(require("../../config"));
class ButtonComponent extends sheweny_1.Button {
    constructor(client) {
        super(client, ["accept-button", "secondaryId", "successId", "dangerId"]);
    }
    async execute(button) {
        switch (button.customId) {
            case "accept-button":
                if (button.inCachedGuild()) {
                    await button.member?.roles.add(config_1.default.ROLE_MEMBRE); // button.member will be GuildMember here
                }
                await button.reply({ content: `Vous avez accepté le règlement, vous avez maintenant accès à l'intégralité du serveur !!`, ephemeral: true });
                break;
            case "secondaryId":
                await button.reply({ content: "You have clicked on **secondary** button !" });
                break;
            case "successId":
                await button.reply({ content: "You have clicked on **success** button !" });
                break;
            case "dangerId":
                await button.reply({ content: "You have clicked on **danger** button !" });
                break;
        }
    }
}
exports.ButtonComponent = ButtonComponent;
;
