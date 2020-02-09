
// OperationType
class OperationType {
	constructor(type) {
		this.m_Type = type;

		this.GPC_DIFF  = new OperationType('Difference');
		this.GPC_INT   = new OperationType('Intersection');
		this.GPC_XOR   = new OperationType('Exclusive or');
		this.GPC_UNION = new OperationType('Union');
	}
}
