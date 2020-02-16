
class Bouncer {
	constructor() {
		this.name = "Bouncer";
		this.GAME = GAME;
		this.ctx = GAME.ctx;
		this.board = GAME.board;
		this.player = GAME.player;

		this.radius = 6;
		this.center = new Vector(100, 100);
		this.vector = new Vector(3, -3);
	}

	destroy() {
		console.log("game over");
		this.isDestroyed = true;

		GAME.deleteActor(this);
	}

	checkPlayerLine() {
		let polygon = [].concat(this.player.history);
		polygon.push([this.player.x, this.player.y]);

		polygon.slice(0, -1).map((point, i) => {
			let line = [point, polygon[i+1]],
				collision = Polyop.circleIntersectLine(this, line);
			if (collision) {
				this.destroy();
			}
		});
	}

	update() {
		let polygon = this.board.available;

		for (let i=0, il=polygon.length; i<il; i++) {
			let x0 = polygon[i][0],
				y0 = polygon[i][1],
				x1 = polygon[(i+1) % il][0],
				y1 = polygon[(i+1) % il][1],
				line = [[x0, y0], [x1, y1]],
				collision = Polyop.circleIntersectLine(this, line);

			if (collision) {
				let radian = Math.atan2(y1 - y0, x1 - x0),
					normal = Vector.getNormal(radian);
				Vector.reflect(normal, this.vector);

				// collision sparkle
				let spark = new Sparkle(collision.x, collision.y, radian);
				this.GAME.addActor(spark);
			}
		}

		// check collision with player line
		this.checkPlayerLine();

		// move item
		this.center.add(this.vector);
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
