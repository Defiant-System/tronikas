
class Player {
	constructor() {
		this.name = "Player";
		this.ctx = GAME.ctx;

		this.x = 20;
		this.y = 220;
		this.size = 9;
		this.ring = 0;
		this.move = {
			speed: 0,
			acc: 0.06,
			min: 0.25,
			max: 2.5
		};

		// boundries
		this.max = { x: 20, y: 20 };
		this.min = { x: 20, y: 20 };
	}

	destroy() {
		
	}

	nearestLine(point, available) {
		let len = available.length,
			// get distance to all lines
			distances = available.map((start, i) => {
				let end = available[(i+1) % len],
					line = [start, end],
					distance = Polyop.pointLineDistance(point, line);
				return { line, distance };
			})
			// closest first
			.sort((a, b) => a.distance - b.distance);

		// trim the array
		distances.splice(8, 100);

		return distances;
	}

	checkMove() {
		let available = GAME.board.available,
			point = [Math.floor(this.x), Math.floor(this.y)],
			rX = [point[0]],
			rY = [point[1]],
			pi = Math.PI,
			isCorner = 0;

		this.nearestLine(point, available)
			.map(item => {
				if (Math.floor(item.distance) === 0) {
					isCorner++;

					let normal = (Math.atan(item.line[1][1] - item.line[0][1], item.line[1][0] - item.line[0][0]) + pi) % pi;
					if (normal === 0) {
						rX.push(item.line[0][0]);
						rX.push(item.line[1][0]);
					} else {
						rY.push(item.line[0][1]);
						rY.push(item.line[1][1]);
					}
				}
			});

		// set boundries
		this.min.x = Math.min.apply(null, rX);
		this.max.x = Math.max.apply(null, rX);
		this.min.y = Math.min.apply(null, rY);
		this.max.y = Math.max.apply(null, rY);

		switch (true) {
			case this.UP:
				this.move.slide = 1;
				this.move.speed = Math.min(this.move.speed + this.move.acc, this.move.max);
				this.y = Math.max(this.y - this.move.speed, this.min.y);
				break;
			case this.RIGHT:
				this.move.slide = 2;
				this.move.speed = Math.min(this.move.speed + this.move.acc, this.move.max);
				this.x = Math.min(this.x + this.move.speed, this.max.x);
				break;
			case this.DOWN:
				this.move.slide = 3;
				this.move.speed = Math.min(this.move.speed + this.move.acc, this.move.max);
				this.y = Math.min(this.y + this.move.speed, this.max.y);
				break;
			case this.LEFT:
				this.move.slide = 4;
				this.move.speed = Math.min(this.move.speed + this.move.acc, this.move.max);
				this.x = Math.max(this.x - this.move.speed, this.min.x);
				break;
		}
	}

	slide() {
		this.move.speed = Math.max(this.move.speed - this.move.acc, this.move.min);
		
		if (this.move.speed <= this.move.min) {
			this.move.speed = 0;
			delete this.slide;
		}
		// deceleration
		switch (this.move.slide) {
			case 1: // UP
				this.y = Math.max(this.y - this.move.speed, this.min.y);
				//if (this.y === this.min.y && this.isCovering) this.closePath();
				break;
			case 2: // RIGHT
				this.x = Math.min(this.x + this.move.speed, this.max.x);
				//if (this.x === this.max.x && this.isCovering) this.closePath();
				break;
			case 3: // DOWN
				this.y = Math.min(this.y + this.move.speed, this.max.y);
				//if (this.y === this.max.y && this.isCovering) this.closePath();
				break;
			case 4: // LEFT
				this.x = Math.max(this.x - this.move.speed, this.min.x);
				//if (this.x === this.min.x && this.isCovering) this.closePath();
				break;
		}
	}

	update() {
		// pulsating ring
		this.ring += 0.12;
		if (this.ring > 13) this.ring = 1;

		if (this.UP || this.RIGHT || this.DOWN || this.LEFT) this.checkMove();
		else if (this.move.slide) this.slide();
	}

	render() {
		let ctx = this.ctx,
			pi2 = Math.PI * 2,
			gradient;

		ctx.save();

		// dot gradient
		gradient = ctx.createRadialGradient(this.x, this.y, this.size * 1.5, this.x, this.y, 0);
		gradient.addColorStop(0, "transparent");
		gradient.addColorStop(0.7, "#f8f");
		gradient.addColorStop(1, "#fff");

		// plater ring
		ctx.lineWidth = 2.5;

		// player dot
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, pi2);
		ctx.fill();

		if (this.move.speed <= this.move.min) {
			// player ring
			ctx.beginPath();
			ctx.strokeStyle = `rgba(255,190,255,${ (10 - this.ring) / 13 })`;
			ctx.arc(this.x, this.y, this.size + this.ring, 0, pi2);
			ctx.stroke();
		}

		ctx.restore();
	}
}
