
class Satellite {
	constructor(parent) {
		this.name = "Satellite";
		this.ctx = GAME.ctx;
		this.player = GAME.player;

		// parent
		this.parent = parent;
		// inherit color
		this.color = parent.color;

		let x = parent.center.x + this.randomInteger(10, 20),
			y = parent.center.y + this.randomInteger(10, 20);

		this.radius = 7;
		this.orbit = 5;
		this.center = new Vector(x, y);
		this.velocity = new Vector(0, 0);
	}

	destroy() {
		console.log("game over");
		this.isDestroyed = true;

		GAME.deleteActor(this);
	}

	random(max, min) {
		return Math.random() * (max - min) + min;
	}

	randomInteger(max, min) {
		return this.random(max + 1, min) | 0;
	}

	update() {
		let move = this.parent.center.clone(),
			dir = Vector.subtract(move, this.center);

		dir.normalize();
		dir.multiply(.75);
		this.acceleration = dir;
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.orbit);
		this.center.add(this.velocity);

		if (Polyop.circlesIntersect(this, this.player)) {
			this.destroy();
		}
	}

	render() {
		let ctx = this.ctx,
			gradient = ctx.createRadialGradient(this.center.x, this.center.y, this.radius, this.center.x, this.center.y, 0);

		// dot gradient
		gradient.addColorStop(0, 'transparent');
		gradient.addColorStop(0.7, this.color);
		gradient.addColorStop(1, '#fff');

		ctx.save();
		ctx.translate(0.5, 0.5);
		ctx.globalCompositeOperation = 'lighter';

		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius * 2, 0, Math.PI * 2);
		ctx.fill();

		ctx.restore();
	}
}
