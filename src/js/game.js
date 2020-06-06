
defiant.require("misc/vector.js");
defiant.require("misc/simplexNoise.js");

defiant.require("actors/stars.js");
defiant.require("actors/nebula.js");

defiant.require("actors/board.js");
defiant.require("actors/player.js");
defiant.require("actors/fuse.js");
defiant.require("actors/bouncer.js");
defiant.require("actors/sparkle.js");
defiant.require("actors/walker.js");
defiant.require("actors/satellite.js");
defiant.require("actors/photon.js");
defiant.require("actors/pi.js");
defiant.require("actors/electric.js");
defiant.require("actors/gravity.js");


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
		//this.addActor(new Nebula);
		this.addActor(new Board);
		this.addActor(new Player);
		this.addActor(new Bouncer);
		//this.addActor(new Walker);
		//this.addActor(new Photon);
		//this.addActor(new Pi);
		//this.addActor(new Electric);
		//this.addActor(new Gravity);
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
