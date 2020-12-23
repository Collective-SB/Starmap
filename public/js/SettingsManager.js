/*global $ */
/*global THREE */
const BUTTONS = ["LEFT", "MIDDLE", "RIGHT"];
const SETTINGS_DEF = [{
		id: "panSelect",
		default: 2,
		prop: "value",
		set: function (val) {
			this.cameraController.orbitCtrl.mouseButtons[BUTTONS[parseInt(val)]] =
				THREE.MOUSE.PAN;
		},
	},
	{
		id: "rotSelect",
		default: 0,
		prop: "value",
		set: function (val) {
			this.cameraController.orbitCtrl.mouseButtons[BUTTONS[parseInt(val)]] =
				THREE.MOUSE.ROTATE;
		},
	},
	// {
	// 	id: "vertSelect",
	// 	default: 1,
	// 	prop: "value",
	// 	set: function (val) {
	// 		this.vertCamMove = parseInt(val);
	// 	},
	// },
	{
		id: "eosDisp",
		default: true,
		prop: "checked",
		set: function (val) {
			this.sceneObjs.Eos.visible = val;
		},
	},
	{
		id: "beltDisp",
		default: true,
		prop: "checked",
		set: function (val) {
			this.sceneObjs.Belt.visible = val;
		},
	},
	{
		id: "dampFact",
		default: 0.05,
		prop: "value",
		set: function (val) {
			this.cameraController.orbitCtrl.dampingFactor = parseFloat(val);
		},
	},
	{
		id: "beltSamples",
		default: 16,
		prop: "value",
		set: function (val) {
			let newVal;

			if (val == 2) {
				newVal = 1
			} else {
				newVal = val
			}
			document.getElementById("beltSampleDisplay").innerText = newVal
		},
	},
	{
		id: "eosQuality",
		default: 32,
		prop: "value",
		set: function (val) {
			document.getElementById("eosQualityDisplay").innerText = val
		},
	},
	{
		id: "beltQuality",
		default: 96,
		prop: "value",
		set: function (val) {
			document.getElementById("beltQualityDisplay").innerText = val
		},
	},
	{
		id: "beltTransparency",
		default: 0.8,
		prop: "value",
		set: function (val) {
			document.getElementById("beltTransparencyDisplay").innerText = val
		},
	},
	{
		id: "cameraFOV",
		default: 75,
		prop: "value",
		set: function (val) {
			document.getElementById("cameraFOVDisplay").innerText = val
		},
	},
	{
		id: "cloudDisp",
		default: true,
		prop: "checked",
		set: function (val) {
			this.sceneObjs.EosClouds.visible = val;
		},
	},
	{
		id: "isanRangeDisp",
		default: false,
		prop: "checked",
		set: function (val) {
			this.sceneObjs.IsanSphere.visible = val;
		},
	},
	{
		id: "zoomSpeed",
		default: 1,
		prop: "value",
		set: function (val) {
			this.cameraController.orbitCtrl.zoomSpeed = parseFloat(val);
		},
	},
	{
		id: "nameOnHover",
		default: false,
		prop: "checked",
		set: function (val) {
			this.pointManager.onlyShowNameOnHover = val;
		},
	},
	{
		id: "showNames",
		default: true,
		prop: "checked",
		set: function (val) {
			this.pointManager.setVis("nameText", val);
		},
	},
	{
		id: "showLines",
		default: true,
		prop: "checked",
		set: function (val) {
			this.pointManager.setVis("line", val);
		},
	},
	{
		id: "showMarkers",
		default: true,
		prop: "checked",
		set: function (val) {
			this.pointManager.setVis("marker", val);
		},
	},
	{
		id: "showRings",
		default: true,
		prop: "checked",
		set: function (val) {
			this.pointManager.setVis("ring", val);
		},
	},
	{
		id: "moveInfoOnClick",
		default: false,
		prop: "checked",
		set: function (val) {
			this.moveInfoOnClick = val;
		},
	},
	{
		id: "customColorTheme",
		default: "#0074f0",
		prop: "value",
		set: function (val) {
			const code = val.split(" ").join("")

			document.getElementById("color_val").innerHTML = val
			document.getElementById("color_val").style.color = val

			//checks if it is valid hex
			const validHex = /^#[0-9A-F]{6}$/i.test(code)
			if (validHex) {
				app.updateTheme(val);
			} else {
				//check if it just hasn't been set
				if (code === "") {
					return;
				} else {
					alert("That color code is invalid.")
				}
			}
		},
	},
];
//This actually "enacts" the settings on the app, making the changes
export default class SettingsManager {
	constructor(app) {
		this.app = app;
		this.shown = false;
	}
	init() {
		$("#settingsWindow").draggable({
			containment: "document",
		});
		$(".settings-close").click(function () {
			$(this).parent().hide();
			self.shown = false;
		});
		$("#settingsBtn").click(function () {
			if (!self.shown) {
				$("#settingsWindow").show();
				self.shown = true;
			} else {
				$("#settingsWindow").hide();
				self.shown = false;
			}
		});
		//Init all the values of the settings UI elements, and bind the event handler
		let savedSettings;
		try {
			savedSettings = JSON.parse(this.app.storage.getItem("settings"));
		} catch (e) {
			savedSettings = SETTINGS_DEF.map((set) => set.default);
		}
		//Makes sure updates wont break users settings
		if (!savedSettings) {
			savedSettings = SETTINGS_DEF.map((set) => set.default);
		}
		SETTINGS_DEF.forEach((setting) => {
			if (savedSettings[setting.id] == undefined) {
				savedSettings[setting.id] = setting.default;
			}
		});
		if (!savedSettings.zoomSpeed) {
			//Accidently set zoom speed to 0, need to fix dat
			savedSettings.zoomSpeed = 1;
		}
		const self = this;
		SETTINGS_DEF.forEach((setting) => {
			const elm = document.getElementById(setting.id);
			elm[setting.prop] = savedSettings[setting.id];
			setting.set.call(self.app, savedSettings[setting.id]);
			elm.onchange = function () {
				setting.set.call(self.app, elm[setting.prop]);
				self.saveSettings();
			};
		});
	}
	saveSettings() {
		const settings = {};
		SETTINGS_DEF.forEach((setting) => {
			const elm = document.getElementById(setting.id);
			settings[setting.id] = elm[setting.prop];
		});
		this.app.storage.setItem("settings", JSON.stringify(settings));
	}
}
