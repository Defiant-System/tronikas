 
/**
 * <code>PolySimple</code> is a simple polygon - contains only one inner polygon.
 * <p>
 * <strong>WARNING:</strong> This type of <code>Poly</code> cannot be used for an
 * inner polygon that is a hole.
 *
 * @author  Dan Bridenbecker, Solution Engineering, Inc.
 */
 
import {
	Point,
	Rectangle,
	ArrayList } from "./utils.js";


class PolySimple {
	constructor() {
		this.m_List = new ArrayList(); // The list of Point objects in the polygon.
		this.m_Contributes = true;     // Flag used by the Clip algorithm
	}

	equals(obj) {
		if (!(obj instanceof PolySimple)) return false;

		var that = obj,
			this_num = this.m_List.size(),
			that_num = that.m_List.size(),
			this_x,
			this_y,
			this_index,
			that_x,
			that_y,
			that_index,
			that_first_index;

		if (this_num != that_num) return false;

		// WARNING: This is not the greatest algorithm.  It fails if
		// the first point in "this" poly appears more than once.
		if (this_num > 0) {
			this_x = this.getX(0);
			this_y = this.getY(0);
			that_first_index = -1;
			for (that_index = 0; (that_first_index == -1) && (that_index < that_num) ; that_index++ ) {
				that_x = that.getX(that_index);
				that_y = that.getY(that_index);
				if (this_x == that_x && this_y == that_y) {
					that_first_index = that_index;
				}
			}
			if (that_first_index == -1) return false;
			that_index = that_first_index;
			for (this_index= 0; this_index < this_num; this_index++) {
				this_x = this.getX(this_index);
				this_y = this.getY(this_index);
				that_x = that.getX(that_index);
				that_y = that.getY(that_index);

				if (this_x != that_x || this_y != that_y) return false;

				that_index++ ;
				if (that_index >= that_num) {
					that_index = 0;
				}
			}
		}
		return true;
	}
	/**
	 * Return the hashCode of the object.
	 * <p>
	 * <strong>WARNING:</strong>Hash and Equals break contract.
	 *
	 * @return an integer value that is the same for two objects
	 * whenever their internal representation is the same (equals() is true)
	 *
	 */
	hashCode() {
		var result = 17;
		result = 37 * result + this.m_List.hashCode();
		return result;
	}

	toString() {
		// Return a string briefly describing the polygon.
		return 'PolySimple: num_points='+ getNumPoints();
	}

	clear() {
		// Remove all of the points.  Creates an empty polygon.
		this.m_List.clear();
	}

	add(arg0,arg1) {
		var args = [],
			val,
			k, kl;
		args[0] = arg0;
		if (arg1) args[1] = arg1;
		
		if (args.length == 2) {
			this.addPointXY(args[0], args[1]);
		} else if (args.length == 1) {
			if (args[0] instanceof Point) this.addPoint(args[0]);
			else if (args[0] instanceof Poly) this.addPoly(args[0]);
			else if (args[0] instanceof Array) {
				for (k=0, kl=args[0].length; k<kl; k++) {
					val = args[0][k];
					this.add(val);
				}
			}
		}
	}

	addPointXY(x, y) {
		// Add a point to the first inner polygon.
		this.addPoint(new Point(x, y));
	}

	addPoint(p) {
		// Add a point to the first inner polygon.
		this.m_List.add(p);
	}

	addPoly(p) {
		// Throws IllegalStateexception if called
		throw 'Cannot add poly to a simple poly.';
	}

	isEmpty() {
		// Return true if the polygon is empty
		return this.m_List.isEmpty();
	}

	getBounds() {
		// Returns the bounding rectangle of this polygon.
		var xmin =  Number.MAX_VALUE,
			ymin =  Number.MAX_VALUE,
			xmax = -Number.MAX_VALUE,
			ymax = -Number.MAX_VALUE,
			il = this.m_List.size(),
			i = 0,
			x, y, u;
		for (; i<il; i++ ) {
			x = this.getX(i);
			y = this.getY(i);
			if (x < xmin) xmin = x;
			if (x > xmax) xmax = x;
			if (y < ymin) ymin = y;
			if (y > ymax) ymax = y;
		}
		return new Rectangle(xmin, ymin, (xmax-xmin), (ymax-ymin));
	}

	getInnerPoly(polyIndex) {
		// Returns <code>this</code> if <code>polyIndex = 0</code>, else it throws IllegalStateException.
		if (polyIndex != 0) alert('PolySimple only has one poly');
		return this;
	}

	getNumInnerPoly() {
		// Always returns 1.
		return 1;
	}

	getNumPoints() {
		// Return the number points of the first inner polygon
		return this.m_List.size();
	}

	getX(index) {
		// Return the X value of the point at the index in the first inner polygon
		return this.m_List.get(index).x;
	}

	getY(index) {
		// Return the Y value of the point at the index in the first inner polygon
		return this.m_List.get(index).y;
	}

	getPoint(index) {
		return this.m_List.get(index);
	}

	getPoints() {
		return this.m_List.toArray();
	}

	isPointInside(point) {
		var points  = this.getPoints(),
		 	j = points.length - 1,
		 	oddNodes = false,
		 	il = points.length,
		 	i = 0;
													 
		for (; i<il; i++) {
			 if (points[i].y < point.y && points[j].y >= point.y || points[j].y < point.y && points[i].y >= point.y) {
				if (points[i].x + (point.y - points[i].y) / (points[j].y - points[i].y) * (points[j].x - points[i].x) < point.x) {
					oddNodes = !oddNodes; 
				}
			}
			j = i;
		}      
		return oddNodes;
	}

	isHole() {
		// Always returns false since PolySimples cannot be holes.
		return false ;
	}

	setIsHole(isHole) {
		// Throws IllegalStateException if called.
		throw 'PolySimple cannot be a hole';
	}

	isContributing(polyIndex) {
		/**
		 * Return true if the given inner polygon is contributing to the set operation.
		 * This method should NOT be used outside the Clip algorithm.
		 *
		 * @throws IllegalStateException if <code>polyIndex != 0</code>
		 */
		if (polyIndex != 0) {
			throw 'PolySimple only has one poly';
		}
		return this.m_Contributes;
	}

	setContributing(polyIndex, contributes) {
		/**
		 * Set whether or not this inner polygon is constributing to the set operation.
		 * This method should NOT be used outside the Clip algorithm.
		 *
		 * @throws IllegalStateException if <code>polyIndex != 0</code>
		 */
		if (polyIndex != 0) {
			throw "PolySimple only has one poly";
		}
		this.m_Contributes = contributes ;
	}

	intersection(p) {
		/**
		 * Return a Poly that is the intersection of this polygon with the given polygon.
		 * The returned polygon is simple.
		 *
		 * @return The returned Poly is of type PolySimple
		 */
		return Clip.intersection( this, p, 'PolySimple');
	}

	union(p) {
		/**
		 * Return a Poly that is the union of this polygon with the given polygon.
		 * The returned polygon is simple.
		 *
		 * @return The returned Poly is of type PolySimple
		 */
		return Clip.union( this, p, 'PolySimple');
	}

	xor(p) {
		/**
		 * Return a Poly that is the exclusive-or of this polygon with the given polygon.
		 * The returned polygon is simple.
		 *
		 * @return The returned Poly is of type PolySimple
		 */
		return Clip.xor( p, this, 'PolySimple');
	}

	difference(p) {
		/**
		 * Return a Poly that is the difference of this polygon with the given polygon.
		 * The returned polygon could be complex.
		 *
		 * @return the returned Poly will be an instance of PolyDefault.
		 */
		return Clip.difference(p, this, 'PolySimple');
	}

	getArea() {
		/**
		 * Returns the area of the polygon.
		 * <p>
		 * The algorithm for the area of a complex polygon was take from
		 * code by Joseph O'Rourke author of " Computational Geometry in C".
		 */
		var ax, ay,
			bx, by,
			cx, cy,
			area = 0.0,
			tarea,
			i, il;
		if (this.getNumPoints() < 3) {
			return 0.0;
		}
		ax = this.getX(0);
		ay = this.getY(0);

		for (i=1, il=this.getNumPoints()-1; i<il ; i++ ) {
			bx = this.getX(i);
			by = this.getY(i);
			cx = this.getX(i+1);
			cy = this.getY(i+1);
			tarea = ((cx - bx)*(ay - by)) - ((ax - bx)*(cy - by));
			area += tarea;
		}
		area = 0.5 * Math.abs(area);
		return area;
	}
}

export { PolySimple };
