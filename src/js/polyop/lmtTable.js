
// LmtTable
class LmtTable {
	constructor() {
		this.top_node;
	}

	print() {
		var n = 0,
			lmt = this.top_node,
			edge;
		while (lmt != null) {
			n++;
			lmt = lmt.next;
		}
	}
}
