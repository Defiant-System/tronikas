
class Bouncer {
	constructor(GAME) {
		this.name = "Bouncer";
		this.GAME = GAME;
		this.ctx = GAME.ctx;
		this.board = GAME.board;

		this.size = 7;
		this.position = new Vector(100, 100);
		this.direction = new Vector(3, 3);
	}

	destroy() {
		
	}

	update() {
		let available = this.GAME.board.available,
			i, il,
			x0, y0, x1, y1,
			l1, l2, col,
			rad,
			normal;

		for (i=0, il=available.length; i<il; i++) {
			x0 = available[i][0];
			y0 = available[i][1];
			x1 = available[(i+1) % il][0];
			y1 = available[(i+1) % il][1];

			l2 = [[x0, y0], [x1, y1]];
			l1 = [[this.position.x,
					this.position.y],
					[this.position.x + this.direction.x,
					this.position.y + this.direction.y]];
			col = Polyop.lineIntersect(l1, l2);

			if (col) {
				rad = Math.atan2(y1 - y0, x1 - x0);
				normal = Vector.getNormal(rad);
				Vector.reflect(normal, this.direction);

				// collision sparkle
				//spark = new this.Sparkle(col[0], col[1], rad);
				//this.sparks.push(spark);
				return;
			}
		}
		// move item
		this.position.add(this.direction);
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
