
ant_require("actors/stars.js");

const GAME = {
	stack: [],
	init() {
		this.cvs = CANVAS.context;
		this.ctx = CANVAS.context;
		this.width = CANVAS.width;
		this.height = CANVAS.height;

		// start game
		this.animationFrame = requestAnimationFrame(this.frame.bind(this));
		this.addActor(new Stars(this));
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
