/*global $ */
/*global THREE */
const DEFAULT_MSG = [
	"Choose start point",
	"Choose end point"
];
const IDs = [
	"selPoint0",
	"selPoint1"
]
export default class Calculator {
	constructor(app) {
		this.app = app;
		this.point1;
		this.point2;
		this.shipSpeed;
		this.selecting = -1;
		this.pointTextElms = [];
	}
	init() {
		$("#calculator").draggable({
			containment: "document",
		});
		$(".calc-close").click(function () {
			$(this).parent().hide();
		});
		$("#calcBtn").click(function () {
			$("#calculator").show();
		});
		const speedInputDirect = document.getElementById("shipSpeedDirect");
		const speedInputSlider = document.getElementById("shipSpeedSlider");
		speedInputSlider.value = 150;
		speedInputDirect.value = 150;
		const self = this;
		speedInputSlider.onmousemove = function (e) {
			speedInputDirect.value = speedInputSlider.value;
			self.updateSpeed(parseInt(speedInputDirect.value));
		};
		speedInputDirect.onkeyup = function () {
			speedInputSlider.value = speedInputDirect.value;
			self.updateSpeed(parseInt(speedInputDirect.value));
		};
		this.speedInputDirect = speedInputDirect;
		this.speedInputSlider = speedInputSlider;
		IDs.forEach((btnId, pointNum) => {
			const btn = document.getElementById(btnId);
			const textElm = document.getElementById(`selectedPoint${pointNum}`);
			this.pointTextElms.push(textElm);
			btn.onclick = function () {
				self.updateSelecting(pointNum);
			}
		});
	}
	updateSelecting(newSelNum) {
		this.selecting = newSelNum;
		console.log(this.selecting);
	}
	updateSpeed(val) {
		this.shipSpeed = val;
	}
}