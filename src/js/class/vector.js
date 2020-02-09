
class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}

	sub(vector) {
		this.x -= v.x;
		this.y -= v.y;
	}

	multiply(vector) {
		if (typeof vector === 'number') {
			this.x *= vector;
			this.y *= vector;
		} else {
			this.x *= vector.x;
			this.y *= vector.y;
		}
	}

	divide(vector) {
		if (typeof vector === 'number') {
			this.x /= vector;
			this.y /= vector;
		} else {
			this.x /= vector.x;
			this.y /= vector.y;
		}
	}

	normalize() {
		var m = this.magnitude();
		if (m > 0) {
			this.divide(m);
		}
	}

	magnitude() {
		var x = this.x,
			y = this.y;
		return Math.sqrt(x * x + y * y);
	}

	limit(high) {
		if (this.magnitude() > high) {
			this.normalize();
			this.multiply(high);
		}
	}

	static reflect(n, v) {
		let d = 2 * this.dot(v, n);
		v.x -= d * n.x;
		v.y -= d * n.y;
		return v;
	}

	static subtract(v1, v2) {
		return new Vector(v1.x - v2.x, v1.y - v2.y);
	}

	static dot(v1, v2) {
		return v1.x * v2.x + v1.y * v2.y;
	}

	static getNormal(a) {
		return {
			x: Math.sin(a),
			y: -Math.cos(a)
		}
	}
}
