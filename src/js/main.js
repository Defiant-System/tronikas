
defiant.require("game.js");	 // GAME
defiant.require("polyop/index.js");	 // Polyop

const tronikas = {
	init() {
		// initiate game
		GAME.init();
	},
	dispatch(event) {
		switch (event.type) {
			case "window.open":
				break;
			case "window.keyup":
				GAME.player.UP =
				GAME.player.DOWN =
				GAME.player.LEFT =
				GAME.player.RIGHT = false;
				break;
			case "window.keystroke":
				GAME.player[event.char.toUpperCase()] = true;
				break;
		}
	}
};

window.exports = tronikas;
