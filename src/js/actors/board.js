
class Board {
	constructor() {
		this.name = "Board";
		this.ctx = GAME.ctx;
		
		this.margin = 20;
		this.width = GAME.width - this.margin;
		this.height = GAME.height - this.margin;

		this.polygon = [
			[[this.margin, this.margin],
			[this.width, this.margin],
			[this.width, this.height],
			[this.margin, this.height]]
		];

		this.available = [].concat(this.polygon[0]);

		// temp
		//this.cover([[460, 20], [460, 80], [530, 80], [530, 150], [260, 150], [260, 40], [402, 40], [402, 20]]);
		//this.cover([[225, 460], [20, 460], [20, 220], [310, 220], [310, 330], [225, 330]]);
	}

	cover(polygon, line) {
		let available,
			covered,
			cArr = [],
			len,
			fullArea = this.calcArea(this.polygon[0]),
			playerArea = 0;
		
		if (line) {
			polygon = this.closePath(polygon, line);
		}

		// add to polygons
		this.polygon.push(polygon);

		// calcualte available area
		available = Polyop.clip("difference", this.available, polygon);
		this.available = available[0].vertices;
	}

	closePath(poly1, line) {
		let available = this.available,
			il = available.length,
			i = 0,
			poly2,
			point = [poly1[0][0], poly1[0][1]],
			a, b, start, end;

		available.map((point, i) => {
			if (point[0] === line[0][0] && point[1] === line[0][1]) a = i + 1;
		});

		// iterate available vertices to close path
		for (; i<il; i++) {
			b = i + a;
			start = [available[b % il][0], available[b % il][1]];
			end = [available[(b+1) % il][0], available[(b+1) % il][1]];
			
			poly1.push([available[(i+a) % il][0], available[(i+a) % il][1]]);
			if (Polyop.pointLineDistance(point, [start, end]) === 0) break;
		}

		// invert path in order to calculate smaller area
		poly2 = Polyop.clip("difference", available, poly1)[0].vertices;

		// always return smaller area
		return this.calcArea(poly1) > this.calcArea(poly2) ? poly2 : poly1;
	}

	calcArea(polygon) {
		let total = 0,
			addX,
			addY,
			subX,
			subY,
			i = 0, il = polygon.length;

		for (; i < il; i++) {
			addX = polygon[i][0];
			addY = polygon[i == il - 1 ? 0 : i + 1][1];
			subX = polygon[i == il - 1 ? 0 : i + 1][0];
			subY = polygon[i][1];
			total += (addX * addY * 0.5);
			total -= (subX * subY * 0.5);
		}

		return Math.abs(total);
	}

	update() {
		
	}

	render() {
		let ctx = this.ctx,
			polygon = this.polygon,
			available = this.available,
			len = polygon.length,
			shape,
			color;

		ctx.save();
		ctx.translate(0.5, 0.5);
		ctx.lineCap = "round";
		ctx.strokeStyle = "rgba(255,255,255,.25)";
		ctx.lineWidth = 1;


		// base rectangle
		shape = polygon[0];
		ctx.beginPath();
		ctx.moveTo(shape[0][0], shape[0][1]);
		shape.slice(1).map(point => ctx.lineTo(point[0], point[1]));
		ctx.closePath();
		ctx.stroke();

		
		// available area
		ctx.lineWidth = 3;
		ctx.strokeStyle = "rgba(170,170,255,.5)";
		ctx.lineTo(available[0][0], available[0][1]);
		ctx.beginPath();
		available.map(point => ctx.lineTo(point[0], point[1]));
		ctx.closePath();
		ctx.stroke();



		ctx.restore();
	}
}
