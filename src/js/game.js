
ant_require("misc/vector.js");
ant_require("misc/simplexNoise.js");

ant_require("actors/stars.js");
ant_require("actors/board.js");
ant_require("actors/player.js");
ant_require("actors/bouncer.js");
ant_require("actors/sparkle.js");
ant_require("actors/walker.js");
ant_require("actors/photon.js");
ant_require("actors/pi.js");
ant_require("actors/electric.js");


const GAME = {
	stack: [],
	init() {
		// fast references
		this.canvas = window.find("#canvas");
		
		this.cvs = this.canvas[0];
		this.ctx = this.cvs.getContext("2d");
		this.width = this.canvas.prop("offsetWidth");
		this.height = this.canvas.prop("offsetHeight");

		// start game
		this.animationFrame = requestAnimationFrame(this.frame.bind(this));
		this.addActor(new Stars);
		this.addActor(new Board);
		this.addActor(new Player);
		//this.addActor(new Bouncer);
		//this.addActor(new Walker);
		this.addActor(new Photon);
		//this.addActor(new Pi);
		//this.addActor(new Electric);
	},
	performance: (window.performance || {
		then: Date.now(),
		now: () => Date.now() - this.then
	}),
	setDelta() {
		this.now = this.performance.now();
		this.DELTA = (this.now - this.then) / 1000;
		this.then = this.now;
	},
	addActor(item) {
		// save references
		switch (item.constructor) {
			case Board: this.board = item; break;
			case Player: this.player = item; break;
		}
		this.stack.push(item);
	},
	deleteActor(item) {
		let len = this.stack.length;
		while (len--) {
			if (typeof item === 'undefined') {
				this.stack.splice(len, 1);
			} else if (typeof item === 'string') {
				if (this.stack[len].name === item) this.stack.splice(len, 1);
			} else {
				if (this.stack[len].name === item.name) this.stack.splice(len, 1);
			}
		}
	},
	frame() {
		this.setDelta();
		this.update();
		this.render();

		if (!this.animationFrame) return;
		this.animationFrame = requestAnimationFrame(this.frame.bind(this));
	},
	update() {
		this.stack.map(actor => {
			actor.update(this.DELTA);
		})
	},
	render() {
		// stop and freeze
		if (!this.animationFrame) return;

		this.ctx.clearRect(0, 0, this.width, this.height);

		this.stack.map(actor => {
			actor.render();
		})
	}
}
