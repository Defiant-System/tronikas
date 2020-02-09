
class Walker {
	constructor() {
		this.name = "Walker";
		this.ctx = GAME.ctx;
		
		this.x = 220;
		this.y = 20;
		this.color = "#05f";
		this.speed = 1.25;
		this.size = 3;
		this.direction = 1;
	}

	destroy() {
		
	}

	random(a, b) {
		return Math.random() * (b - a) + a;
	}

	randomInteger(a, b) {
		return Math.floor(this.random(a, b));
	}

	nearest(point) {
		var boardPoly = GAME.board.polygon,
			poly,
			line,
			distance = [];

		// loop through polygons
		for (let i=0, il=boardPoly.length; i<il; i++) {
			poly = boardPoly[i].poly;
			for (let j=0, jl=poly.length; j<jl; j++) {
				line = [[poly[j][0], poly[j][1]], [poly[(j+1) % jl][0], poly[(j+1) % jl][1]]];
				// populate array of distances
				distance.push({
					line: line,
					distance: Polyop.pointLineDistance(point, line)
				});
			}
		}

		distance.sort(function(a, b) {
			return a.distance - b.distance;
		});

		// trim array
		distance.splice(8, 1e4);

		return distance;
	}

	selectPath() {
		var point = [this.x, this.y],
			nearest = this.nearest(point),
			i = 0,
			il = nearest.length,
			paths = [],
			pi = Math.PI,
		//	a, b, c,
			selected,
			direction,
			line, normal;

		for (; i<il; i++) {
			if (nearest[i].distance < this.speed) {
				line = nearest[i].line;
				normal = (Math.atan(line[1][1] - line[0][1], line[1][0] - line[0][0]) + pi) % pi;

				if (normal === 0) {
					if ((this.x > line[0][0] || this.x > line[1][0]) && this.direction !== 1) paths.push({normal: normal, line: line, direction: 3});
					if ((this.x < line[0][0] || this.x < line[1][0]) && this.direction !== 3) paths.push({normal: normal, line: line, direction: 1});
				} else {
					if ((this.y > line[0][1] || this.y > line[1][1]) && this.direction !== 2) paths.push({normal: normal, line: line, direction: 4});
					if ((this.y < line[0][1] || this.y < line[1][1]) && this.direction !== 4) paths.push({normal: normal, line: line, direction: 2});
				}
			}
		}
		if (paths.length) {
			selected = paths[this.randomInteger(0, paths.length)];
			if (selected.normal === 0) this.y = selected.line[0][1];
			else this.x = selected.line[0][0];
			this.direction = selected.direction;
		}
	}

	update() {
		// selects walker path
		this.selectPath();

		switch (this.direction) {
			case 1: this.x += this.speed; break;
			case 2: this.y += this.speed; break;
			case 3: this.x -= this.speed; break;
			case 4: this.y -= this.speed; break;
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
