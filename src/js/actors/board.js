
class Board {
	constructor() {
		this.name = "Board";
		this.ctx = GAME.ctx;
		
		this.margin = 20;
		this.width = GAME.width - this.margin;
		this.height = GAME.height - this.margin;

		this.polygon = [{
			color : "transparent",
			poly  : [[this.margin, this.margin],
					[this.width, this.margin],
					[this.width, this.height],
					[this.margin, this.height]]
		}];

		this.available = [].concat(this.polygon[0].poly);

		// temp
		this.cover({color: "rgba(0,180,180,1)", poly: [[460, 20], [460, 80], [490, 80], [490, 150], [300, 150], [300, 100], [402, 100], [402, 20]]});
		//this.cover({color: 'rgba(0,180,180,1)', poly: [[225, 460], [20, 460], [20, 220], [300, 220], [300, 330], [225, 330]]});
	}

	cover(area) {
		var available,
			covered,
			cArr = [],
			len,
			fullArea = this.calcArea(this.polygon[0].poly),
			playerArea = 0;
		
		// add to polygons
		this.polygon.push(area);

		// calcualte available area
		available = Polyop.clip("difference", this.available, area.poly);
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
			i, il,
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
		ctx.moveTo(shape.poly[0][0], shape.poly[0][1]);
		for (i=1, il=shape.poly.length; i<il; i++) {
			ctx.lineTo(shape.poly[i][0], shape.poly[i][1]);
		}
		ctx.closePath();
		ctx.stroke();

		
		// available area
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'rgba(170,170,255,.5)';
		ctx.lineTo(this.available[0][0], this.available[0][1]);
		i = this.available.length;
		ctx.beginPath();
		while (i--) {
			ctx.lineTo(this.available[i][0], this.available[i][1]);
		}
		ctx.closePath();
		ctx.stroke();



		ctx.restore();
	}
}
