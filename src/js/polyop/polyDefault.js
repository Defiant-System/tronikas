
class PolyDefault {
	constructor(isHole) {
		if (isHole == null) isHole = false;
		// Only applies to the first poly and can only be used with a poly that contains one poly
		this.m_IsHole = isHole;
		this.m_List = new ArrayList();
	}

	equals (obj) {
		// Return true if the given object is equal to this one.
		if (!(obj instanceof PolyDefault)) return false;
		var that = obj;
		if (this.m_IsHole != that.m_IsHole) return false;
		if (!equals(this.m_List, that.m_List)) return false;
		return true;
	}

	hashCode () {
		/**
		 * Return the hashCode of the object.
		 *
		 * @return an integer value that is the same for two objects
		 * whenever their internal representation is the same (equals() is true)
		 **/
		return 37 * 17 + this.m_List.hashCode();
	}

	clear() {
		// Remove all of the points.  Creates an empty polygon.
		this.m_List.clear();
	}

	add(arg0, arg1) {
		var args = [],
			arr,
			i, il;
		
		args[0] = arg0;
		if (arg1) args[1] = arg1;
		
		if (args.length == 2) {
			this.addPointXY(args[0], args[1]);
		} else if (args.length == 1) {
			if (args[0] instanceof Point) {
				this.addPoint(args[0]);	
			} else if (args[0] instanceof PolySimple) {
				this.addPoly(args[0]);
			} else if (args[0] instanceof Array) {
				arr = args[0];
				if (arr.length == 2 && arr[0] instanceof Number && arr[1] instanceof Number) {
					this.add(arr[0] ,arr[1] )
				} else {
					for (i=0, il=args[0].length; i<il; i++) {
						this.add(args[0][i]);
					}
				}
			}
		}
	}

	addPointXY(x, y) {
		/**
		 * Add a point to the first inner polygon.
		 * <p>
		 * <b>Implementation Note:</b> If a point is added to an empty PolyDefault object,
		 * it will create an inner polygon of type <code>PolySimple</code>.
		 */
		this.addPoint(new Point(x, y));
	}

	addPoint( p) {
		/**
		 * Add a point to the first inner polygon.
		 * <p>
		 * <b>Implementation Note:</b> If a point is added to an empty PolyDefault object,
		 * it will create an inner polygon of type <code>PolySimple</code>.
		 */
		var m_List = this.m_List;
		if (m_List.size() == 0) {
			m_List.add(new PolySimple());
		}
		m_List.get(0).addPoint(p);
	}

	addPoly( p) {
		/**
		 * Add an inner polygon to this polygon - assumes that adding polygon does not
		 * have any inner polygons.
		 *
		 * @throws IllegalStateException if the number of inner polygons is greater than
		 * zero and this polygon was designated a hole.  This would break the assumption
		 * that only simple polygons can be holes.
		 */
		var m_IsHole = this.m_IsHole,
			m_List = this.m_List;
		if (m_List.size() > 0 && m_IsHole) {
			throw 'ERROR : Cannot add polys to something designated as a hole.';
		}
		m_List.add(p);
	}

	isEmpty() {
		// Return true if the polygon is empty
		return this.m_List.isEmpty();
	}

	getBounds () {
		/**
		 * Returns the bounding rectangle of this polygon.
		 * <strong>WARNING</strong> Not supported on complex polygons.
		 */
		var m_List = this.m_List,
			ip;
		if (m_List.size() == 0) {
			return new Rectangle();
		} else if (m_List.size() == 1) {
			 ip = this.getInnerPoly(0);
			 return ip.getBounds();
		} else {
			 console.log('getBounds not supported on complex poly.');
		}
	}

	getInnerPoly(polyIndex) {
		// Returns the polygon at this index.
		return this.m_List.get(polyIndex);
	}

	getNumInnerPoly() {
		// Returns the number of inner polygons - inner polygons are assumed to return one here.
		return this.m_List.size();
	}

	getNumPoints () {
		// Return the number points of the first inner polygon
		return this.m_List.get(0).getNumPoints();
	}

	getX(index) {
		// Return the X value of the point at the index in the first inner polygon
		return this.m_List.get(0).getX(index);
	}

	getPoint(index) {
		return this.m_List.get(0).getPoint(index);
	}

	getPoints() {
		return this.m_List.get(0).getPoints();
	}

	isPointInside (point) {
		var m_List = this.m_List,
			i, il,
			poly;
		if (!m_List.get(0).isPointInside(point)) return false;
		
		for (i=0, il=m_List.size(); i<il; i++) {
			poly = m_List.get(i);
			if (poly.isHole() && poly.isPointInside(point)) return false;
		}
		return true;
	}

	getY (index) {
		// Return the Y value of the point at the index in the first inner polygon
		return this.m_List.get(0).getY(index) ;
	}

	isHole () {
		/**
		 * Return true if this polygon is a hole.  Holes are assumed to be inner polygons of
		 * a more complex polygon.
		 *
		 * @throws IllegalStateException if called on a complex polygon.
		 */
		if (this.m_List.size() > 1) {
			throw 'Cannot call on a poly made up of more than one poly.';
		}
		return this.m_IsHole;
	}

	setIsHole(isHole) {
		/**
		 * Set whether or not this polygon is a hole.  Cannot be called on a complex polygon.
		 *
		 * @throws IllegalStateException if called on a complex polygon.
		 */
		if (this.m_List.size() > 1) {
			throw 'Cannot call on a poly made up of more than one poly.';
		}
		this.m_IsHole = isHole;
	}

	isContributing( polyIndex) {
		/**
		 * Return true if the given inner polygon is contributing to the set operation.
		 * This method should NOT be used outside the Clip algorithm.
		 */
		return this.m_List.get(polyIndex).isContributing(0);
	}

	setContributing( polyIndex, contributes) {
		/**
		 * Set whether or not this inner polygon is constributing to the set operation.
		 * This method should NOT be used outside the Clip algorithm.
		 *
		 * @throws IllegalStateException if called on a complex polygon
		 */
		if (this.m_List.size() != 1) {
			throw 'Only applies to polys of size 1';
		}
		this.m_List.get(polyIndex).setContributing(0, contributes);
	}

	intersection(p) {
		/**
		 * Return a Poly that is the intersection of this polygon with the given polygon.
		 * The returned polygon could be complex.
		 *
		 * @return the returned Poly will be an instance of PolyDefault.
		 */
		return Clip.intersection(p, this, 'PolyDefault');
	}

	union(p) {
		/**
		 * Return a Poly that is the union of this polygon with the given polygon.
		 * The returned polygon could be complex.
		 *
		 * @return the returned Poly will be an instance of PolyDefault.
		 */
		return Clip.union(p, this, 'PolyDefault');
	}

	xor(p) {
		/**
		 * Return a Poly that is the exclusive-or of this polygon with the given polygon.
		 * The returned polygon could be complex.
		 *
		 * @return the returned Poly will be an instance of PolyDefault.
		 */
		return Clip.xor(p, this, 'PolyDefault' );
	}

	difference(p) {
		/**
		 * Return a Poly that is the difference of this polygon with the given polygon.
		 * The returned polygon could be complex.
		 *
		 * @return the returned Poly will be an instance of PolyDefault.
		 */
		return Clip.difference(p, this, 'PolyDefault');
	}

	getArea() {
		// Return the area of the polygon in square units.
		var area = 0.0,
			il = this.getNumInnerPoly(),
			i = 0,
			p,
			tarea;
		for (; i<il; i++) {
			p = this.getInnerPoly(i);
			tarea = p.getArea() * (p.isHole() ? -1.0 : 1.0);
			area += tarea;
		}
		return area;
	}

	toString() {
		// package methods
		var res = '',
			points,
			m_List = this.m_List,
			il = m_List.size(),
			i = 0,
			p,
			j, jl;
		for (; i<il; i++) {
			p = this.getInnerPoly(i);
			res += 'InnerPoly('+ i +').hole='+ p.isHole();
			points = [];
			for (j=0, jl=p.getNumPoints(); j<jl; j++) {
				points.push(new Point(p.getX(j), p.getY(j)));
			}
			points = ArrayHelper.sortPointsClockwise(points);
			for (j=0, jl=points.length; j<jl; j++) {
				res += points[j].toString();
			}
		}
		return res;
	}
}
