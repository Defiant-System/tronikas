
class Electric {
	constructor(startPoint, endPoint, parent) {
		this.name = "Electric";
		this.ctx = GAME.ctx;

		this.startPoint = startPoint || new Vector(100, 100);
		this.endPoint = endPoint || new Vector(240, 240);
		this.children = [];

		this.color = "rgba(255, 255, 255, 1)";
		this.blurColor = "rgba(180, 180, 255, 0.55)";
		this.blur = 21;
		this.speed = 0.025;
		this.amplitude = .75;
		this.lineWidth = 3;
		this.points = null;
		this.off = 0;
		this.simplexNoise = new SimplexNoise;

		if (!parent) {
			for (let i=0; i<2; i++) {
				let child = new Electric(this.startPoint, this.endPoint, this);
				this.children.push(child);
			}
		}
	}

	destroy() {
		if (this._timeoutId) {
			clearTimeout(this._timeoutId);
		}
		this.simplexNoise = null;
	}

	random(max, min) {
		return Math.random() * (max - min) + min;
	}


	randomInteger(max, min) {
		return this.random(max + 1, min) | 0;
	}

	noise(v) {
		let amp = 1,
			sum = 0,
			f = 1;
		for (let i=0; i<6; ++i) {
			amp *= 0.5;
			sum += amp * (this.simplexNoise.noise2D(v * f, 0) + 1) * 0.5;
			f *= 2;
		}
		return sum;
	}

	update() {
		let _sin = Math.sin,
			_cos = Math.cos,
			_pi = Math.PI,
			length = this.startPoint.distanceTo(this.endPoint),
			step = length / 5,
			normal = this.endPoint.clone().sub(this.startPoint).normalize().scale(length / step),
			radian = normal.angle(),
			sinv   = _sin(radian),
			cosv   = _cos(radian),
			points = this.points = [],
			off    = this.off += this.random(this.speed, this.speed * 0.2),
			waveWidth = (this.parent ? length * 1.25 : length) * this.amplitude;

		
		for (let i=0, len=step+1; i<len; i++) {
			let n = i / 60,
				av = waveWidth * this.noise(n - off, 0) * 0.5,
				ax = sinv * av,
				ay = cosv * av,
				bv = waveWidth * this.noise(n + off, 0) * 0.5,
				bx = sinv * bv,
				by = cosv * bv,
				m = _sin((_pi * (i / (len - 1)))),
				x = this.startPoint.x + normal.x * i + (ax - bx) * m,
				y = this.startPoint.y + normal.y * i - (ay - by) * m;

			points.push(new Vector(x, y));
		}

		this.children.map(child => {
			child.color     = this.color;
			child.speed     = this.speed * 1.35;
			child.amplitude = this.amplitude;
			child.lineWidth = this.lineWidth * 0.75;
			child.blur      = this.blur;
			child.blurColor = this.blurColor;
			child.update();
		});
	}

	render() {
		let ctx = this.ctx,
			points = this.points,
			len = points.length,
			pi2 = Math.PI * 2;

		ctx.save();

		// Blur
		if (this.blur) {
			ctx.save();
			ctx.globalCompositeOperation = "lighter";
			ctx.fillStyle   = "rgba(0, 0, 0, 1)";
			ctx.shadowBlur  = this.blur;
			ctx.shadowColor = this.blurColor;
			ctx.beginPath();

			points.map((point, i) => {
				let d = len > 1 ? point.distanceTo(points[i === len - 1 ? i - 1 : i + 1]) : 0;
				ctx.moveTo(point.x + d, point.y);
				ctx.arc(point.x, point.y, d, 0, Math.PI * 2, false);
			});
			ctx.fill();
			ctx.restore();
		}

		ctx.save();
		ctx.lineWidth = this.random(this.lineWidth, 0.5);
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		points.map((point, i) => ctx[i === 0 ? "moveTo" : "lineTo"](point.x, point.y));
		ctx.stroke();
		ctx.restore();

		/*
		// start dot
		ctx.save();
        ctx.beginPath();
		ctx.arc(this.startPoint.x, this.startPoint.y, 1.5, 0, pi2);
		ctx.fill();

		// end dot
        ctx.beginPath();
		ctx.arc(this.endPoint.x, this.endPoint.y, 1.5, 0, pi2);
		ctx.fill();
		ctx.restore();
		*/

		// Draw children
		this.children.map(child => child.render());

		ctx.restore();
	}
}
