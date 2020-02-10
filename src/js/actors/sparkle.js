
class Sparkle {
	constructor(x, y, direction, color) {
		this.name = "Sparkle";
		this.ctx = GAME.ctx;
		this.rays = [];
		this.ttl = 20;
		this.rgb = color || "200,100,0";

		let len = 23,
			pi = Math.PI,
			pih = pi/2,
			pi2 = 2 * pi,
			angle = this.random(0, pi2);
		
		while (len--) {
			switch (direction) {
				case 0: angle = this.random(pih, -pih) + pi; break;
				case pih: angle = this.random(pi, pi2); break;
				case pi: angle = this.random(-pih, pih); break;
				case -pih: angle = this.random(0, pi); break;
			}
			this.rays.push({
				size: 2,
				ttl : this.randomInteger(this.ttl - 5, this.ttl + 5),
				dir : new Vector(Math.sin(angle) * 4, - Math.cos(angle) * 4),
				acc : new Vector(this.random(.75, .85), this.random(.75, .85)),
				pos : new Vector(x, y)
			});
		}
	}

	destroy() {
		GAME.deleteActor(this);
	}

	random(a, b) {
		return Math.random() * (b - a) + a;
	}

	randomInteger(a, b) {
		return Math.floor(this.random(a, b));
	}

	update() {
		let len = this.rays.length,
			item;
		while (len--) {
			item = this.rays[len];
			item.dir.multiply(item.acc);
			item.pos.add(item.dir);

			if (item.ttl-- < 0) {
				this.rays.splice(len, 1);
			}
		}
		if (!this.rays.length) {
			this.destroy();
		}
	}

	render() {
		let ctx = this.ctx,
			len = this.rays.length,
			pi2 = Math.PI * 2,
			item,
			alpha;

		// draw sparks
		ctx.save();
		ctx.globalCompositeOperation = 'lighter';

		while (len--) {
			item = this.rays[len];
			alpha = item.ttl / (this.ttl + 5);
			ctx.fillStyle = `rgba(${this.rgb},${alpha})`;
			ctx.beginPath();
			ctx.arc(item.pos.x, item.pos.y, item.size, 0, pi2);
			ctx.closePath();
			ctx.fill();
		}

		ctx.restore();
	}
}
