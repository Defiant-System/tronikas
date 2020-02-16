
class Walker {
	constructor() {
		this.name = "Walker";
		this.GAME = GAME;
		this.ctx = GAME.ctx;
		this.board = GAME.board;
		this.player = GAME.player;
		
		this.radius = 3;
		this.center = new Vector(380, 20);
		this.color = "#09f";
		this.speed = 1.5;

		this.checkDirection();
		//this.direction = 2;
	}

	destroy() {
		console.log("game over");
		this.isDestroyed = true;

		GAME.deleteActor(this);
	}

	getCurrentLine() {
		let polygon = this.board.available,
			il = polygon.length,
			pos = [this.center.x, this.center.y],
			lines = [];
		polygon.map((p1, i) => {
			let n = (i+1) % il,
				polyLine = [p1, polygon[n]];
			if (Polyop.pointLineDistance(pos, polyLine) === 0) lines.push(polyLine);
		});
		if (this.currentLine) {
			lines = lines.filter(line => line.join() !== this.currentLine.join());
		}
		return lines[0];
	}

	checkDirection() {
		let line = this.getCurrentLine(),
			pi = Math.PI,
			normal = (Math.atan(line[1][1] - line[0][1], line[1][0] - line[0][0]) + pi) % pi;

		// reset min & max
		this.min = { x: 0, y: 0 };
		this.max = { x: 0, y: 0 };

		if (normal === 0) {
			this.min.x = Math.min(line[0][0], line[1][0]);
			this.max.x = Math.max(line[0][0], line[1][0]);
			this.direction = (this.center.x <= this.min.x) ? 2 : 4;
		} else {
			this.min.y = Math.min(line[0][1], line[1][1]);
			this.max.y = Math.max(line[0][1], line[1][1]);
			this.direction = (this.center.y <= this.min.y) ? 3 : 1;
		}
		// save current line
		this.currentLine = line;
	}

	update() {
		switch (this.direction) {
			case 1: this.center.y = Math.max(this.center.y - this.speed, this.min.y); break;
			case 2: this.center.x = Math.min(this.center.x + this.speed, this.max.x); break;
			case 3: this.center.y = Math.min(this.center.y + this.speed, this.max.y); break;
			case 4: this.center.x = Math.max(this.center.x - this.speed, this.min.x); break;
		}
		if (this.center.x === this.min.x || this.center.x === this.max.x ||
			this.center.y === this.min.y || this.center.y === this.max.y) {
			this.checkDirection();
		}
		if (Polyop.circlesIntersect(this, this.player)) {
			this.destroy();
		}
	}

	render() {
		let ctx = this.ctx,
			pi2 = Math.PI * 2,
			gradient;

		ctx.save();
		ctx.translate(0.5, 0.5);
		ctx.globalCompositeOperation = 'lighter';
		
		// dot gradient
		gradient = ctx.createRadialGradient(this.center.x, this.center.y, this.radius * 4, this.center.x, this.center.y, 0);
		gradient.addColorStop(0, 'transparent');
		gradient.addColorStop(0.7, this.color);
		gradient.addColorStop(1, '#fff');

		// walker dot
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius * 4, 0, pi2);
		ctx.fill();

		ctx.restore();
	}
}
