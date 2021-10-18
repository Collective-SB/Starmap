//Something to handle moving the camera between POI's
/*global THREE*/
import {
	EOS_SIZE,
	ZOOM_INTO_DIST,
	CAM_MAX_ZOOM
} from "./config.js";
export default class CamController {
	constructor(camera, domElm, app) {
		this.camera = camera;
		var geometry = new THREE.CylinderGeometry(10, 10, 10, 10);
		var material = new THREE.MeshBasicMaterial({
			color: 0xffff00,
			wireframe: true,
		});
		this.infrontOfCam = new THREE.Mesh(geometry, material);

		this.camera.add(this.infrontOfCam);
		this.infrontOfCam.position.set(0, 0, -10);

		this.orbitCtrl = new THREE.OrbitControls(camera, domElm);
		this.lerpTarget = new THREE.Vector3(0, 0, 0);
		this.posLerp = false;
		this.rotLerp = false;
		this.dist = 0;
		this.app = app;
		this.lastPos = {
			x: 0,
			y: 0,
			z: 0
		}
		// this.samePosTime = 0
		this.init();
	}
	//Initilizes the camera controller
	init() {
		this.orbitCtrl.mouseButtons.LEFT = 2;
		this.orbitCtrl.mouseButtons.RIGHT = 0;
		this.orbitCtrl.mouseButtons.MIDDLE = -1;
		//Prevent weird panning when pressing wasd
		this.orbitCtrl.keys.LEFT = 0;
		this.orbitCtrl.keys.RIGHT = 0;
		this.orbitCtrl.keys.UP = 0;
		this.orbitCtrl.keys.DOWN = 0;

		this.orbitCtrl.target.set(
			this.app.sceneObjs.Safe.position.x,
			this.app.sceneObjs.Safe.position.y,
			this.app.sceneObjs.Safe.position.z
		);
		this.orbitCtrl.enableDamping = true;
		this.orbitCtrl.maxDistance = CAM_MAX_ZOOM;

		this.camera.position.set(EOS_SIZE * 10, 1000000, 1000000);
		//once points are loaded in point manager this will lerp to the starting point
		app.sceneObjs.renderer.domElement.addEventListener("click", (e) => this.stopCurrentMove());
		app.sceneObjs.renderer.domElement.addEventListener("wheel", (e) => this.stopCurrentMove());
	}
	//Called to move the camera to the target point
	update() {
		let distanceTo = this.camera.position.distanceTo(this.orbitCtrl.target);
		this.dist = distanceTo;

		if (this.posLerp) {
			if (
				this.camera.position.distanceTo(this.lerpTarget) < ZOOM_INTO_DIST
			) {
				this.posLerp = false;
			} else {
				this.camera.position.lerp(this.lerpTarget, 0.05);
			}
		}
		if (this.rotLerp) {
			var rotationMatrix = new THREE.Matrix4();
			var targetQuaternion = new THREE.Quaternion();
			rotationMatrix.lookAt(
				this.camera.position,
				this.lerpTarget,
				this.camera.up
			);
			targetQuaternion.setFromRotationMatrix(rotationMatrix);
			this.camera.quaternion.rotateTowards(targetQuaternion, 0.05);
			this.camera.updateMatrixWorld();
			var vector = new THREE.Vector3();
			vector.setFromMatrixPosition(this.infrontOfCam.matrixWorld);
			this.orbitCtrl.target = vector;
			if (this.camera.quaternion.equals(targetQuaternion)) {
				this.orbitCtrl.target.set(
					this.lerpTarget.x,
					this.lerpTarget.y,
					this.lerpTarget.z
				);
				this.rotLerp = false;
			}
		}
		const curPos = {
			x: Math.round(this.camera.position.x),
			y: Math.round(this.camera.position.y),
			z: Math.round(this.camera.position.z),
		}
		if (
			curPos.x != this.lastPos.x ||
			curPos.y != this.lastPos.y ||
			curPos.z != this.lastPos.z
		) {
			this.app.lastMouseMoved = Date.now();
			this.lastPos = {
				x: curPos.x,
				y: curPos.y,
				z: curPos.z
			}
		}
		this.orbitCtrl.update();
		this.orbitCtrl.position0.set(0, 0, 0); //Dont ask me why this is here
	}
	//Instructs the camera to go to a new point in space
	lerpCamTo(x, y, z) {
		this.lerpTarget.set(x, y, z);
		this.posLerp = true;
		this.rotLerp = true;
	}

	posLerpTo(x, y, z) {
		this.lerpTarget = new THREE.Vector3(x, y, z)
		this.posLerp = true;
	}
	stopCurrentMove() {
		this.posLerp = false;
		this.rotLerp = false;
	}
}