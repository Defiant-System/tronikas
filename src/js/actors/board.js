
class Board {
	constructor(GAME) {
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

		// temp
		this.cover({color: 'rgba(0,180,180,1)', poly: [[460, 20], [460, 80], [490, 80], [490, 140], [300, 140], [300, 100], [402, 100], [402, 20]]});
	}

	cover(area) {
		// add to polygons
		this.polygon.push(area);
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
		ctx.lineCap = 'round';
		ctx.strokeStyle = 'rgba(255,255,255,1)';
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
		//ctx.globalCompositeOperation = 'source-over';
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
