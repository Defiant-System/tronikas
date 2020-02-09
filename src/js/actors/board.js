
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
		this.cover({color: "rgba(0,180,180,1)", poly: [[460, 20], [460, 80], [490, 80], [490, 140], [300, 140], [300, 100], [402, 100], [402, 20]]});
		this.cover({color: 'rgba(0,180,180,1)', poly: [[225, 460], [20, 460], [20, 280], [300, 280], [300, 317], [225, 317]]});
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
			len = polygon.length,
			i, il,
			shape,
			color;

		ctx.save();
		ctx.translate(0.5, 0.5);
		ctx.lineCap = "round";
		ctx.strokeStyle = "rgba(255,255,255,1)";
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


		
		// covered
		//ctx.globalAlpha = 1;
		//ctx.globalCompositeOperation = "source-over";
		ctx.lineWidth = 1.5;
		len = polygon.length;
		while (len--) {
			if (len === 0) continue;
			shape = polygon[len];

			ctx.beginPath();
			ctx.moveTo(shape.poly[0][0], shape.poly[0][1]);
			for (i=1, il=shape.poly.length; i<il; i++) {
				ctx.lineTo(shape.poly[i][0], shape.poly[i][1]);
			}
			ctx.closePath();

			ctx.strokeStyle = shape.color;
			ctx.stroke();
		}


		ctx.restore();
	}
}
