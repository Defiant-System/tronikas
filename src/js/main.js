
ant_require("game.js");	 // GAME

import { Polyop } from "./polyop/index.js";

const tronikas = {
	init() {
		// initiate game
		GAME.init();
	},
	dispatch(event) {
		switch (event.type) {
			case "window.open":
				break;
			case "keystroke":
				switch (event.char) {
					case "up": break;
					case "down": break;
					case "left": break;
					case "right": break;
				}
				break;
		}
	}
};

window.exports = tronikas;
