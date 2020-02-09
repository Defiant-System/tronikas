
// BundleState
class BundleState {
	constructor(state) {
		this.m_State = state ; // string

		this.UNBUNDLED   = new BundleState('UNBUNDLED');
		this.BUNDLE_HEAD = new BundleState('BUNDLE_HEAD');
		this.BUNDLE_TAIL = new BundleState('BUNDLE_TAIL');
	}

	toString() {
		return this.m_State;
	}
}
