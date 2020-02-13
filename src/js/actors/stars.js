
class Stars {
	constructor() {
		this.name = "Stars";
		this.ctx = GAME.ctx;
		this.width = GAME.width;
		this.height = GAME.height;

		this.maxDepth = 64;
		this.stars = [];

		let count = 192;
		while (count--) {
			this.stars.push({
				x: this.randomInteger(-25, 25),
				y: this.randomInteger(-25, 25),
				z: this.randomInteger(1, this.maxDepth)
			});
		}
	}

	destroy() {
		
	}

	random(a, b) {
		return Math.random() * (b - a) + a;
	}

	randomInteger(a, b) {
		return Math.floor(this.random(a, b));
	}

	update(delta) {
		let halfWidth = this.width / 2,
			halfHeight = this.height / 2,
			stars = this.stars,
			len = stars.length;

		while (len--) {
			stars[len].z -= 0.01;

			if (stars[len].z <= 0) {
				stars[len].x = this.randomInteger(-25, 25);
				stars[len].y = this.randomInteger(-25, 25);
				stars[len].z = this.maxDepth;
			}
		}
	}

	render() {
		let _max = Math.max,
			_round = Math.round,
			_abs = Math.abs,
			ctx = this.ctx,
			pi2 = Math.PI * 2,
			halfWidth = this.width / 2,
			halfHeight = this.height / 2,
			stars = this.stars,
			len = stars.length,
			shade,
			size,
			px,
			py,
			k,
			c;

		//ctx.fillRect(0, 0, this.width, this.height);
		ctx.save();
		ctx.translate(0.5, 0.5);

		while (len--) {
			k  = 128 / stars[len].z,
			px = stars[len].x * k + halfWidth,
			py = stars[len].y * k + halfHeight;

			if (px >= 0 && px <= this.width && py >= 0 && py <= this.height) {
				shade = (1 - stars[len].z / 48),
				size = _max(shade, 0.1) + 0.45;
				c = 255 - _round(_abs(shade * 37));
				ctx.beginPath();
				ctx.fillStyle = 'rgba('+ c +','+ c +','+ c +',' + shade + ')';
				ctx.arc(px, py, size, 0, pi2);
				ctx.fill();
			}
		}

		ctx.restore();
	}
}
