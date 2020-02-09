
import {
	Point,
	Rectangle,
	EdgeNode,
	ItNode,
	LmtNode,
	StNode,
	VertexNode,
	ArrayList,
	ArrayHelper } from "./utils.js";

import { LineHelper } from "./lineHelper.js";


const Polyop = {
	...LineHelper,
	getArea: function(vx) {
		let segm = createSegment(vx);
		return segm.getArea();
	},
	clip: function(operation, vx1, vx2) {
		let segm1 = createSegment(vx1),
			segm2 = createSegment(vx2),
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

export { Polyop }
