/*global THREE*/
/*global $*/

const infoTemplate = `
<div class="info" id="infoWindow">
	<div class="more-info">
		<span class="material-icons" onmouseover="hoverHandler()">help</span>
		<span class="more-info-tooltip">
			Type: %TYPE%
			<br>
			Creator: %CREATOR%
			<br>
			Layer: %LAYER%
		</span>
	</div>

	<h1 class="infoText no-drag">%POINT_NAME%</h1>

	<div class="infoMainBody">
		<div class="isanDispalyDiv">
			<p class="infoText no-drag isanDispalyVal">X: %POS_X%</p>
			<p class="infoText no-drag isanDispalyVal">Y: %POS_Y%</p>
			<p class="infoText no-drag isanDispalyVal">Z: %POS_Z%</p>
		</div>
		
		<div class="infoDiv">
			<button id="linksharable">Copy link </button>
			<br>
			<button id="epivals">Copy cords</button>
			<br>
			<button id="focus">Focus</button>
		</div>

		<div class="infoDiv">
			<img src=%TYPE_IMAGE% width="64" height="64">
		</div>
	</div>
	<div class="desc">
		<p class="infoText no-drag">%DESCRIPTION%</p>
	</div>
</div>
`;

const deletePointTemplate = `
	<button type="button" name="button" id="delete-point">Delete</button>
`;

const updatePointTemplate = `
	<button type="button" name="button" id="update-point">Update</button>
`;

const optionTemplate = `
<option value="%VALUE%">
	%NAME%
</option>
`;

const distanceInfoTemplate = `
<div class="distance-info" id="distance-info">
	<fieldset class="distance-fieldset">
		<legend>Distance</legend>
		<p>%DISTANCE%</p>
	</fieldset>
	<fieldset class="distance-fieldset">
		<legend>Min flight time</legend>
		<p>%FLIGHT_TIME%</p>
	</fieldset>
</div>
`;

const viewFilterTemplate = `
<div class="filter-view-option">
	<input id=%ID% type="checkbox" name="%NAME%" value="%NAME%" checked>
	<label for="%NAME%">
		%NAME%
	</label>
	<span class="filter-view-option-tooltip">%INFO%</span>
</div>
<br>
`;

import {
	EOS_SIZE,
	DIST_TO_BELT,
	BELT_THICK,
	SAFE_LEN,
	SAFE_RAD,
	ENABLE_SBOX,
	MARKER_SIZE_MIN,
	MARKER_SIZE_MAX,
	DIST_MIN,
	DIST_MAX,
	ISAN_RANGE,
	safePos,
	pointOffset,
	TYPES,
	AUTH_REDIR,
	URLS,
	ENV,
} from "./config.js";

import {
	constrain,
	map,
	copyToClipboard,
	eraseCookie,
	getCookie,
	setCookie,
} from "./functions.js";

import PointManager from "./PointManager.js";
import API from "./API.js";
import CamController from "./CamController.js";
import SettingsManager from "./SettingsManager.js";

import Stats from "./packages/Stats.js";

let mouseX = 0;
let mouseY = 0;

const ERROR = 0;
const SUCCESS = 1;

String.prototype.reverse = function () {
	return this.split("").reverse().join("");
};

//Add commas into a string
Number.prototype.format = function () {
	const numChars = Math.floor(this).toString().split("").reverse();
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
};

//Honestly I feel this should be broken into two classes, the main App and some form of "UI manager" class, perhaps a project for another day
//Main map application
class App {
	constructor() {
		this.raycaster = new THREE.Raycaster();
		this.sceneObjs = {
			camera: null,
			scene: null,
			renderer: null,
			Eos: null,
			Belt: null,
			Safe: null,
			EosClouds: null,
			IsanSphere: null,
		};
		this.cameraController;
		this.storage = localStorage;
		//Check if we want to focus on a point
		const focus = window.location.pathname.substring(1);
		if (focus) {
			this.storage.setItem("pointFocus", focus);
		}
		this.pointManager = new PointManager(this);
		this.settings = new SettingsManager(this);
		this.isLoggedIn = false;
		this.updatePointId;
		this.textFont;
		this.user;
		this.viewFilters = {
			types: {},
			groups: {},
		};
		this.isShiftHeld = false;
		this.lastLoginState = false;
		this.api = new API(this.pointManager, this);
		this.stats = new Stats();
		this.stats.showPanel(0);
		this.vertCamMove = 1;
		this.stats.dom.style.left = "85%";
		// document.body.appendChild(this.stats.dom);
	}
	async init() {
		this.initScene();
		this.UISetup();
		//See if we just completed OAuth2
		if (window.location.search.includes("code")) {
			const code = window.location.search.substring("?code=".length);
			const jwt = await this.api.getJWTFromCode(code);
			if (jwt) this.storage.setItem("jwt", jwt);
		}
		//Lets ensure the jwt is still valid (if we have one)
		const jwt = this.storage.getItem("jwt");
		if (jwt) {
			await this.api.confirmJWT(jwt);
		}
	}
	//Updates what points should be displayed
	initFilters() {
		const filtersJSON = this.storage.getItem("viewFilters");
		if (!filtersJSON) return;
		const filters = JSON.parse(filtersJSON);
		for (var t in TYPES) {
			const type = TYPES[t];
			document.getElementById(`type-filter-${type.name}`).checked =
				filters.types[type.name];
		}
		this.user.g.forEach((group) => {
			document.getElementById(`group-filter-${group.id}`).checked =
				filters.groups[group.id];
		});
		this.viewFilters = filters;
		this.pointManager.updateDisplayed(this.viewFilters);
	}
	updateFilters() {
		for (var t in TYPES) {
			const type = TYPES[t];
			this.viewFilters.types[type.name] = document.getElementById(
				`type-filter-${type.name}`
			).checked;
		}
		this.user.g.forEach((group) => {
			this.viewFilters.groups[group.id] = document.getElementById(
				`group-filter-${group.id}`
			).checked;
		});
		this.storage.setItem("viewFilters", JSON.stringify(this.viewFilters));

		this.pointManager.updateDisplayed(this.viewFilters);
	}
	//Sets up the threejs scene
	initScene() {
		this.sceneObjs.scene = new THREE.Scene();
		this.sceneObjs.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			5000000000
		);
		const divElm = document.getElementById("main");
		this.sceneObjs.renderer = new THREE.WebGLRenderer({
			logarithmicDepthBuffer: true,
			antialias: true,
		});
		this.sceneObjs.renderer.setSize(window.innerWidth, window.innerHeight);
		divElm.appendChild(this.sceneObjs.renderer.domElement);
		//Eos
		const tex = new THREE.TextureLoader().load("../assets/planetTex.png");
		const eosGem = new THREE.SphereGeometry(EOS_SIZE, 32, 32);
		const eosMat = new THREE.MeshStandardMaterial({
			// color: 0x2c3ca3,
			metalness: 0.8,
			map: tex,
			roughness: 1,
			// wireframe: false,
		});
		this.sceneObjs.Eos = new THREE.Mesh(eosGem, eosMat);
		this.sceneObjs.scene.add(this.sceneObjs.Eos);

		//Belt
		var beltGem = new THREE.RingGeometry(
			EOS_SIZE + DIST_TO_BELT,
			EOS_SIZE + DIST_TO_BELT + BELT_THICK,
			128,
			8
		);
		var beltMat = new THREE.MeshStandardMaterial({
			color: 0x515151,
			opacity: 0.5,
			transparent: true,
		});
		beltMat.depthWrite = false;
		beltMat.needsUpdate = true;
		const Belt = new THREE.Mesh(beltGem, beltMat);
		Belt.material.side = THREE.DoubleSide;
		Belt.rotation.set(Math.PI / 2, 0, 0);
		this.sceneObjs.Belt = Belt;
		this.sceneObjs.scene.add(Belt);

		//Safe zone
		var safeGem = new THREE.CylinderGeometry(
			SAFE_RAD,
			SAFE_RAD,
			SAFE_LEN,
			8,
			4
		);
		var safeMat = new THREE.MeshBasicMaterial({
			color: 0x009dd6, //0x009900,
			wireframe: true,
		});
		const Safe = new THREE.Mesh(safeGem, safeMat);
		Safe.position.set(safePos.x, safePos.y, safePos.z);
		Safe.rotation.set(Math.PI / 2, 0, Math.PI / 2);
		this.sceneObjs.Safe = Safe;
		Safe.visible = false;
		this.sceneObjs.scene.add(Safe);

		//Creating some basic lighting
		//This lighting dose not get saved, which may be a problem
		var ambient = new THREE.AmbientLight(0xf0f0f0); // soft white light
		this.sceneObjs.scene.add(ambient);
		var light = new THREE.PointLight(0xffffff, 2);
		light.position.set(EOS_SIZE * 4, EOS_SIZE * 4, EOS_SIZE);
		this.sceneObjs.scene.add(light);

		if (ENABLE_SBOX) {
			// const skybox = new THREE.CubeTextureLoader()
			// 	.setPath("../assets/skybox/")
			// 	.load([
			// 		"left.png",
			// 		"right.png",
			// 		"top.png",
			// 		"bot.png",
			// 		"front.png",
			// 		"back.png",
			// 	]);
			const loader = new THREE.CubeTextureLoader();

			const skybox = loader.load([
				"https://i.ibb.co/RBTc269/left.png",
				"https://i.ibb.co/Qky4htz/right.png",
				"https://i.ibb.co/bLczY5m/top.png",
				"https://i.ibb.co/zrq0KLR/bot.png",
				"https://i.ibb.co/TtpZB45/front.png",
				"https://i.ibb.co/56d6cPp/back.png",
			]);
			this.sceneObjs.scene.background = skybox;
		}
		//Add the clouds around Eos
		const cloudText = new THREE.TextureLoader(
			new THREE.LoadingManager(() => {})
			// ).load("../assets/cloud3.png");
		).load("https://i.ibb.co/hf26qqm/cloud3.png");
		const MESH_SIZE = 76;
		const cloudGeom = new THREE.SphereGeometry(MESH_SIZE, 100, 100);
		const cloudMat = new THREE.MeshStandardMaterial({
			color: 0xcdddfd,
			transparent: true,
			opacity: 0.3,
			alphaMap: cloudText,
		});
		cloudMat.depthWrite = false;
		this.sceneObjs.EosClouds = new THREE.Mesh(cloudGeom, cloudMat);
		this.sceneObjs.EosClouds.scale.set(
			EOS_SIZE / (MESH_SIZE - 0.1),
			EOS_SIZE / (MESH_SIZE - 0.1),
			EOS_SIZE / (MESH_SIZE - 0.1)
		);
		this.sceneObjs.scene.add(this.sceneObjs.EosClouds);

		const isanGeom = new THREE.SphereGeometry(ISAN_RANGE, 32, 32);
		const isanMat = new THREE.MeshStandardMaterial({
			color: 0x00ff00,
			transparent: true,
			opacity: 0.3,
			// side: THREE.DoubleSide,
		});
		this.sceneObjs.IsanSphere = new THREE.Mesh(isanGeom, isanMat);
		this.sceneObjs.IsanSphere.position.set(
			pointOffset.x,
			pointOffset.y,
			pointOffset.z
		);
		this.sceneObjs.scene.add(this.sceneObjs.IsanSphere);
		//Create the cam controller
		this.cameraController = new CamController(
			this.sceneObjs.camera,
			this.sceneObjs.renderer.domElement,
			this
		);
	}
	//Casts a ray and returns what points are hit
	castRay(screenX, screenY) {
		const x = (screenX / window.innerWidth) * 2 - 1;
		const y = -(screenY / window.innerHeight) * 2 + 1;
		const mouse = new THREE.Vector2(x, y);
		this.raycaster.setFromCamera(mouse, this.sceneObjs.camera);
		var intersects = this.raycaster.intersectObjects(
			this.pointManager.points.map((p) => p.marker),
			true
		);
		return intersects;
	}
	//Figures out how the map should handle a user click
	handleSceneClick(event) {
		const intersects = this.castRay(event.clientX, event.clientY);
		if (intersects.length > 0) {
			if (event.type == "dblclick") {
				//On double click we zoom into the object
				const pos = this.pointManager.getByThreeId(
					intersects[0].object.uuid
				).position;
				this.cameraController.lerpCamTo(pos.x, pos.y, pos.z);
			}
			if (this.isShiftHeld) {
				const target = this.pointManager.getByThreeId(
					intersects[0].object.uuid
				);
				this.updateDistTo(target);
			} else {
				this.handleObjectClick(intersects[0].object);
			}
		}
	}
	//Sets up a bunch of event handlers for the UI
	UISetup() {
		$(".info-container").draggable({
			containment: "document",
			cancel: ".no-drag",
			start: function () {
				$(this).css({
					right: "auto",
				});
			},
			stop: function () {
				$(this).css({
					left: "",
					right:
						$(window).width() -
						($(this).offset().left + $(this).outerWidth()),
				});
			},
		});
		// Settings popup
		this.settings.init();

		// New point popup
		$(".add-point").draggable({
			containment: "document",
		});
		$(".add-point .close").click(function () {
			$(this).parent().hide();
		});
		// New point button
		const self = this;
		$("#new-point").click(function () {
			self.updateFormMode.call(self, "create");
			const curType = document.getElementById("type-select").value;
			self.updateColorOpts(curType);
			$(".add-point").show();
		});
		const typeSelector = document.getElementById("type-select");
		typeSelector.onchange = function (e) {
			self.updateColorOpts(e.target.value);
		};

		$(".add-point form").submit(async function (e) {
			e.preventDefault();
			let serialized = $(this).serializeArray();
			const group = self.user.g.find(
				(group) => group.id == serialized[3].value
			);
			let data = {
				name: serialized[0].value,
				desc: serialized[1].value,
				type: serialized[2].value,
				groupID: group.id,
				color: serialized[4].value,
				pos: {
					x: parseInt(serialized[5].value),
					y: parseInt(serialized[6].value),
					z: parseInt(serialized[7].value),
				},
				showPrev: false,
			};
			$(this).parent().hide();
			const submitType = e.originalEvent.submitter.value;
			if (submitType == "Create") {
				const res = await self.api.createPoint(data);
				if (res == 200) {
					if (group.hasReview) {
						self.banner(
							"The point has been submitted for review",
							SUCCESS
						);
					}
				} else {
					self.banner("The point could not be created", ERROR);
				}
			} else {
				self.api.updatePoint(self.updatePointId, data);
			}
		});

		document.getElementById("login").onclick = function () {
			self.storage.removeItem("jwt"); // Remove old jwt

			// setCookie("authRedirect", AUTH_REDIR, 1);
			window.location.href = `${URLS.api[ENV]}auth/login?redir=${AUTH_REDIR}`;
		};
		document.getElementById("logout").onclick = function () {
			self.storage.removeItem("jwt");
			self.setLoggedIn(false);
		};
		const divElm = this.sceneObjs.renderer.domElement;
		divElm.addEventListener("click", this.handleSceneClick.bind(this));
		divElm.addEventListener("dblclick", this.handleSceneClick.bind(this));
		const form = document.getElementById("filterFormTypes");

		for (var t in TYPES) {
			const type = TYPES[t];
			let template = viewFilterTemplate;
			template = template.replace("%NAME%", type.name);
			template = template.replace("%NAME%", type.name);
			template = template.replace("%NAME%", type.name);
			template = template.replace("%NAME%", type.name);
			template = template.replace("%ID%", `type-filter-${type.name}`);
			template = template.replace("%INFO%", type.info);
			form.innerHTML += template;
		}
		form.innerHTML += "<br>";
		form.onchange = this.updateFilters.bind(this);

		const sortToggle = document.getElementById("sortToggle");
		const pointsMode = document.getElementById("points");
		const layersMode = document.getElementById("layers");
		sortToggle.onclick = function () {
			if (pointsMode.style.display == "block") {
				pointsMode.style.display = "none";
				layersMode.style.display = "block";
				sortToggle.innerText = "Sort by name";
			} else {
				pointsMode.style.display = "block";
				layersMode.style.display = "none";
				sortToggle.innerText = "Sort by layers";
			}
		};

		const acceptBtn = document.getElementById("acceptCookies");
		const popup = document.getElementById("popup");
		// const popupContent = document.getElementById("popup-content");
		acceptBtn.onclick = function () {
			self.storage.setItem("shown", "yes");
			popup.style.display = "none";
		};
		const hasBeenShown = self.storage.getItem("shown") == "yes";
		if (!hasBeenShown) {
			popup.style.display = "block";
		}

		//Searchbar code
		const searchbar = document.getElementById("find");
		const points = document.getElementById("points");
		searchbar.onkeyup = function () {
			pointsMode.style.display = "block";
			layersMode.style.display = "none";
			sortToggle.innerText = "Sort by layers";
			for (var i = 0; i < points.childElementCount; i++) {
				const point = self.pointManager.getById(
					points.children[i].id.substring("side-".length)
				);
				if (
					point.info.name
						.toLowerCase()
						.includes(searchbar.value.toLowerCase())
				) {
					points.children[i].classList.remove("search-hide");
				} else {
					points.children[i].classList.add("search-hide");
				}
			}
		};

		window.onkeydown = function (e) {
			if (e.keyCode == 16) {
				self.isShiftHeld = true;
			}
		};
		window.onkeyup = function (e) {
			if (e.keyCode == 16) {
				self.isShiftHeld = false;
			}
		};
		window.onresize = function () {
			self.sceneObjs.camera.aspect = window.innerWidth / window.innerHeight;
			self.sceneObjs.camera.updateProjectionMatrix();
			self.sceneObjs.renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.onmousemove = function (e) {
			mouseX = e.x;
			mouseY = e.y;
		};
	}
	updateColorOpts(newType, defaultTo) {
		const dropDownColors = document.getElementById("color-select");
		dropDownColors.innerHTML = "";
		TYPES[newType].colorOpts.forEach((colOption) => {
			const option = document.createElement("option");
			option.value = colOption.hex;
			option.innerText = colOption.name;
			option.style.color = colOption.hex;
			dropDownColors.appendChild(option);
		});
		if (defaultTo) {
			dropDownColors.value = defaultTo;
		}
	}
	//Called whenever a user selects a new item from the drop down list, updates the calculated time of flight between them
	updateDistTo(object) {
		const iWin = document.getElementById("infoWindow");
		const existDiv = document.getElementById("distDiv");
		if (existDiv) {
			iWin.removeChild(existDiv);
		}
		if (!object) {
			this.sceneObjs.scene.remove(this.pointManager.connectorLine);
		} else {
			var points = [];
			points.push(new THREE.Vector3(0, 0, 0));
			points.push(
				new THREE.Vector3(
					this.pointManager.focusedPOI.position.x - object.position.x,
					this.pointManager.focusedPOI.position.y - object.position.y,
					this.pointManager.focusedPOI.position.z - object.position.z
				)
			);
			var geometry = new THREE.BufferGeometry().setFromPoints(points);
			var material = new THREE.LineBasicMaterial({
				color: 0xff0000,
			});
			var line = new THREE.Line(geometry, material);
			line.position.set(
				object.position.x,
				object.position.y,
				object.position.z
			);
			this.sceneObjs.scene.remove(this.pointManager.connectorLine);
			this.pointManager.connectorLine = line;
			this.sceneObjs.scene.add(line);

			const p1 = new THREE.Vector3(
				this.pointManager.focusedPOI.position.x,
				this.pointManager.focusedPOI.position.y,
				this.pointManager.focusedPOI.position.z
			);
			const p2 = new THREE.Vector3(
				object.position.x,
				object.position.y,
				object.position.z
			);
			const d = p1.distanceTo(p2);

			let speed = parseInt(document.getElementById("speed-input").value);
			speed = speed ? speed : 150;
			const t = d / speed;

			const formatTime = (t) => {
				if (t.length == 1) {
					return "0" + t;
				}
				return t;
			};
			const hrs = formatTime(Math.floor(t / 3600).toString());
			const mins = formatTime(Math.floor((t / 60) % 60).toString());
			const secs = formatTime(Math.floor(t % 60).toString());

			var template = distanceInfoTemplate;
			template = template.replace("%DISTANCE%", d.format() + " m");
			template = template.replace("%FLIGHT_TIME%", `${hrs}:${mins}:${secs}`);

			var distanceDiv = document.getElementById("distance-info");
			if (distanceDiv == undefined) {
				distanceDiv = document.createElement("div");
			}
			distanceDiv.innerHTML = template;

			iWin.appendChild(distanceDiv);
		}
	}
	//Fills out the info pannel whenever a point is clicked on
	handleObjectClick(object) {
		//Creates the info in the top right window
		const self = this;
		//Allow threejs object OR my point data object
		const poiData = object.uuid
			? this.pointManager.getByThreeId(object.uuid)
			: object;
		this.pointManager.focusedPOI = poiData;

		// Toggle flip effect on Button
		document.getElementById("dropdown-minimize").style.transform =
			"scaleY(1)";

		var template = infoTemplate;

		template = template.replace("%POINT_NAME%", poiData.info.name);
		template = template.replace("%CREATOR%", poiData.info.createdBy);
		template = template.replace("%DESCRIPTION%", poiData.info.desc);
		template = template.replace("%TYPE%", poiData.info.type);
		template = template.replace(
			"%TYPE_IMAGE%",
			TYPES[poiData.info.type].icons.info
		);
		template = template.replace("%LAYER%", poiData.group);
		const pos = poiData.info.gamePos;
		template = template.replace("%POS_X%", pos.x);
		template = template.replace("%POS_Y%", pos.y);
		template = template.replace("%POS_Z%", pos.z);

		var options = "";

		var optionNone = optionTemplate;
		optionNone = optionNone.replace("%NAME%", "----");
		optionNone = optionNone.replace("%VALUE%", "");

		options += optionNone;

		this.pointManager.points.forEach((point) => {
			// Prevent a point appearing in its own distance selector
			if (poiData.id != point.id) {
				var option = optionTemplate;
				option = option.replace("%VALUE%", point.id);
				option = option.replace("%NAME%", point.info.name);

				options += option;
			}
		});

		template = template.replace("%OPTIONS%", options);

		const userGroup = this.user.g.find((g) => g.id == poiData.groupID);
		const canDelete =
			(userGroup && userGroup.modify) || poiData.ownerID == this.user.id;
		if (canDelete) {
			template += updatePointTemplate;
			template += deletePointTemplate;
		}
		const infoWindow = document.getElementById("infoWindow");
		infoWindow.innerHTML = template;
		infoWindow.style.display = "";

		//Handles pressing the update point button
		$("#update-point").click(function () {
			self.updateFormMode.call(self, "update");
			self.autoFillForm(poiData);
			const curType = document.getElementById("type-select").value;
			self.updateColorOpts(curType, poiData.color);
			self.updatePointId = poiData.id;
			$(".add-point").show();
		});
		//Sharable link
		const getLink = document.getElementById("linksharable");
		getLink.onclick = function () {
			const identifier = poiData.vanity ? poiData.vanity : poiData.id;
			const link = window.location.origin + "/" + identifier;
			copyToClipboard(link);
		};

		//Sharable link
		const epiValsBtn = document.getElementById("epivals");
		epiValsBtn.onclick = function () {
			const str = `${poiData.info.gamePos.x} ${poiData.info.gamePos.y} ${poiData.info.gamePos.z}`;
			copyToClipboard(str);
		};

		//Delete button
		if (canDelete) {
			const delBtn = document.getElementById("delete-point");
			delBtn.onclick = function () {
				if (confirm("Are you sure you want to delete this point?")) {
					infoWindow.innerHTML = "";
					self.api.deletePoint(poiData.id);
					self.updateDistTo();
				}
			};
		}
		//Camera focus button
		const focusBtn = document.getElementById("focus");
		focusBtn.onclick = function () {
			self.cameraController.lerpCamTo(
				poiData.position.x,
				poiData.position.y,
				poiData.position.z
			);
		};
	}
	//Main running loop, called ~60x per second
	run() {
		this.sceneObjs.EosClouds.rotation.y += 0.0001;
		const dist = constrain(this.cameraController.dist, DIST_MIN, DIST_MAX);
		const markerScale = map(
			dist,
			DIST_MIN,
			DIST_MAX,
			MARKER_SIZE_MIN,
			MARKER_SIZE_MAX
		);
		//Check hovers
		const hovers = this.castRay(mouseX, mouseY);
		this.pointManager.points.forEach((p) => p.updateHoverMain(false));
		if (hovers.length > 0) {
			const point = this.pointManager.getByThreeId(hovers[0].object.uuid);
			point.updateHoverMain(true);
		}
		this.pointManager.points.forEach((point) => {
			const rot = this.sceneObjs.camera.rotation;
			point.nameText.rotation.set(rot.x, rot.y, rot.z);
			point.marker.rotation.set(rot.x, rot.y, rot.z);
		});
		this.pointManager.runScales(markerScale);
		this.cameraController.update();
		this.sceneObjs.renderer.render(
			this.sceneObjs.scene,
			this.sceneObjs.camera
		);
	}
	//Called whenever a user successfully logs in, fills out the group options from user object
	onLogin() {
		const form = document.getElementById("filterFormLayers");
		form.innerHTML = "";
		this.user.g.forEach((group) => {
			let template = viewFilterTemplate;
			template = template.replace("%NAME%", group.name);
			template = template.replace("%NAME%", group.name);
			template = template.replace("%NAME%", group.name);
			template = template.replace("%NAME%", group.name);
			template = template.replace("%ID%", `group-filter-${group.id}`);
			template = template.replace("%INFO%", group.info);
			form.innerHTML += template;
		});
		$(function () {
			$(document.body).on("click", ".filter-view-option", function (e) {
				if (e.target.nodeName == "LABEL") {
					const checkBox = e.target.parentElement.children[0];
					checkBox.checked = !checkBox.checked;
					form.onchange();
				}
			});
		});

		form.innerHTML += "<br>";
		form.onchange = this.updateFilters.bind(this);

		const sidenav = document.getElementById("layers");
		sidenav.innerHTML = "";
		this.user.g.forEach((layer) => {
			const header = document.createElement("p");
			header.className = "layerheader";
			header.id = `layer-header-${layer.id}`;
			header.innerText = layer.name;
			const div = document.createElement("div");
			div.id = `sort-div-${layer.id}`;

			sidenav.appendChild(header);
			sidenav.appendChild(div);
			header.onclick = function () {
				for (var i = 0; i < div.childElementCount; i++) {
					const content = div.children[i];
					if (content.style.maxHeight) {
						content.style.maxHeight = null;
						content.classList.add("nopadding");
					} else {
						content.style.maxHeight = content.scrollHeight + "px";
						content.classList.remove("nopadding");
					}
				}
			};
		});
		this.pointManager.updateLayers();
		this.api.getPoints();
		//Load in the toggled filters (defer execution to ensure html elements get loaded)
		setTimeout(this.initFilters.bind(this), 0);
	}
	onLogout() {
		window.location.reload();
	}
	//Used by the api confirmJWT to set our logged in state
	setLoggedIn(newState) {
		this.isLoggedIn = newState;
		let loginBtn = document.getElementById("login");
		let logoutBtn = document.getElementById("logout");
		let addPointBtn = document.getElementById("new-point");

		let pointsTitle = document.getElementById("points-title");
		if (!loginBtn) {
			return;
		}
		//This sets if the buttion is visable or not
		if (newState) {
			loginBtn.style.display = "none";
			logoutBtn.style.display = "block";
			pointsTitle.style.display = "block";
			addPointBtn.style.display = "block";
			if (!this.lastLoginState) {
				this.onLogin();
			}
			this.lastLoginState = true;
		} else {
			loginBtn.style.display = "block";
			logoutBtn.style.display = "none";
			pointsTitle.style.display = "none";
			addPointBtn.style.display = "none";
			if (this.lastLoginState) {
				this.onLogout();
			}
			this.lastLoginState = false;
		}
	}
	//Fills out the "create point" window when editing a point
	autoFillForm(point) {
		document.getElementById("formName").value = point.info.name;
		document.getElementById("formDesc").value = point.info.desc;
		document.getElementById("type-select").value = point.info.type;
		document.getElementById("formXPos").value = point.info.gamePos.x;
		document.getElementById("formYPos").value = point.info.gamePos.y;
		document.getElementById("formZPos").value = point.info.gamePos.z;
		document.getElementById("group-select").value = point.groupID;
		document.getElementById("color-select").value = point.color;
	}
	//We resue the same HTML elements for creating and updating a point, need to update a few things about it however
	updateFormMode(mode) {
		//Also need to update the drop down groups
		const dropDownGroups = document.getElementById("group-select");
		dropDownGroups.innerHTML = "";
		this.user.g.forEach((group) => {
			if (group.write) {
				const option = document.createElement("option");
				option.value = group.id;
				option.innerText = group.name;
				dropDownGroups.appendChild(option);
			}
		});
		//And update the type list, could be more efficent by doing onload but meh this is more reliable
		const dropDownTypes = document.getElementById("type-select");
		dropDownTypes.innerHTML = "";
		for (var t in TYPES) {
			const type = TYPES[t];
			const option = document.createElement("option");
			option.value = type.name;
			option.innerText = type.name;
			dropDownTypes.appendChild(option);
		}
		if (mode == "update") {
			document.getElementById("add-point-submit").value = "Update";
			document.getElementById("formLegend").innerText = "Update Point";
		} else {
			document.getElementById("add-point-submit").value = "Create";
			document.getElementById("formLegend").innerText = "Create Point";
		}
	}
	banner(txt, code) {
		const divElm = document.getElementById("topBanner");
		divElm.style.display = "block";
		if (code == ERROR) {
			divElm.style.backgroundColor = "rgba(255,0,0,0.8)";
		} else {
			divElm.style.backgroundColor = "rgba(0,128,0,0.8)";
		}
		const text = document.getElementById("bannerMsg");
		text.innerText = txt;
		setTimeout(function () {
			divElm.style.display = "none";
		}, 4000);
	}
}

const app = new App();
window.app = app;

function animate() {
	app.stats.begin();
	app.run();
	app.stats.end();
	requestAnimationFrame(animate);
}
window.onload = function () {
	app.init();
	animate();
};
