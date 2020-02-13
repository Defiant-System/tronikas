
class Nebula {
	constructor() {
		this.name = "Nebula";
		this.ctx = GAME.ctx;
		this.width = GAME.width;
		this.height = GAME.height;

		// offscreen canvas
		this.noiseCvs = document.createElement("canvas");
		this.noiseCtx = this.noiseCvs.getContext("2d");
		this.noiseCvs.width = this.width;
		this.noiseCvs.height = this.height;
		// the noise
		this.noise = this.makeOctaveNoise(8);
		this.particles = [];

		this.generateImage();
	}

	destroy() {
		
	}

	random(max, min) {
		return Math.random() * (max - min) + min;
	}

	randomInteger(max, min) {
		return this.random(max + 1, min) | 0;
	}

	getNoise(x, y, channel) {
		return this.noise.data[(~~x + ~~y * this.width) * 4 + channel] / 127 - 1.0;
	}

	fuzzy(range, base) {
		return (base || 0) + (Math.random() - 0.5) * range * 2;
	}

	makeNoise() {
		let _random = Math.random,
			width = this.width,
			height = this.height,
			imgData = this.noiseCtx.getImageData(0, 0, width, height),
			data = imgData.data;

		for(let i=0, il=data.length; i<il; i+=4){
			data[i] = _random() * 255;
			data[i+1] = _random() * 255;
			data[i+2] = _random() * 255;
			data[i+3] = 255;
		}
		this.noiseCtx.putImageData(imgData, 0, 0);
	}

	makeOctaveNoise(octaves) {
		let cvs = document.createElement("canvas"),
			ctx = cvs.getContext("2d"),
			width = this.width,
			height = this.height;
		
		cvs.width = width;
		cvs.height = height;

		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, width, height);
		ctx.globalAlpha = 1 / octaves;
		ctx.globalCompositeOperation = "lighter";

		for(let i=0; i<octaves; i++){
			this.makeNoise(width>>i, height>>i);
			ctx.drawImage(this.noiseCvs, 0, 0, width, height);
		}
		return { cvs, ctx, data: ctx.getImageData(0, 0, width, height).data };
	}

	generateImage() {
		let ctx = this.noise.ctx,
			xmin = this.width * .2,
			xmax = xmin + this.width * .6,
			ymin = this.height * .35,
			ymax = ymin + this.height * .3,
			color = ["rgb(120, 20, 20)", "rgb(20, 60, 10)", "rgb(10, 20, 80)", "rgb(40, 30, 10)"],
			pi2 = Math.PI * 2,
			len = 50;

		while (len--) {
			let x = this.randomInteger(xmin, xmax),
				y = this.randomInteger(ymin, ymax);
			this.addParticles(x + (len * 2), y, 0);
			this.addParticles(x + len, y + len, 1);
			this.addParticles(x + len, y - (len * 2), 2);
			this.addParticles(x - len, y + len, 4);
		}

		ctx.clearRect(0, 0, this.width, this.height);
		ctx.globalAlpha = 1.0;
		ctx.globalCompositeOperation = "lighter";

		let particles = this.particles;
		while (particles.length) {
	        let p = particles[0];
			p.vx = p.vx * 0.8 + this.getNoise(p.x, p.y, 0) * 4;
			p.vy = p.vy * 0.8 + this.getNoise(p.x, p.y, 1) * 4;
			p.x += p.vx;
			p.y += p.vy;
			p.age++;

			ctx.fillStyle = color[p.color % color.length];
	        ctx.beginPath();
	        ctx.arc(p.x, p.y, .5, 0, pi2, true);
	        ctx.closePath();
	        ctx.fill();

	        if (p.age > 100) particles.shift();
		}
		
		//this.image = ctx.getImageData(0, 0, this.width, this.height);
		this.image = this.noise.cvs;
	}

	addParticles(x, y, color) {
		let count = 10;
		while (count--) {
			this.particles.push({
				x, y, color,
				vx: this.fuzzy(20.0),
				vy: this.fuzzy(20.0),
				age: 0
			});
		}
	}

	update() {
		
	}

	render() {
		let ctx = this.ctx;

		ctx.save();

		//ctx.globalCompositeOperation = "source-over";
		ctx.drawImage(this.image, 0, 0);
		//ctx.putImageData(this.image, 0, 0);

		ctx.restore();
	}
}
