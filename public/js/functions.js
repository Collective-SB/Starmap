//This file holds a bunch of helper functions so that they can be refrenced in many modules if need be.

export function lerp(start, stop, amt) {
	return amt * (stop - start) + start;
}

export function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result) {
		return {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
		};
	}
}
export function map(val, min0, max0, min1, max1) {
	return min1 + ((max1 - min1) / (max0 - min0)) * (val - min0);
}

export function constrain(v, min, max) {
	return Math.min(Math.max(v, min), max);
}

export function copyToClipboard(str) {
	const el = document.createElement("textarea");
	el.value = str;
	el.setAttribute("readonly", "");
	el.style.position = "absolute";
	el.style.left = "-9999px";
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
}
export function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
export function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}
export function eraseCookie(name) {
	document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export const tubeLine = function (origin, destination, weight, color) {
	weight = weight ? weight : 1;
	color = color ? color : "#000";
	this.origin = origin;
	this.destination = destination;
	this.weight = weight;
	this.color = color;
};
tubeLine.prototype.getObject3D = function () {
	var line = new THREE.CatmullRomCurve3([
		new THREE.Vector3(this.origin[0], this.origin[1], this.origin[2]),
		new THREE.Vector3(
			this.destination[0],
			this.destination[1],
			this.destination[2]
		),
	]);
	var geometryTube = new THREE.TubeGeometry(
		line, //path
		1, //segments
		this.weight, //radius
		8, //radiusSegments
		false //closed
	);
	var material = new THREE.MeshBasicMaterial({
		color: this.color,
		wireframe: false,
		// transparent: true,
		//opacity:0.5
	});
	var object3d = new THREE.Mesh(geometryTube, material);
	return object3d;
};
