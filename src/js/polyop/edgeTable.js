
// EdgeTable
class EdgeTable {
	constructor() {
		this.m_List = new ArrayList();
	}
	
	addNode(x,y) {
		var node = new EdgeNode();
		node.vertex.x = x;
		node.vertex.y = y;
		this.m_List.add(node);
	}
	
	getNode (index) {
		return this.m_List.get(index);
	}
	
	FWD_MIN(i) {
		var m_List = this.m_List,
			prev = m_List.get(Clip.PREV_INDEX(i, m_List.size())),
			next = m_List.get(Clip.NEXT_INDEX(i, m_List.size())),
			ith = m_List.get(i);
		return (prev.vertex.y >= ith.vertex.y && next.vertex.y >  ith.vertex.y);
	}	  
	
	NOT_FMAX(i) {
		var m_List = this.m_List,
			next = m_List.get(Clip.NEXT_INDEX(i, m_List.size())),
			ith = m_List.get(i);
		return next.vertex.y > ith.vertex.y;
	}
	
	REV_MIN(i) {
		var m_List = this.m_List,
			prev = m_List.get(Clip.PREV_INDEX(i, m_List.size())),
			next = m_List.get(Clip.NEXT_INDEX(i, m_List.size())),
			ith = m_List.get(i);
		return prev.vertex.y > ith.vertex.y && next.vertex.y >= ith.vertex.y;
	}
	
	NOT_RMAX(i) {
		var m_List = this.m_List,
			prev = m_List.get(Clip.PREV_INDEX(i, m_List.size())),
			ith = m_List.get(i);
		return prev.vertex.y > ith.vertex.y;
	}
}
