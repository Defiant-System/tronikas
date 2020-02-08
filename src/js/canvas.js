
const CANVAS = {
	init() {
		this.canvas = window.find("#canvas");
		this.context = this.canvas[0].getContext("2d");
		
		this.width = this.canvas.prop("offsetWidth");
		this.height = this.canvas.prop("offsetHeight");
	}
}
