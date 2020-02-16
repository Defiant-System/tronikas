
class Walker {
	constructor() {
		this.name = "Walker";
		this.GAME = GAME;
		this.ctx = GAME.ctx;
		this.board = GAME.board;
		this.player = GAME.player;
		
		this.x = 480;
		this.y = 150;
		this.color = "#05f";
		this.speed = 1.5;
		this.size = 5;
		this.direction = 4;

		// reset boundaries
		this.min = { x: 260, y: 0 };
		this.max = { x: 530, y: 0 };

		let polygon = this.board.available;
		this.currentLine = this.getCurrentLine(polygon);
	}

	destroy() {
		
	}

	getCurrentLine(polygon) {
		let il = polygon.length,
			pos = [this.x, this.y],
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
		let polygon = this.board.available,
			line = this.getCurrentLine(polygon),
			pi = Math.PI,
			normal = (Math.atan(line[1][1] - line[0][1], line[1][0] - line[0][0]) + pi) % pi;

		// reset min & max
		this.min = { x: 0, y: 0 };
		this.max = { x: 0, y: 0 };

		if (normal === 0) {
			this.min.x = Math.min(line[0][0], line[1][0]);
			this.max.x = Math.max(line[0][0], line[1][0]);
			this.direction = (this.x <= this.min.x) ? 2 : 4;
		} else {
			this.min.y = Math.min(line[0][1], line[1][1]);
			this.max.y = Math.max(line[0][1], line[1][1]);
			this.direction = (this.y <= this.min.y) ? 3 : 1;
		}
		// save current line
		this.currentLine = line;
	}

	update() {
		switch (this.direction) {
			case 1: this.y = Math.max(this.y - this.speed, this.min.y); break;
			case 2: this.x = Math.min(this.x + this.speed, this.max.x); break;
			case 3: this.y = Math.min(this.y + this.speed, this.max.y); break;
			case 4: this.x = Math.max(this.x - this.speed, this.min.x); break;
		}
		if (this.x === this.min.x || this.x === this.max.x ||
			this.y === this.min.y || this.y === this.max.y) {
			this.checkDirection();
		}
	}

	render() {
		let ctx = this.ctx,
			pi2 = Math.PI * 2,
			gradient;

		ctx.save();
		ctx.globalCompositeOperation = 'lighter';
		
		// dot gradient
		gradient = ctx.createRadialGradient(this.x, this.y, this.size*3, this.x, this.y, 0);
		gradient.addColorStop(0, 'transparent');
		gradient.addColorStop(0.7, this.color);
		gradient.addColorStop(1, '#fff');

		// walker dot
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size * 2, 0, pi2);
		ctx.fill();

		ctx.restore();
	}
}
