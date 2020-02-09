
ant_require("./utils.js");
ant_require("./aetTree.js");
ant_require("./operationType.js");
ant_require("./clip.js");
ant_require("./itNodeTable.js");
ant_require("./polygonNode.js");
ant_require("./polySimple.js");
ant_require("./polyDefault.js");
ant_require("./lineHelper.js");
ant_require("./lmtTable.js");
ant_require("./scanBeamTree.js");
ant_require("./edgeTable.js");
ant_require("./bundleState.js");
ant_require("./topPolygonNode.js");


const Polyop = {
	...LineHelper,
	Clip,
	createSegment: function(vx) {
		let res = new PolyDefault(),
			il = vx.length,
			i = 0;
		for(; i<il; i++) {
			res.addPoint(new Point(vx[i][0], vx[i][1]));
		}
		return res;
	},
	getArea: function(vx) {
		let segm = this.createSegment(vx);
		return segm.getArea();
	},
	clip: function(operation, vx1, vx2) {
		let segm1 = this.createSegment(vx1),
			segm2 = this.createSegment(vx2),
			diff = segm1[operation](segm2),
			num = diff.getNumInnerPoly(),
			n = 0,
			innerPoly,
			ret = [];
		for (; n<num; n++) {
			innerPoly = diff.getInnerPoly(n);
			
			ret.push({
				vertices: getVertices(innerPoly),
				isHole: innerPoly.isHole()
			});
		}
		return ret;
	},
	isPointInPolygon: function(point, poly) {
		let x = point[0],
			y = point[1],
			i, il, j,
			xi, yi,
			xj, yj,
			inside = false,
			intersect;
		for (i=0, il=poly.length, j=poly.length-1; i<il; j=i++) {
			xi = poly[i][0];
			yi = poly[i][1];
			xj = poly[j][0];
			yj = poly[j][1];
			intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}
		return inside;
	}
}
