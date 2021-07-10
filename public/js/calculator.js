/*global $ */
/*global THREE */ //Add commas into a string
function formatNum(value) {
	const numChars = Math.floor(value).toString().split("").reverse();
	let ret = "";
	let lastCom = -1;
	for (var i = 0; i < numChars.length; i++) {
		ret = numChars[i] + ret;
		if (i - lastCom > 2 && i != numChars.length - 1) {
			lastCom = i;
			ret = "," + ret;
		}
	}
	return ret;
}

function formatTime(value) {
	if (value.length == 1) {
		return "0" + value;
	}
	return value;
}
const IDs = ["selPoint0", "selPoint1"];
export default class Calculator {
	constructor(app) {
		this.app = app;
		this.shipSpeed = 150;
		this.selecting = -1;
		this.points = [];
		this.pointTextElms = [];
		this.shown = false;
	}
	init() {
		const self = this;
		$("#calculator").draggable({
			containment: "document",
			cancel: ".no-drag",
		});
		$(".calc-close").click(function () {
			self.hide.call(self);
			$(this).parent().hide();
		});
		$("#calcBtn").click(function () {
			if (!self.shown) {
				$("#calculator").show();
				self.shown = true;
			} else {
				self.hide.call(self);
				$("#calculator").hide();
			}
		});
		const speedInputDirect = document.getElementById("shipSpeedDirect");
		const speedInputSlider = document.getElementById("shipSpeedSlider");
		speedInputSlider.value = 150;
		speedInputDirect.value = 150;
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
				self.updateSelecting.call(self, pointNum);
			};
		});
	}
	updateSelecting(newSelNum) {
		this.pointTextElms.forEach((elm, idx) => {
			if (newSelNum == idx) {
				elm.innerText = "Selecting";
			} else {
				elm.innerText = this.points[idx] ?
					this.points[idx].info.name :
					"None Selected";
			}
		});
		this.selecting = newSelNum;
	}
	handlePointClick(point) {
		if (this.selecting > -1) {
			this.points[this.selecting] = point;
			//Flow logic, if no end point default to selecting end point, otherwise go back to start state and do nothing
			this.updateSelecting(this.selecting == 0 && !this.points[1] ? 1 : -1);
			this.updateValues();
		}
	}
	updateSpeed(val) {
		const prevShipSpeed = this.shipSpeed;
		this.shipSpeed = val;
		if (prevShipSpeed != this.shipSpeed) this.updateValues();
	}
	hide() {
		this.app.sceneObjs.scene.remove(this.app.pointManager.connectorLine);
		this.shown = false;
	}
	updateValues() {
		if (!this.points[0] || !this.points[1]) return;
		var points = [];
		points.push(new THREE.Vector3(0, 0, 0));
		points.push(
			new THREE.Vector3(
				this.points[0].position.x - this.points[1].position.x,
				this.points[0].position.y - this.points[1].position.y,
				this.points[0].position.z - this.points[1].position.z
			)
		);
		var geometry = new THREE.BufferGeometry().setFromPoints(points);
		var material = new THREE.LineBasicMaterial({
			color: 0x0000ff,
		});
	
		
		var line = new THREE.Line(geometry, material);
		line.position.set(
			this.points[1].position.x,
			this.points[1].position.y,
			this.points[1].position.z
		);
		this.app.sceneObjs.scene.remove(this.app.pointManager.connectorLine);
		this.app.pointManager.connectorLine = line;
		this.app.sceneObjs.scene.add(line);

		const p1 = new THREE.Vector3(
			this.points[0].position.x,
			this.points[0].position.y,
			this.points[0].position.z
		);
		const p2 = new THREE.Vector3(
			this.points[1].position.x,
			this.points[1].position.y,
			this.points[1].position.z
		);
		const d = p1.distanceTo(p2);

		const t = d / this.shipSpeed;

		const hrs = formatTime(Math.floor(t / 3600).toString());
		const mins = formatTime(Math.floor((t / 60) % 60).toString());
		const secs = formatTime(Math.floor(t % 60).toString());
		document.getElementById("calc-dist").innerText = `Distance: ${formatNum(
			d
		)}m`;
		document.getElementById(
			"calc-time"
		).innerText = `Estimated Traval Time: ${hrs}:${mins}:${secs}`;
	}
	setPoints(point0, point1) {
		this.points = [point0, point1];
		this.updateSelecting(-1);
		this.updateValues();
		$("#calculator").show();
	}
}