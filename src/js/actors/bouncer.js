
class Bouncer {
	constructor() {
		this.name = "Bouncer";
		this.GAME = GAME;
		this.ctx = GAME.ctx;
		this.board = GAME.board;

		this.radius = 6;
		this.center = new Vector(100, 100);
		this.direction = new Vector(3, 3);
	}

	destroy() {
		
	}

	update() {
		let available = this.GAME.board.available,
			i, il,
			x0, y0, x1, y1,
			line,
			collision,
			radian,
			normal;

		for (i=0, il=available.length; i<il; i++) {
			x0 = available[i][0];
			y0 = available[i][1];
			x1 = available[(i+1) % il][0];
			y1 = available[(i+1) % il][1];
			line = [[x0, y0], [x1, y1]];
			collision = Polyop.circleIntersectLine(this, line);

			if (collision) {
				radian = Math.atan2(y1 - y0, x1 - x0);
				normal = Vector.getNormal(radian);
				Vector.reflect(normal, this.direction);

				// collision sparkle
				let spark = new Sparkle(collision.x, collision.y, radian);
				this.GAME.addActor(spark);
			}
		}
		// move item
		this.center.add(this.direction);
	}

	render() {
		let ctx = this.ctx,
			pi2 = Math.PI * 2,
			gradient;

		ctx.save();

		// dot gradient
		gradient = ctx.createRadialGradient(
			this.center.x,
			this.center.y,
			this.radius * 2,
			this.center.x,
			this.center.y,
			0);
		gradient.addColorStop(0, 'transparent');
		gradient.addColorStop(0.7, '#fa4');
		gradient.addColorStop(1, '#fff');

		ctx.fillStyle = gradient;

		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius, 0, pi2);
		ctx.closePath();
		ctx.fill();

		ctx.restore();
	}
}
