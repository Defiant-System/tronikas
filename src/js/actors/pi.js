
class Pi {
	constructor() {
		this.name = "Pi";
		this.GAME = GAME;
		this.ctx = GAME.ctx;

		this.colors = ["#00f", "#f0f", "#f00", "#ff0", "#0f0", "#0ff"];
		this.angle = 0;
		this.radius = 37;
		this.thickness = 3;
		this.rotation = 0.006;

		this.center = new Vector(300, 300);
		this.direction = new Vector(2, 2);
	}

	destroy() {
		
	}

	update() {
		var available = this.GAME.board.available,
			len,
			x0, y0, x1, y1,
			line, collision,
			radian, normal;

		for (let i=0, il=available.length; i<il; i++) {
			x0 = available[i][0];
			y0 = available[i][1];
			x1 = available[(i+1) % il][0];
			y1 = available[(i+1) % il][1];

			line = [[x0, y0], [x1, y1]];
			collision = Polyop.circleIntersectLine(this, line);

			if (collision) {
				radian = Math.atan2(y1 - y0, x1 - x0);
				normal = Vector.getNormal(radian);
				Vector.reflect(normal, this.direction);
				//this.rotation *= -1;
			}
		}

		// rotate PI
		this.angle += this.rotation;
		// move PI
		this.center.add(this.direction);
	}

	render() {
		let ctx = this.ctx,
			pi2 = Math.PI * 2,
			_sin = Math.sin,
			_cos = Math.cos,
			radius = this.radius - this.thickness,
			pLen,
			start = 0,
			gradient,
			startColor,
			endColor,
			xStart, xEnd,
			yStart, yEnd;

		ctx.save();
		ctx.translate(this.center.x, this.center.y);

		ctx.rotate(this.angle * -1.5 * pi2);
		ctx.lineWidth = this.thickness - 1;
		ctx.shadowColor = "rgba(255,255,255,0.75)";
		ctx.shadowBlur = this.thickness;
		
		for (let i=0, il=this.thickness * 3; i<il; i++) {
			ctx.strokeStyle = `rgba(255,255,255,${ 1 - (i / il) })`;
			pLen = (i * this.thickness) + (i*29/il);
			ctx.setLineDash([pLen + this.thickness, (radius * 2) - pLen]);
			ctx.beginPath();
			ctx.arc(0, 0, radius, 0, pi2);
			ctx.stroke();
		}

		ctx.rotate(this.angle * 2 * pi2);
		ctx.shadowBlur = 0;
		ctx.lineWidth = this.thickness * 3;
		ctx.globalCompositeOperation = 'source-atop';
		
		pLen = pi2 / this.colors.length;
		for (let i=0, il=this.colors.length; i<il; i++) {
			startColor = this.colors[i];
			endColor = this.colors[(i + 1) % il];
			xStart = _cos(start) * radius;
			xEnd = _cos(start + pLen) * radius;

			yStart = _sin(start) * radius;
			yEnd = _sin(start + pLen) * radius;

			gradient = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
			gradient.addColorStop(0.0, startColor);
			gradient.addColorStop(1.0, endColor);

			ctx.strokeStyle = gradient;
			ctx.beginPath();
			ctx.arc(0, 0, radius, start, start + pLen);
			ctx.stroke();
			ctx.closePath();

			start += pLen;
		}

		ctx.restore();
	}
}
