
class Player {
	constructor() {
		this.name = "Player";
		this.GAME = GAME;
		this.ctx = GAME.ctx;

		this.radius = 9;
		this.center = new Vector(60, 20);
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

		// trail
		this.trail = [];

		// fuse
		this.fuse = false;
		this.fuseTimeout = false;
		this.fuseIgnite = 1000;

		// move history
		this.history = [];
		this.isOnline = true;

		// temp
		// this.history = [[350,20],[350,50],[250,50],[250,170],[300,170],[300,130],[490,130]];
		// this.center.x = this.history[this.history.length-1][0];
		// this.center.y = this.history[this.history.length-1][1];
		// this.move.direction = 2;
		// this.isCovering = true;
		// this.isOnline = false;

		// // start fuse
		// this.fuseCountdown();
	}

	destroy() {
		
	}

	closePath() {
		let line = this.lastPolyLine,
			polygon = [].concat(this.history),
			point = [this.center.x, this.center.y];

		// add final point
		polygon.push(point);

		// reset player
		this.isCovering = false;
		this.isOnline = true;
		this.history = [];

		// delete move direction
		delete this.move.direction;

		// destroy fuse if ignited
		if (this.fuse) {
			// remove fuse from actors stack
			this.GAME.deleteActor(this.fuse);

			// signal fuse for destruction
			this.fuse.destroy();
			this.fuse = false;

			// prevent fuse
			clearTimeout(this.fuseTimeout);
			delete this.fuseTimeout;
		}

		// cover board with new polygon
		GAME.board.cover(polygon, line);
	}

	nearestLine(point, polygon) {
		let len = polygon.length,
			// get distance to all lines
			distances = polygon.map((start, i) => {
				let end = polygon[(i+1) % len],
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
			len = available.length,
			point = [this.center.x, this.center.y],
			pi = Math.PI,
			direction;

		// prevent fuse
		clearTimeout(this.fuseTimeout);
		delete this.fuseTimeout;

		if (this.isCovering) {
			let line = [[this.center.x, this.center.y], [this.center.x, this.center.y]],
				intersection = [];

			// extend imaginary line & check if path needs closing
			switch (true) {
				case this.UP:
					line[1][1] = -1e4;
					if (!this.isOnline && this.center.y <= this.min.y) {
						this.center.y = this.min.y;
						this.isCovering = false;
						this.closePath();
						return;
					}
					break;
				case this.RIGHT:
					line[1][0] =  1e4;
					if (!this.isOnline && this.center.x >= this.max.x) {
						this.center.x = this.max.x;
						this.isCovering = false;
						this.closePath();
						return;
					}
					break;
				case this.DOWN:
					line[1][1] =  1e4;
					if (!this.isOnline && this.center.y >= this.max.y) {
						this.center.y = this.max.y;
						this.isCovering = false;
						this.closePath();
						return;
					}
					break;
				case this.LEFT:
					line[1][0] = -1e4;
					if (!this.isOnline && this.center.x <= this.min.x) {
						this.center.x = this.min.x;
						this.isCovering = false;
						this.closePath();
						return;
					}
					break;
			}

			// player is officially not on line
			this.isOnline = !this.isCovering;

			available.map((start, i) => {
				let end = available[(i+1) % len],
					polyLine = [start, end],
					collision = Polyop.lineIntersect(line, polyLine);
				if (collision) {
					let a = line[0][0] - collision[0],
						b = line[0][1] - collision[1],
						distance = Math.sqrt(a * a + b * b);
					
					if (distance > 0) {
						intersection.push({ ...collision, distance, polyLine });
					}
				}
			});

			// sort intersections
			intersection.sort((a, b) => a.distance - b.distance);

			this.lastPolyLine = [].concat(intersection[0].polyLine);

			if (intersection.length) {
				switch (true) {
					case this.UP:    this.min.y = intersection[0][1]; break;
					case this.RIGHT: this.max.x = intersection[0][0]; break;
					case this.DOWN:  this.max.y = intersection[0][1]; break;
					case this.LEFT:  this.min.x = intersection[0][0]; break;
				}
			}

		} else {
			let rX = [point[0]],
				rY = [point[1]];
			// get nearest lines in available polygon
			this.nearestLine(point, available)
				.map(item => {
					if (Math.floor(item.distance) === 0) {
						// calculate normal to check if zero
						if ((Math.atan(item.line[1][1] - item.line[0][1], item.line[1][0] - item.line[0][0]) + pi) % pi === 0) {
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

			// start fresh history
			this.history = [[this.center.x, this.center.y]];

			// movement logic
			if (this.move.speed !== 0 && (
				(this.UP || this.DOWN) && ~[2, 4].indexOf(this.move.direction) ||
				(this.RIGHT || this.LEFT) && ~[1, 3].indexOf(this.move.direction))) {
				return this.slide();
			}
		}

		switch (true) {
			case this.UP:
				direction = 1;
				if (this.isCovering && this.move.direction !== direction) {
					// add point
					this.history.push([this.center.x, this.center.y]);
				}
				if (!this.isCovering && this.move.speed === 0 && this.max.y === this.min.y) {
					// test is move is "legal"
					point[1] -= this.move.min;
					this.isCovering = Polyop.isPointInPolygon(point, available);
				}
				if (this.max.y !== this.min.y) {
					this.move.slide = 1;
					this.move.speed = Math.min(this.move.speed + this.move.acc, this.move.max);
					this.center.y = Math.max(this.center.y - this.move.speed, this.min.y);
				}
				break;
			case this.RIGHT:
				direction = 2;
				if (this.isCovering && this.move.direction !== direction) {
					// add point
					this.history.push([this.center.x, this.center.y]);
				}
				if (!this.isCovering && this.move.speed === 0 && this.max.x === this.min.x) {
					// test is move is "legal"
					point[0] += this.move.min;
					this.isCovering = Polyop.isPointInPolygon(point, available);
				}
				if (this.max.x !== this.min.x) {
					this.move.slide = 2;
					this.move.speed = Math.min(this.move.speed + this.move.acc, this.move.max);
					this.center.x = Math.min(this.center.x + this.move.speed, this.max.x);
				}
				break;
			case this.DOWN:
				direction = 3;
				if (this.isCovering && this.move.direction !== direction) {
					// add point
					this.history.push([this.center.x, this.center.y]);
				}
				if (!this.isCovering && this.move.speed === 0 && this.max.y === this.min.y) {
					// test is move is "legal"
					point[1] += this.move.min;
					this.isCovering = Polyop.isPointInPolygon(point, available);
				}
				if (this.max.y !== this.min.y) {
					this.move.slide = 3;
					this.move.speed = Math.min(this.move.speed + this.move.acc, this.move.max);
					this.center.y = Math.min(this.center.y + this.move.speed, this.max.y);
				}
				break;
			case this.LEFT:
				direction = 4;
				if (this.isCovering && this.move.direction !== direction) {
					// add point
					this.history.push([this.center.x, this.center.y]);
				}
				if (!this.isCovering && this.move.speed === 0 && this.max.x === this.min.x) {
					// test is move is "legal"
					point[0] -= this.move.min;
					this.isCovering = Polyop.isPointInPolygon(point, available);
				}
				if (this.max.x !== this.min.x) {
					this.move.slide = 4;
					this.move.speed = Math.min(this.move.speed + this.move.acc, this.move.max);
					this.center.x = Math.max(this.center.x - this.move.speed, this.min.x);
				}
				break;
		}

		// save movement direction
		this.move.direction = direction;
	}

	checkSelfCrossing() {
		let poly = this.history,
			i = 0,
			il = poly.length-3,
			line = [[].concat(poly[il+1]), [this.center.x, this.center.y]];

		for (; i<il; i++) {
			let polyLine = [[poly[i][0], poly[i][1]], [poly[i+1][0], poly[i+1][1]]],
				collision = Polyop.lineIntersect(line, polyLine);
			if (collision) {
				return console.log("Game Over", collision);
			}
		};
	}

	fuseCountdown() {
		var self = this;

		if (this.fuse || !this.isCovering) return;

		// fuse ignition
		this.fuseTimeout = setTimeout(() => {
			self.fuse = new Fuse;
			self.GAME.addActor(self.fuse);
		}, this.fuseIgnite);
	}

	slide() {
		this.move.speed = Math.max(this.move.speed - this.move.acc, this.move.min);
		
		if (this.move.speed <= this.move.min) {
			this.move.speed = 0;
			delete this.move.slide;

			if (!this.isCovering) delete this.move.direction;

			// start fuse
			this.fuseCountdown();
		}
		// deceleration
		switch (this.move.slide) {
			case 1: // UP
				this.center.y = Math.max(this.center.y - this.move.speed, this.min.y);
				if (this.center.y === this.min.y && this.isCovering) this.closePath();
				break;
			case 2: // RIGHT
				this.center.x = Math.min(this.center.x + this.move.speed, this.max.x);
				if (this.center.x === this.max.x && this.isCovering) this.closePath();
				break;
			case 3: // DOWN
				this.center.y = Math.min(this.center.y + this.move.speed, this.max.y);
				if (this.center.y === this.max.y && this.isCovering) this.closePath();
				break;
			case 4: // LEFT
				this.center.x = Math.max(this.center.x - this.move.speed, this.min.x);
				if (this.center.x === this.min.x && this.isCovering) this.closePath();
				break;
		}
	}

	update() {
		// pulsating ring
		this.ring += 0.12;
		if (this.ring > 13) this.ring = 1;

		// player movement
		if (this.UP || this.RIGHT || this.DOWN || this.LEFT) this.checkMove();
		else if (this.move.slide) this.slide();

		// check if player crosses itself
		if (this.isCovering) this.checkSelfCrossing();

		if (this.move.speed > 0) {
			this.trail.push({
				x: this.center.x,
				y: this.center.y,
				size: this.radius / 2,
				ttl: 17,
			});
		}

		// player trail
		this.trail.map((trail, i) => {
			trail.ttl--;
			if (trail.ttl < 0) this.trail.splice(i, 1);
		});
	}

	render() {
		let ctx = this.ctx,
			pi2 = Math.PI * 2,
			shape = this.history,
			gradient;

		ctx.save();
		ctx.translate(0.5, 0.5);

		if (this.isCovering) {
			// if player is "covering"
			ctx.lineWidth = 2;
			ctx.strokeStyle = "rgba(255,190,255,.5)";
			ctx.beginPath();
			ctx.moveTo(shape[0][0], shape[0][1]);
			shape.slice(1).map(point => ctx.lineTo(point[0], point[1]));
			ctx.lineTo(this.center.x, this.center.y);
			ctx.stroke();
		}

		// player trail
		ctx.save();
		ctx.fillStyle = "#f3f";
		ctx.globalCompositeOperation = "lighten";
		this.trail.map(trail => {
			ctx.beginPath();
			ctx.arc(trail.x, trail.y, trail.size, 0, pi2);
			ctx.globalAlpha = trail.ttl / 17;
			ctx.fill();
		});
		ctx.restore();

		// player ring
		ctx.lineWidth = 3;

		// dot gradient
		gradient = ctx.createRadialGradient(this.center.x, this.center.y, this.radius * 1.5, this.center.x, this.center.y, 0);
		gradient.addColorStop(0, "transparent");
		gradient.addColorStop(0.7, "#f8f");
		gradient.addColorStop(1, "#fff");

		// player dot
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius, 0, pi2);
		ctx.fill();

		if (this.move.speed <= this.move.min) {
			// player ring
			ctx.beginPath();
			ctx.strokeStyle = `rgba(255,190,255,${ (10 - this.ring) / 13 })`;
			ctx.arc(this.center.x, this.center.y, this.radius + this.ring, 0, pi2);
			ctx.stroke();
		}

		ctx.restore();
	}
}
