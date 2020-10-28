/*global $ */
/*global THREE */
export default class Calculator {
	constructor(app) {
		this.app = app;
		this.speedInputDirect;
		this.speedInputSlider;
	}
	init() {
		$("#calculator").draggable({
			containment: "document",
		});
		$(".calc-close").click(function () {
			$(this).parent().hide();
		});
		// $("#calcBtn").click(function () {
		// 	$("#calculator").show();
		// });
		const speedInputDirect = document.getElementById("shipSpeedDirect");
		const speedInputSlider = document.getElementById("shipSpeedSlider");
		speedInputSlider.onmousemove = function (e) {
			speedInputDirect.value = speedInputSlider.value;
		};
		speedInputDirect.onkeyup = function () {
			speedInputSlider.value = speedInputDirect.value;
		};
		this.speedInputDirect = speedInputDirect;
		this.speedInputSlider = speedInputSlider;
	}
}
