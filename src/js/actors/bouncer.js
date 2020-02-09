
class Bouncer {
	constructor(GAME) {
		this.name = "Bouncer";
		this.ctx = GAME.ctx;
		this.board = GAME.board;

		this.size = 7;
		this.position = new Vector(100, 100);
		this.direction = new Vector(3, 3);
	}

	destroy() {
		
	}

	update() {
		
	}

	render() {
		let ctx = this.ctx,
			pi2 = Math.PI * 2,
			gradient;

		ctx.save();

		// dot gradient
		gradient = ctx.createRadialGradient(
			this.position.x,
			this.position.y,
			this.size * 2,
			this.position.x,
			this.position.y,
			0);
		gradient.addColorStop(0, 'transparent');
		gradient.addColorStop(0.7, '#fa4');
		gradient.addColorStop(1, '#fff');

		ctx.fillStyle = gradient;

		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.size, 0, pi2);
		ctx.closePath();
		ctx.fill();

		ctx.restore();
	}
}
