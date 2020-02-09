
// ItNodeTable
class ItNodeTable {
	constructor() {
		this.top_node;
	}
	
	build_intersection_table(aet, dy) {
		var st = null,
			edge;
		/* Process each AET edge */
		for (edge = aet.top_node; edge != null; edge = edge.next) {
			if (edge.bstate[Clip.ABOVE] == BundleState.BUNDLE_HEAD || edge.bundle[Clip.ABOVE][Clip.CLIP] != 0 || edge.bundle[Clip.ABOVE][Clip.SUBJ] != 0) {
				st = Clip.add_st_edge(st, this, edge, dy);
			}
		}
	}
}
