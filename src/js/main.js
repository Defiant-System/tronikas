
@import "./game.js";         // GAME
@import "./polyop/index.js"; // Polyop

const tronikas = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			startView: window.find(".start.view"),
		};
		// initiate game
		GAME.init();
	},
	dispatch(event) {
		let Self = tronikas,
			el;
		switch (event.type) {
			// system events
			case "window.keyup":
				if (!GAME.player) return;
				GAME.player.UP =
				GAME.player.DOWN =
				GAME.player.LEFT =
				GAME.player.RIGHT = false;
				break;
			case "window.keystroke":
				if (!GAME.player) return;
				GAME.player[event.char.toUpperCase()] = true;
				break;
			// custom events
			case "start-new-game":
				Self.els.startView.removeClass("show");
				// start level
				GAME.loadLevel(1);
				break;
			case "game-over":
				break;
		}
	}
};

window.exports = tronikas;
