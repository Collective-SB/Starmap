/* ENV Options
ENV controls what sort of server it will expect, 
local - Assumes you are running the backend on your current machine, will use localhost:80/443
prod - Assumes is production, will use isan.to:80/443
remoteDev - Connects to the current beta version of starmap
*/
/* AUTH_REDIR Options
AUTH_REDIR Controls where the user is sent after completing discord OAuth2
local - localhost:443/auth/callback
prod - isan.to:443/auth/callback
beta - beta.isan.to/auth/callback
*/
export const ENV = "local";
export const AUTH_REDIR = "local";
export const ENABLE_SBOX = true;

export const URLS = {
	api: {
		local: "http://localhost:8000/",
		prod: "https://api.isan.to/",
		remoteDev: "https://api-beta.isan.to/",
	},
	wss: {
		local: "ws://localhost:8006/",
		prod: "wss://ws.isan.to:443/",
		remoteDev: "wss://ws-beta.isan.to:443/",
	},
};
export const EOS_SIZE = 11000000 / 2;
export const SOLONS_OFFSET = 24000;
export const DIST_TO_BELT = 3000000 + SOLONS_OFFSET;
export const BELT_THICK = 2200000;
export const SAFE_LEN = 1000000;
export const SAFE_RAD = 100000 / 2;
//Consts to control the marker scaling
export const MARKER_SIZE_MIN = 0.1;
export const MARKER_SIZE_MAX = 15;
export const DIST_MIN = 0;
export const DIST_MAX = 500000;
export const MARKER_SIZE = 1000;
export const MARKER_RING_SIZE = 750;
export const HOVER_SCALE_MAX = 2;
export const HOVER_CHANGE_RATE = 0.35;
export const FADE_MIN_DIST = 0;
export const FADE_MAX_DIST = 2500;
export const ZOOM_INTO_DIST = 10000;
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
		colorOpts: [
			{
				name: "Default",
				hex: "#f36a28",
			},
		],
	},
	station: {
		name: "station",
		color: "#3bbd4f",
		info: "All marked station locations",
		icons: {
			map: "../assets/icons/station-done.png",
			info: "../assets/icons/station.png",
		},
		colorOpts: [
			{
				name: "Default",
				hex: "#3bbd4f",
			},
			{
				name: "Collective",
				hex: "#ff0000",
			},
			{
				name: "Empire",
				hex: "#ff8c00",
			},
			{
				name: "Kingdom",
				hex: "#0074f0",
			},
		],
	},
	ore: {
		name: "ore",
		color: "#8c63e8",
		info: "Any ore that has been found",
		icons: {
			map: "../assets/icons/ore-done.png",
			info: "../assets/icons/ore.png",
		},
		colorOpts: [
			{
				name: "Default",
				hex: "#8c63e8",
			},
		],
	},
	other: {
		name: "other",
		color: "#aaaaaa",
		info: "Misc POI's that dont fit into the other categories",
		icons: {
			map: "../assets/icons/random-done.png",
			info: "../assets/icons/random.png",
		},
		colorOpts: [
			{
				name: "Default",
				hex: "#aaaaaa",
			},
		],
	},
};
