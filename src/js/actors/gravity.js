
class Gravity {
	constructor() {
		this.name = "Gravity";
		this.cvs = GAME.cvs;
		this.ctx = GAME.ctx;
		this.cW = GAME.width;
		this.cH = GAME.height;
		this.board = GAME.board;

		this.radius = 50;
		this.center = new Vector(280, 210);
		this.vector = new Vector(1, 1);
		this.old = { x: 0, y: 0 };
	}

	destroy() {
		
	}

	smootherstep(t) {
		return 1 / (Math.exp(-6 * t + 3)) - Math.exp(-3)
	}

	update() {
		let polygon = this.board.available;

		for (let i=0, il=polygon.length; i<il; i++) {
			let x0 = polygon[i][0],
				y0 = polygon[i][1],
				x1 = polygon[(i+1) % il][0],
				y1 = polygon[(i+1) % il][1],
				line = [[x0, y0], [x1, y1]],
				collision = Polyop.circleIntersectLine(this, line);

			if (collision) {
				let radian = Math.atan2(y1 - y0, x1 - x0),
					normal = Vector.getNormal(radian);
				Vector.reflect(normal, this.vector);
			}
		}

		this.center.add(this.vector);
	}

	render() {
		let ctx = this.ctx,
			pi2 = Math.PI * 2,
			dataSrc = ctx.getImageData(0, 0, this.cW, this.cH),
			dataDst = ctx.getImageData(0, 0, this.cW, this.cH);

		let xmin = this.old.x - this.radius,
			xmax = this.old.x + this.radius,
			ymin = this.old.y - this.radius,
			ymax = this.old.y + this.radius;

		if (xmin < 0) xmin = 0;
		if (xmax > this.cW) xmax = this.cW;

		if (ymin < 0) ymin = 0;
		if (ymax > this.cH) ymax = this.cH;

		for (let y=ymin; y<ymax; y++) {
			for (let x=xmin; x<xmax; x++) {
				let index = (x + y * this.cW) << 2;
				dataDst.data[index] = dataSrc.data[index++];
				dataDst.data[index] = dataSrc.data[index++];
				dataDst.data[index] = dataSrc.data[index++];
				dataDst.data[index] = 255;
			}
		}

		let dstdata = dataDst.data,
			srcdata = dataSrc.data;

		xmin = this.center.x - this.radius;
		xmax = this.center.x + this.radius;
		ymin = this.center.y - this.radius;
		ymax = this.center.y + this.radius;

		if (xmin < 0)  xmin = 0;
		if (xmax > this.cW)  xmax = this.cW;

		if (ymin < 0)  ymin = 0;
		if (ymax > this.cH)  ymax = this.cH;

		let tol = -15;
		let maxSize = this.cW * (this.cH - 1) + this.cW - 1;


		for (let y=ymin; y<ymax; y++) {
			let index = (xmin + y * this.cW) << 2;
			for (let x=xmin; x<xmax; x++) {
				let x1 = x - this.center.x,
					y1 = y - this.center.y,
					d = Math.sqrt(x1 * x1 + y1 * y1);
				if (d <= this.radius) {
					let sc = 1 - this.smootherstep((this.radius - d) / this.radius);
					//sc = 1;
					let xx = Math.floor(this.center.x + x1 * sc),
						yy = Math.floor(this.center.y + y1 * sc);

					//Antialiasing
					if (sc < tol * 0.9 && sc > tol * 1.1)
						sc = 0.9;
					else if (sc < tol)
						sc = 0.1;
					else
						sc = 1;
					//end of lens math
					let index2 = ((xx + yy * this.cW) % maxSize) << 2;
					dstdata[index++] = sc * srcdata[index2 + 0];
					dstdata[index++] = sc * srcdata[index2 + 1];
					dstdata[index++] = sc * srcdata[index2 + 2];
					index++;
				} else {
					index = index + 4;
				}
			}
		}

		//dataDst.data = dstdata;
		ctx.putImageData(dataDst, 0, 0);

		this.old.x = this.center.x;
		this.old.y = this.center.y;
	}
}
/*
		ctx.save();
		
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#fff";
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.radius, 0, pi2);
		ctx.stroke();
		ctx.closePath();

		ctx.restore();
		*/