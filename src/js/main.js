
ant_require("canvas.js");	// CANVAS
ant_require("game.js");		// GAME

const tronikas = {
	init() {
		// initiate objects
		CANVAS.init();
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
