let Anim = {
	init(canvas) {
		// initial values
		this.paused = false;
		this.TAU = Math.PI * 2;

		// setTimeout(() => { this.paused = true }, 300);
	},
	dispatch(event) {
		let Self = Anim,
			value;
		switch (event.type) {
			case "start":
				Self.cvs = event.canvas;
				Self.ctx = Self.cvs.getContext("2d");
				Self.width = Self.cvs.width;
				Self.height = Self.cvs.height;
				Self.dispatch({ type: "create-scene" });
				break;
			case "pause":
				Self.paused = true;
				break;
			case "resume":
				if (Self.paused && Self.ctx) {
					Self.paused = false;
					Self.draw();
				}
				break;
			case "create-scene":
				Self.maxDepth = 64;
				Self.stars = [];

				// stars
				let count = 192;
				while (count--) {
					Self.stars.push({
						x: Utils.random(-25, 25) | 0,
						y: Utils.random(-25, 25) | 0,
						z: Utils.random(1, Self.maxDepth) | 0
					});
				}

				// start rendering
				Self.draw();
				break;
		}
	},
	update(Self) {
		let halfWidth = Self.width / 2,
			halfHeight = Self.height / 2,
			stars = Self.stars,
			len = stars.length;

		while (len--) {
			stars[len].z -= 0.01;
			if (stars[len].z <= 0) {
				stars[len].x = Utils.random(-25, 25) | 0;
				stars[len].y = Utils.random(-25, 25) | 0;
				stars[len].z = Utils.random(1, Self.maxDepth) | 0;
			}
		}
	},
	draw() {
		let Self = Anim,
			cvs = Self.cvs,
			ctx = Self.ctx,
			halfWidth = Self.width >> 1,
			halfHeight = Self.height >> 1,
			stars = Self.stars,
			len = stars.length;
		// update scene
		Self.update(Self);
		// clear react
		cvs.width = Self.width;
		cvs.height = Self.height;
		
		while (len--) {
			k  = 128 / stars[len].z,
			px = stars[len].x * k + halfWidth,
			py = stars[len].y * k + halfHeight;

			if (px >= 0 && px <= Self.width && py >= 0 && py <= Self.height) {
				let alpha = (1 - stars[len].z / 48),
					size = Math.max(alpha, 0.1) + 0.45,
					c = 255 - Math.round(Math.abs(alpha * 32));
				ctx.beginPath();
				ctx.fillStyle = `rgba(${c}, ${c}, ${c}, ${alpha})`;
				ctx.arc(px, py, size, 0, Self.TAU);
				ctx.fill();
			}
		}
		
		// next tick
		if (!Self.paused) requestAnimationFrame(Self.draw);
	}
};

// auto call init
Anim.init();

// forward message / event
self.onmessage = event => Anim.dispatch(event.data);



// simple utils
let Utils = {
	// get a random number within a range
	random(min, max) {
		return Math.random() * ( max - min ) + min;
	},
	// calculate the distance between two points
	calculateDistance(p1x, p1y, p2x, p2y) {
		let xDistance = p1x - p2x,
			yDistance = p1y - p2y;
		return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
	}
};
