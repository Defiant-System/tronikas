
ant_require("class/vector.js");

ant_require("actors/stars.js");
ant_require("actors/board.js");
ant_require("actors/bouncer.js");


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
		this.addActor(new Stars(this));
		this.addActor(new Board(this));
		this.addActor(new Bouncer(this));
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
		if (item.constructor === Board) {
			// save reference to board
			this.board = item;
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
		let delta = this.DELTA,
			stack = this.stack,
			len = stack.length;
		while (len--) {
			if (stack[len] && stack[len].update) {
				stack[len].update(delta);
			}
		}
	},
	render() {
		let ctx = this.ctx,
			stack = this.stack,
			len = stack.length;

		// stop and freeze
		if (!this.animationFrame) return;

		ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

		while (len--) {
			if (stack[len].render) {
				stack[len].render(ctx);
			}
		}
	}
}
