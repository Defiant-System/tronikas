
class Board {
	constructor(GAME) {
		this.name = "Board";
		this.margin = 20;
		this.ctx = GAME.ctx;
		this.width = GAME.width - (this.margin * 2);
		this.height = GAME.height - (this.margin * 2);
	}

	destroy() {
		
	}

	update() {
		
	}

	render() {
		let ctx = this.ctx;

		ctx.save();
		ctx.translate(0.5, 0.5);
		ctx.strokeStyle = "#ffffff"
		ctx.beginPath();
		ctx.rect(this.margin, this.margin, this.width, this.height);
		ctx.stroke();
		ctx.restore();
	}
}
