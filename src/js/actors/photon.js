
class Photon {
	constructor() {
		this.name = "Photon";
		this.ctx = GAME.ctx;

		this.color = '#66f';
		this.trail = 11;
		this.log = [];
		this.vectors = [];

		this.vectors.push({
			position: new Vector(100, 40),
			direction: new Vector(-1.5, 1.5),
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
		
	}

	update() {
		let available = GAME.board.available;
	}

	render() {
		let ctx = this.ctx;

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
