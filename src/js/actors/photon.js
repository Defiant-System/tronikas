
class Photon {
	constructor() {
		this.name = "Photon";
		this.GAME = GAME;
		this.ctx = GAME.ctx;

		this.color = '#66f';
		this.trail = 11;
		this.speed = 3.5;
		this.log = [];

		this.start = {
			point: new Vector(130, 70),
			vector: new Vector(this.random(3, -3), this.random(3, -3)),
			//vector: new Vector(2, -.5),
		};
		this.end = {
			point: new Vector(200, 170),
			vector: new Vector(this.random(3, -3), this.random(3, -3)),
			//vector: new Vector(2, -1),
		};
	}

	destroy() {
		GAME.deleteActor(this);
	}

	random(max, min) {
		return Math.random() * (max - min) + min;
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
		
		if (distances.length && distances[0].distance < this.speed) {
			let collision = distances[0],
				radian = Math.atan2(collision.y1 - collision.y0, collision.x1 - collision.x0),
				normal = Vector.getNormal(radian);
			Vector.reflect(normal, vector);

			// collision sparkle
			let spark = new Sparkle(collision.x, collision.y, radian, "100,100,255");
			this.GAME.addActor(spark);
		}
	}

	update() {
       	let polygon = this.GAME.board.available,
       		length = this.start.point.distanceTo(this.end.point);
		
       	if (this.stop) return;

		if (length < 61) {
			let vB = Vector.subtract(this.start.point, this.end.point).normalize();
			this.start.vector.add(vB.scale(0.1));
			this.end.vector.sub(vB.scale(this.random(0, 1)));
		}
		if (length > 307) {
			let vB = Vector.subtract(this.start.point, this.end.point).normalize();
			this.start.vector.sub(vB.scale(this.random(0, 1)));
			this.end.vector.sub(vB.scale(0.1));
		}

		// limit vectors 
		this.start.vector.limit(this.speed);
		this.end.vector.limit(this.speed);
		this.pointBoundries(this.start.point, this.start.vector, polygon);
		this.pointBoundries(this.end.point, this.end.vector, polygon);

		// collision detect and respons - corners
		let line = [[this.start.point.x, this.start.point.y],
					[this.end.point.x, this.end.point.y]];
		for (let i=0, il=polygon.length; i<il; i++) {
			let x0 = polygon[i][0],
				y0 = polygon[i][1],
				x1 = polygon[(i+1) % il][0],
				y1 = polygon[(i+1) % il][1],
				pLine = [[x0, y0], [x1, y1]],
				collision = Polyop.lineIntersect(line, pLine);
			
			if (collision) {
				let radian = Math.atan2(y1 - y0, x1 - x0),
					normal = Vector.getNormal(radian);
				Vector.reflect(normal, this.start.vector.scale(this.random(1.25, 2)));
				Vector.reflect(normal, this.end.vector);

				// collision sparkle
				let spark = new Sparkle(collision[0], collision[1], radian, "100,100,255");
				this.GAME.addActor(spark);
			}
		}

		// move on
		this.start.point.add(this.start.vector);
		this.end.point.add(this.end.vector);

		if (!Polyop.isPointInPolygon([this.start.point.x, this.start.point.y], polygon)) {
			this.start.point.sub(this.start.vector.scale(1.6));
		}
		if (!Polyop.isPointInPolygon([this.end.point.x, this.end.point.y], polygon)) {
			this.end.point.sub(this.end.vector.scale(1.6));
		}

		// the trail
		this.log.unshift({
			x1: this.start.point.x,
			y1: this.start.point.y,
			x2: this.end.point.x,
			y2: this.end.point.y
		});
		this.log.splice(this.trail, 1e4);
	}

	render() {
		let ctx = this.ctx,
			trail = this.log.length - 1;

		ctx.save();
		ctx.strokeStyle = this.color;

		this.log.map((line, i) => {
			if (i === 0) {
				ctx.shadowColor = ctx.strokeStyle;
				ctx.shadowBlur = 20;
				ctx.lineWidth = 6;
				ctx.globalAlpha = 0.75;
				ctx.beginPath();
				ctx.moveTo(line.x1, line.y1);
				ctx.lineTo(line.x2, line.y2);
				ctx.stroke();
				
				ctx.strokeStyle = '#fff';
				ctx.lineWidth = 2;
				ctx.globalAlpha = 1;
				ctx.beginPath();
				ctx.moveTo(line.x1, line.y1);
				ctx.lineTo(line.x2, line.y2);
				ctx.stroke();
			} else {
				// the trail
				ctx.lineWidth = 1;
				ctx.globalAlpha = (trail - i) / (trail + 2);
				ctx.beginPath();
				ctx.moveTo(line.x1, line.y1);
				ctx.lineTo(line.x2, line.y2);
				ctx.stroke();
			}
		});

		ctx.restore();
	}
}
