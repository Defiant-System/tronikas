
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
		this.cover([[460, 20], [460, 80], [530, 80], [530, 150], [260, 150], [260, 40], [402, 40], [402, 20]]);
		//this.cover([[225, 460], [20, 460], [20, 220], [310, 220], [310, 330], [225, 330]]);
	}

	cover(area) {
		var available,
			covered,
			cArr = [],
			len,
			fullArea = this.calcArea(this.polygon[0]),
			playerArea = 0;
		
		// add to polygons
		this.polygon.push(area);

		// calcualte available area
		available = Polyop.clip("difference", this.available, area);
		this.available = available[0].vertices;
	}

	closePath(poly, line) {
		
	}

	calcArea(poly) {
		var total = 0,
			addX,
			addY,
			subX,
			subY,
			i = 0, il = poly.length;

		for (; i < il; i++) {
			addX = poly[i][0];
			addY = poly[i == il - 1 ? 0 : i + 1][1];
			subX = poly[i == il - 1 ? 0 : i + 1][0];
			subY = poly[i][1];
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
		ctx.strokeStyle = 'rgba(170,170,255,.5)';
		ctx.lineTo(available[0][0], available[0][1]);
		ctx.beginPath();
		available.map(point => ctx.lineTo(point[0], point[1]));
		ctx.closePath();
		ctx.stroke();



		ctx.restore();
	}
}
