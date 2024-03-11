"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalComponent = void 0;
const sheweny_1 = require("sheweny");
class ModalComponent extends sheweny_1.Modal {
    constructor(client) {
        super(client, ["modal-id"]);
    }
    async execute(modal) {
        modal.reply("Modal received.");
    }
}
exports.ModalComponent = ModalComponent;
;
