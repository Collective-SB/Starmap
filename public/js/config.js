import {
	ENV_FROM_ENVJS,
	AUTH_REDIR_FROM_ENVJS
} from "./env.js";

export const ENV = ENV_FROM_ENVJS; //"remoteDev";
export const AUTH_REDIR = AUTH_REDIR_FROM_ENVJS; //"beta";
export const ENABLE_SBOX = true;

export const SSO_URL = "https://sso.isan.to/login?service=";
export const URLS = {
	api: {
		local: "http://localhost:8000/",
		prod: "https://api.isan.to/",
		lite: "https://api.isan.to/",
		remoteDev: "https://api.isan.to/",
		lite: "https://api.isan.to/"
	},
	wss: {
		local: "ws://localhost:8006/",
		prod: "wss://ws.isan.to:443/",
		lite: "wss://ws.isan.to:443/",
		remoteDev: "wss://ws.isan.to:443/",
	},
	login: {
		local: SSO_URL + "http://localhost/",
		prod: SSO_URL + "https://isan.to/",
		lite: SSO_URL + "http://lite.isan.to/",
		remoteDev: SSO_URL + "http://localhost/",
	},
};
export const EOS_SIZE = 11000000 / 2;
export const SOLONS_OFFSET = 50000;
export const DIST_TO_BELT = 3000000 + SOLONS_OFFSET;
export const BELT_HEIGHT = 170000;
export const BELT_EDGE_RADIUS = 60000;

export const EOS_QUALITY = 32;
export const BELT_QUALITY = 96;

export const BELT_THICK = 2200000;
export const SAFE_LEN = 1000000;
export const SAFE_RAD = 100000 / 2;
export const CAM_MAX_ZOOM = EOS_SIZE * 10;
//Consts to control the marker scaling
export const MARKER_SIZE_MIN = 0.1;
export const MARKER_SIZE_MAX = 15;
export const DIST_MIN = 0;
export const DIST_MAX = 500000;
export const MARKER_SIZE = 1000;
export const MARKER_RING_SIZE = 750;
export const HOVER_SCALE_BASE_MAX = 1.5;
export const HOVER_CAM_DIST_FACTOR = 25000;
export const HOVER_CHANGE_RATE = 0.35;
export const FADE_MIN_DIST = 0;
export const FADE_MAX_DIST = 2500;
export const ZOOM_INTO_DIST = 10000;
export const ZONE_WIRE_CUTOFF = 80000;
export const ZONE_OUTLINE_POINTS = 100;
export const ZONE_INTERACTION_SIZE = 1000;
export const ISAN_RANGE = 1000000;
export const safePos = {
	x: EOS_SIZE + DIST_TO_BELT - SOLONS_OFFSET,
	y: 0,
	z: 0,
};
export const MAX_MOTION_TRAILS = 10;
//Offset from 0,0,0 that points are set too
export const pointOffset = {
	//Basically ISAN origin compared to Eos
	x: EOS_SIZE + DIST_TO_BELT - SOLONS_OFFSET,
	y: 0,
	z: 0,
};

export const TYPES = {
	ship: {
		name: "ship",
		color: "#f36a28",
		info: "All marked ship locations",
		icons: {
			map: "../assets/icons/ship-done.png",
			info: "../assets/icons/ship.png",
		},
		subtypes: [{
			name: "Default",
			hex: "#f36a28",
		}, ],
		widthmult: 1,
		heightmult: 1,
	},
	station: {
		name: "station",
		color: "#3bbd4f",
		info: "All marked station locations",
		icons: {
			map: "../assets/icons/station-done.png",
			info: "../assets/icons/station.png",
		},
		subtypes: [{
				name: "Default",
				hex: "#3bbd4f",
			},
			{
				name: "Collective",
				hex: "#ff0000",
			},
			{
				name: "Substrate",
				hex: "#e72f2c",
			},
			{
				name: "Empire",
				hex: "#ff8c00",
			},
			{
				name: "Kingdom",
				hex: "#0074f0",
			},
			{

				name: "The Wake",
				hex: "#922d22"
			},
			{
				name: "Artemis Cargo Corporation",
				hex: "#22acda"
			},
			{
				name: "LINGCORP",
				hex: "#5794d5"
			}
		],
		widthmult: 1,
		heightmult: 1,
	},
	ore: {
		name: "ore",
		color: "#8c63e8",
		info: "Any ore that has been found",
		icons: {
			map: "../assets/icons/ore-done.png",
			info: "../assets/icons/ore.png",
		},
		subtypes: [{
			name: "Default",
			hex: "#8c63e8",
		}, ],
		widthmult: 1,
		heightmult: 1,
	},
	"Military Capital Ship": {
		name: "Military Capital Ship",
		color: "#e62949",
		info: "A Military Class Capital Ship",
		icons: {
			map: "../assets/icons/milcap-done.png",
			info: "../assets/icons/milcap.png",
		},
		subtypes: [{
			name: "Default",
			hex: "#e62949",
		}, ],
		widthmult: 4.29801324503 * 0.5,
		heightmult: 1 * 0.5,
	},
	"Civilian Capital Ship": {
		name: "Civilian Capital Ship",
		color: "#93f542",
		info: "A Civilian Class Capital Ship",
		icons: {
			map: "../assets/icons/civcap-done.png",
			info: "../assets/icons/civcap.png",
		},
		subtypes: [{
			name: "Default",
			hex: "#93f542",
		}, ],
		widthmult: 4.34343434343 * 0.5,
		heightmult: 1 * 0.5,
	},
	"Warp Gate": {
		name: "Warp Gate",
		color: "#b642f5",
		info: "A Warp Gate that can be used to go places quickly.",
		icons: {
			map: "../assets/icons/warpgate-done.png",
			info: "../assets/icons/warpgate.png",
		},
		subtypes: [{
			name: "Default",
			hex: "#b642f5",
		}, ],
		widthmult: 1.3,
		heightmult: 1.3,
	},
	other: {
		name: "other",
		color: "#aaaaaa",
		info: "Misc POI's that dont fit into the other categories",
		icons: {
			map: "../assets/icons/random-done.png",
			info: "../assets/icons/random.png",
		},
		subtypes: [{
			name: "Default",
			hex: "#aaaaaa",
		}, ],
		widthmult: 1,
		heightmult: 1,
	},
};