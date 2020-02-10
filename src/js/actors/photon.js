
class Photon {
	constructor() {
		this.name = "Photon";
		this.GAME = GAME;
		this.ctx = GAME.ctx;

		this.color = '#66f';
		this.trail = 11;
		this.log = [];
		this.vectors = [];

		this.vectors.push({
			position: new Vector(100, 40),
			direction: new Vector(-2, 2.5),
		});
		this.vectors.push({
			position: new Vector(200, 170),
			direction: new Vector(1.5, -2),
		});

		this.log.unshift({
			x1: this.vectors[0].position.x,
			y1: this.vectors[0].position.y,
			x2: this.vectors[1].position.x,
			y2: this.vectors[1].position.y
		});
	}

	destroy() {
		GAME.deleteActor(this);
	}

	update() {
		let available = this.GAME.board.available,
			px0 = this.vectors[0].position.x + this.vectors[0].direction.x,
			py0 = this.vectors[0].position.y + this.vectors[0].direction.y,
			px1 = this.vectors[1].position.x + this.vectors[1].direction.x,
			py1 = this.vectors[1].position.y + this.vectors[1].direction.y,
			line = [[px0, py0], [px1, py1]],
			line2, d0, d1,
			x0, y0, x1, y1,
			col = [],
			pos;

		for (let i=0, il=available.length; i<il; i++) {
			x0 = available[i][0];
			y0 = available[i][1];
			x1 = available[(i+1) % il][0];
			y1 = available[(i+1) % il][1];

			line2 = [[x0, y0], [x1, y1]];
			pos = Polyop.lineIntersect(line, line2);

			if (pos) {
				d0 = Polyop.distancePoints(pos, line[0]);
				d1 = Polyop.distancePoints(pos, line[1]);
				col.push({
					pos,
					rad: Math.atan2(y1 - y0, x1 - x0),
					int: d1 > d0 ? 0 : 1
				});
			}
		}

		if (col.length === 1) {
			let i = col[0].int,
				normal = Vector.getNormal(col[0].rad);
			Vector.reflect(normal, this.vectors[i].direction);
			this.vectors[i].position.x = col[0].pos[0];
			this.vectors[i].position.y = col[0].pos[1];

			// collision sparkle
			let spark = new Sparkle(col[0].pos[0], col[0].pos[1], col[0].rad, "100,100,255");
			this.GAME.addActor(spark);
			return;
		}

		if (Polyop.isPointInPolygon([px0, py0], available) && Polyop.isPointInPolygon([px1, py1], available)) {
			this.vectors[0].position.add( this.vectors[0].direction );
			this.vectors[1].position.add( this.vectors[1].direction );
		}

		// the trail
		this.log.unshift({
			x1: this.vectors[0].position.x,
			y1: this.vectors[0].position.y,
			x2: this.vectors[1].position.x,
			y2: this.vectors[1].position.y
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
