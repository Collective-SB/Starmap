//Class to handle the server interaction
//All the API stuff happens here, these functions also return the status code, which can be used for displaying errors
/*global jwt_decode*/
const HEATRBEAT = JSON.stringify({
	event: "heartbeat",
});
import {
	ENV,
	EOS_SIZE,
	URLS
} from "./config.js";
const API_URL = URLS.api[ENV];
const WSS_URL = URLS.wss[ENV];

function getExpInDays(user) {
	return (user.exp - Date.now() / 1000) / (60 * 60 * 24);
}
export default class API {
	constructor(pointManager, app) {
		this.pointManager = pointManager;
		this.app = app;
		this.socket;
		this.connectWS();
		this.serverId;
		this.pointBuffer = [];
		setInterval(() => this.checkPointBuffer(), 16)
	}
	checkPointBuffer() {
		const point = this.pointBuffer.shift()
		if (point) {
			if (!this.pointManager.getById(point._id)) {
				this.pointManager.addPoint(point);
			} else {
				this.pointManager.updatePoint(point);
			}
		}
	}
	connectWS() {
		this.socket = new WebSocket(WSS_URL);
		const self = this;
		this.socket.onopen = function () {
			console.log("WSS connected");
			self.setupWebsocket();
		};
	}
	setupWebsocket() {
		const self = this;
		this.socket.onclose = function () {
			setTimeout(self.connectWS.bind(self), 1000);
			console.log("Websocket closed.. attempting to reconnect");
		};
		this.socket.onmessage = function (message) {
			const data = JSON.parse(message.data);
			switch (data.event) {
				case "heartbeat":
					self.socket.send(HEATRBEAT);
					break;
				case "updatePoint":
					self.getPoint(data.id);
					break;
				case "newLayers":
					self.getNewJWT();
					break;
				case "serverId":
					self.handleServerId(data);
			}
		};
	}
	//If server restarts we want to tell the client they are not logged in
	handleServerId(data) {
		if (!this.serverId) {
			this.serverId = data.id;
		} else {
			if (this.serverId != data.id) {
				this.app.setLoggedIn(false);
			}
		}
	}
	authorizeWebsocket(jwt) {
		this.socket.send(
			JSON.stringify({
				event: "authorize",
				token: jwt,
			})
		);
	}
	async getNewJWT() {
		if (!this.app.isLoggedIn) {
			return;
		}
		const res = await fetch(API_URL + `updateJWT`, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + this.app.storage.getItem("jwt"),
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		if (res.status == 200) {
			this.app.storage.setItem("jwt", data.jwt);
			this.app.user = jwt_decode(data.jwt);
			this.app.onLogin(); //New JWT is kinda like logging in again, need to make many of the same actions
		} else if (res.status == 401) {
			this.app.setLoggedIn(false);
		}
	}
	//Requests points from the server, then gives the data to the point manager
	async getPoints() {
		// if (!this.app.isLoggedIn) {
		// 	return;
		// }
		const res = await fetch(API_URL + `points`, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + this.app.storage.getItem("jwt"),
				"Content-Type": "application/json",
			},
		});
		if (res.status == 200) {
			const data = await res.json();
			//Add new
			data.points.forEach((point) => {
				point.id = point._id;
				this.pointBuffer.push(point)
			});
			//Remove deleted
			this.pointManager.points.forEach((point) => {
				if (!data.points.find((p) => p._id == point.id)) {
					this.pointManager.removeById(point.id);
				}
			});
		} else if (res.status == 401) {
			this.app.setLoggedIn(false);
		}
		app.setLoadingMessage("Done!");
		app.hideLoadingMessage();
	}
	//Gets singular point from server
	async getPoint(id) {
		const res = await fetch(`${API_URL}point/${id}`, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + this.app.storage.getItem("jwt"),
				"Content-Type": "application/json",
			},
		});
		switch (res.status) {
			case 200:
				const data = await res.json();
				const point = data.point;
				point.id = point._id;
				if (!this.pointManager.getById(point._id)) {
					this.pointManager.addPoint(point);
				} else {
					this.pointManager.updatePoint(point);
				}
				break;
			case 400:
				this.pointManager.removeById(id);
				break;
			case 401:
				this.app.setLoggedIn(false);
				break;
			default:
				console.error(
					`Got unknown API responce code ${res.status}: ${res.statusText}`
				);
		}
	}
	//Requests a point to be deleted
	async deletePoint(id) {
		let request = {
			method: "POST",
			headers: {
				Authorization: "Bearer " + this.app.storage.getItem("jwt"),
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: id,
			}),
		};
		const res = await fetch(API_URL + "delPoint", request);
		//This is causing some interesting behavior, would have made deletion more responsive but the delay is not that high anyways
		// if (res.status == 200) {
		// 	this.pointManager.removeById(id);
		// }
		if (res.status == 401) {
			this.app.setLoggedIn(false);
		}
		return res.status;
	}
	//Tells the server to create a new point
	async createPoint(point) {
		let request = {
			method: "POST",
			headers: {
				Authorization: "Bearer " + this.app.storage.getItem("jwt"),
				"Content-Type": "application/json",
			},
			body: JSON.stringify(point),
		};
		const res = await fetch(API_URL + "addPoint", request);
		let data;
		try {
			data = await res.json();
		} catch (e) {
			/*Shhh*/
		}
		if (res.status == 401) {
			this.app.setLoggedIn(false);
		}
		if (data && data.id) {
			this.app.pointManager.initFocusOn = data.id;
			this.app.pointManager.hasInitFocus = false;
		}
		return res.status;
	}
	//Tells the server to update an existing point
	async updatePoint(id, point) {
		point._id = id;
		let request = {
			method: "POST",
			headers: {
				Authorization: "Bearer " + this.app.storage.getItem("jwt"),
				"Content-Type": "application/json",
			},
			body: JSON.stringify(point),
		};
		const res = await fetch(API_URL + "editPoint", request);
		return res.status;
	}
	async getPubJWT() {
		// app.onLogin();
		const res = await fetch(API_URL + `publicJWT`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (res.status == 200) {
			const data = await res.json();
			this.app.storage.setItem("jwt", data.jwt);
			this.app.user = jwt_decode(data.jwt);
			this.app.onLogin();
		}
	}
	//Asks the server if our JWT is valid
	async confirmJWT(jwt) {
		const res = await fetch(API_URL + "checkJWT", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + jwt,
			},
		});
		const jsonRes = await res.json();
		if (!jsonRes || !jsonRes.valid) {
			this.app.setLoggedIn(false);
			this.app.user = null;
			return false;
		} else {
			this.app.user = jwt_decode(jwt);
			if (this.app.user.isPubToken) {
				this.app.setLoggedIn(false);
				this.app.onLogin();
			} else {
				this.app.setLoggedIn(true);
			}
			if (getExpInDays(this.app.user) < 2) {
				this.getNewJWT();
			}
			return true;
		}
	}
	async getJWTFromCode(code) {
		const res = await fetch(API_URL + "auth/jwt", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"jwt-lookup-code": code,
			},
		});
		try {
			const jsonRes = await res.json();
			return jsonRes.jwt;
		} catch (e) {
			return;
		}
	}
}