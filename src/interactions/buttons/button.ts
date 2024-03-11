import { Button } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { ButtonInteraction } from "discord.js";
import config from "../../config";

export class ButtonComponent extends Button {
  constructor(client: ShewenyClient) {
    super(client, ["accept-button", "secondaryId", "successId", "dangerId"]);
  }
  
  async execute(button: ButtonInteraction) {
    switch (button.customId) {
      case "accept-button":
        
      if(button.inCachedGuild()) {
        await  button.member?.roles.add(config.ROLE_MEMBRE);// button.member will be GuildMember here
      }

      await button.reply({ content: `Vous avez accepté le règlement, vous avez maintenant accès à l'intégralité du serveur !!`, ephemeral:true });

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
};
