
// LineHelper
const LineHelper = {
	equalPoint: function (p1, p2) {
		return p1[0] == p2[0] && p1[1] == p2[1];
	},
	equalVertex: function(s1, e1, s2, e2) {
		return (this.equalPoint(s1, s2) && this.equalPoint(e1, e2)) ||
				(this.equalPoint(s1, e2) && this.equalPoint(e1, s2));
	},
	distancePoints: function(p1, p2) {
		return Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]));
	},
	clonePoint: function(p) {
		return [p[0], p[1]];
	},
	cloneLine: function(line) {
		let res  = [],
			il = line.length,
			i = 0;
		for (; i<il; i++) {
			res[i] = [line[i][0], line[i][1]];
		}
		return res;
	},
	addLineToLine: function(line1, line2) {
		let il = line2.length,
			i = 0;
		for (; i<il; i++) {
			line1.push(clonePoint(line2[i]));
		}
	},
	roundPoint: function(p) {
		p[0] = Math.round(p[0]);
		p[1] = Math.round(p[1]);
	},
	pointLineDistance: function(point, line) {
		let a = point[0] - line[0][0],
			b = point[1] - line[0][1],
			c = line[1][0] - line[0][0],
			d = line[1][1] - line[0][1],
			dot = a * c + b * d,
			len_sq = c * c + d * d,
			param = -1,
			xx,
			yy,
			dx,
			dy;

		if (len_sq != 0) param = dot / len_sq;

		if (param < 0) {
			xx = line[0][0];
			yy = line[0][1];
		} else if (param > 1) {
			xx = line[1][0];
			yy = line[1][1];
		} else {
			xx = line[0][0] + param * c;
			yy = line[0][1] + param * d;
		}
		dx = point[0] - xx;
		dy = point[1] - yy;

		return Math.sqrt(dx * dx + dy * dy);
	},
	lineIntersect: function(a, b) {
		let dn = (b[1][1] - b[0][1]) * (a[1][0] - a[0][0]) - (b[1][0] - b[0][0]) * (a[1][1] - a[0][1]),
			ua,
			ub;
		if (dn === 0) return;
		
		ua = ((b[1][0] - b[0][0]) * (a[0][1] - b[0][1]) - (b[1][1] - b[0][1]) * (a[0][0] - b[0][0])) / dn;
		ub = ((a[1][0] - a[0][0]) * (a[0][1] - b[0][1]) - (a[1][1] - a[0][1]) * (a[0][0] - b[0][0])) / dn;
		if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
			return [
				a[0][0] + ua * (a[1][0] - a[0][0]),
				a[0][1] + ua * (a[1][1] - a[0][1])
			];
		}
	},
	circleIntersectLine: function(circle, line) {
		let ac = {x: circle.center.x - line[0][0], y: circle.center.y - line[0][1]},
	    	ab = {x: line[1][0] - line[0][0], y: line[1][1] - line[0][1]},
	    	ab2 = Vector.dot(ab, ab),
	    	acab = Vector.dot(ac, ab),
	    	t = acab / ab2,
	    	h;

	    t = (t < 0) ? 0 : t;
	    t = (t > 1) ? 1 : t;
	    h = {
	    	x: (ab.x * t + line[0][0]) - circle.center.x,
	    	y: (ab.y * t + line[0][1]) - circle.center.y
	    };
	    
	    if (Vector.dot(h, h) <= circle.radius * circle.radius) {
	    	let v = new Vector(circle.center.x, circle.center.y);
	    	v.add(h);
	    	return v;
	    }
	}
};
