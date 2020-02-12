
class Electric {
	constructor(parent, speed, lineWidth, amplitude, color) {
		this.name = "Electric";
		this.GAME = GAME;
		this.ctx = GAME.ctx;

		this.parent = parent;
		this.color = `rgba(${ color || "255, 255, 255" }, 1)`;
		this.blurColor = "rgba(180, 180, 255, 0.55)";
		this.blur = 21;
		this.speed = speed || 0.025;
		this.lineWidth = lineWidth || 3;
		this.amplitude = amplitude || 0.75;
		this.points = null;
		this.off = 0;
		this.simplexNoise = new SimplexNoise;

		if (!parent) {
			this.startPoint = new Vector(40, 40);
			this.endPoint = new Vector(160, 110);
			this.startVector = new Vector(this.random(.5, -.5), this.random(.5, -.5)).normalize();
			this.endVector = new Vector(this.random(.5, -.5), this.random(.5, -.5)).normalize();

			this.children = [...Array(2)].map(i =>
				new Electric(this, 0.025, 2, 0.65, "230, 230, 255"));
		}
	}

	destroy() {
		
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

	pointBoundries(point, vector, polygon) {
		let vExtended = vector.clone().normalize().multiply(1e4),
			dLine = [[point.x, point.y], [vExtended.x, vExtended.y]],
			distances = [];

		for (let i=0, il=polygon.length; i<il; i++) {
			let x0 = polygon[i][0],
				y0 = polygon[i][1],
				x1 = polygon[(i+1) % il][0],
				y1 = polygon[(i+1) % il][1],
				line = [[x0, y0], [x1, y1]],
				collision = LineHelper.lineIntersect(dLine, line),
				dVector,
				distance;
			
			if (collision) {
				dVector = { x: collision[0], y: collision[1] };
				distance = point.distanceTo(dVector);
				distances.push({ ...dVector, x0, y0, x1, y1, distance});
			}
		}
		// sort distances
		distances.sort((a, b) => a.distance - b.distance);
		
		if (distances.length && distances[0].distance <= 3) {
			let radian = Math.atan2(distances[0].y1 - distances[0].y0, distances[0].x1 - distances[0].x0),
				normal = Vector.getNormal(radian);
			Vector.reflect(normal, vector);
		}
	}

	update() {
		let _sin = Math.sin,
			_cos = Math.cos,
			_pi = Math.PI,
			parent = this.parent,
			startPoint = parent ? parent.startPoint : this.startPoint,
			endPoint = parent ? parent.endPoint : this.endPoint,
			length = startPoint.distanceTo(endPoint),
			step = length / 4,
			normal = endPoint.clone().sub(startPoint).normalize().scale(length / step),
			radian = normal.angle(),
			sinv   = _sin(radian),
			cosv   = _cos(radian),
			points = this.points = [],
			off    = this.off += this.random(this.speed, this.speed * 0.2),
			waveWidth = (parent ? length * 1.25 : length) * this.amplitude;

		
		for (let i=0, len=step; i<len; i++) {
			let n = i / 60,
				av = waveWidth * this.noise(n - off, 0) * 0.5,
				ax = sinv * av,
				ay = cosv * av,
				bv = waveWidth * this.noise(n + off, 0) * 0.5,
				bx = sinv * bv,
				by = cosv * bv,
				m = _sin((_pi * (i / (len - 1)))),
				x = startPoint.x + normal.x * i + (ax - bx) * m,
				y = startPoint.y + normal.y * i - (ay - by) * m;

			points.push(new Vector(x, y));
		}
		points.push(endPoint.clone());
		
		if (!parent) {
       		let polygon = this.GAME.board.available,
       			length = this.startPoint.distanceTo(this.endPoint);

       		if (length < 100) {
       			let vBrake = Vector.subtract(this.startPoint, this.endPoint).normalize();
       			this.startVector.add(vBrake.scale(0.03)).limit(1.5);
       			this.endVector.sub(vBrake.scale(0.015)).limit(1.5);
       		}
       		if (length > 260) {
       			let vBrake = Vector.subtract(this.startPoint, this.endPoint).normalize();
       			this.startVector.sub(vBrake.scale(0.03)).limit(1.5);
       			this.endVector.sub(vBrake.scale(0.015)).limit(1.5);
       		}
       		// if (this.startVector.magnitude() > 3) this.startVector.normalize().scale(3);
       		// if (this.endPoint.magnitude() > 3) this.endPoint.normalize().scale(3);


			this.pointBoundries(this.startPoint, this.startVector, polygon);
			this.pointBoundries(this.endPoint, this.endVector, polygon);

			this.startPoint.add(this.startVector);
			this.endPoint.add(this.endVector);
			this.children.map(child => child.update());
		}
	}

	render() {
		let ctx = this.ctx,
			points = this.points,
			len = points.length,
			pi2 = Math.PI * 2;

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
		if (this.children) {
			this.children.map(child => child.render());
		}
	}
}
