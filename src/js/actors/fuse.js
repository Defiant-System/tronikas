
class Fuse {
	constructor() {
		this.name = "Fuse";
		this.GAME = GAME;
		this.player = GAME.player;
		this.ctx = GAME.ctx;

		let polygon = [].concat(this.player.history);
		this.path = [polygon[0]];
		this.x = this.path[this.path.length-1][0];
		this.y = this.path[this.path.length-1][1];
		this.speed = this.player.move.max / 2;

		this.sparks = [];

		this.checkDirection(polygon);

		// temp
		// this.path = [[350,20],[350,50],[250,50],[250,170]];
		// this.x = 250;
		// this.y = 170;
	}

	destroy() {
		console.log('game-over');
		this.isDestroyed = true;

		GAME.deleteActor(this);
	}

	random(max, min) {
		return Math.random() * (max - min) + min;
	}

	randomInteger(max, min) {
		return this.random(max + 1, min) | 0;
	}

	spark(x, y) {
		let angle = this.random(0, 2 * Math.PI);
		return {
			ttl : 7,
			size: this.randomInteger(4, 7),
			dir : new Vector(Math.sin(angle) * 5, -Math.cos(angle) * 5),
			acc : new Vector(.3, .3),
			pos : new Vector(x, y)
		};
	}

	checkDirection(polygon) {
		// copy player polygon
		let len = this.path.length - 1,
			pos1 = [this.x, this.y],
			pos2,
			normal,
			pi = Math.PI;

		// reset min & max
		this.min = { x: 0, y: 0 };
		this.max = { x: 0, y: 0 };

		// add current position of the player
		polygon.push([this.player.x, this.player.y]);

		// calculate normal
		//pos2 = polygon[Math.min(len + 1, polygon.length - 1)];
		pos2 = polygon[len + 1];
		normal = (Math.atan(pos2[1] - pos1[1], pos2[0] - pos1[0]) + pi) % pi;

		if (normal === 0) {
			if (this.x < pos1[0] || this.x < pos2[0]) {
				this.dir = 2;
				this.max.x = Math.max(pos1[0], pos2[0]);
			} else {
				this.dir = 4;
				this.min.x = Math.min(pos1[0], pos2[0]);
			}
		} else {
			if (this.y > pos1[1] || this.y > pos2[1]) {
				this.dir = 1;
				this.min.y = Math.min(pos1[1], pos2[1]);
			} else {
				this.dir = 3;
				this.max.y = Math.max(pos1[1], pos2[1]);
			}
		}
	}

	update() {
		// exit if this is destoryed
		if (this.isDestroyed) return;

		// move fuse
		switch (this.dir) {
			case 1: this.y = Math.max(this.y - this.speed, this.min.y); break;
			case 2: this.x = Math.min(this.x + this.speed, this.max.x); break;
			case 3: this.y = Math.min(this.y + this.speed, this.max.y); break;
			case 4: this.x = Math.max(this.x - this.speed, this.min.x); break;
		}

		// check if fuse catched up player
		if (this.x === this.player.x && this.y === this.player.y) {
			this.destroy();
		} else if (this.x === this.max.x || this.x === this.min.x
				|| this.y === this.max.y || this.y === this.min.y) {
			this.path.push([this.x, this.y]);
		}

		// check fuse path
		let polygon = [].concat(this.player.history);
		this.checkDirection(polygon);

		// burn fuse sparks
		this.sparks.map((item, i) => {
			item.dir.multiply(item.acc);
			item.pos.add(item.dir);
			item.size -= item.size / 7;

			if (item.ttl-- < 0) {
				this.sparks.splice(i, 1);
			}
		});

		let spark = this.spark(this.x, this.y);
		this.sparks.push(spark);
	}

	render() {
		let ctx = this.ctx,
			pi2 = Math.PI * 2,
			path = this.path;

		ctx.save();
		ctx.translate(0.5, 0.5);
		ctx.globalCompositeOperation = "lighter";

		this.sparks.map(item => {
			// dot gradient
			let gradient = ctx.createRadialGradient(item.pos.x, item.pos.y, item.size*2, item.pos.x, item.pos.y, 0);
			gradient.addColorStop(0, 'transparent');
			gradient.addColorStop(0.8, '#f33');
			gradient.addColorStop(1, '#fee');

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(item.pos.x, item.pos.y, item.size, 0, pi2);
			ctx.closePath();
			ctx.fill();
		});

		ctx.lineWidth = 2;
		ctx.strokeStyle = "rgba(255,80,80,.5)";
		ctx.globalCompositeOperation = "source-over";

		ctx.beginPath();
		ctx.moveTo(path[0][0], path[0][1]);
		path.slice(1).map(point => ctx.lineTo(point[0], point[1]));
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
		

		ctx.restore();
	}
}
