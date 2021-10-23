"use strict";

import * as THREE from "three";
import * as CANNON from 'cannon-es';
import cannonDebugger from 'cannon-es-debugger'

import BaseObject from "./../entity/entities/BaseObject";
import Comms from "./mixins/Comms/Comms";
import {mix} from "mixwith";

class World extends mix(BaseObject).with(Comms)
{
	constructor() {
		super();

		this.m_Position = new THREE.Vector3();

		this.m_EntityCount = 0;
		this.m_Entities = [];
		this.m_FlatEntities = [];
		this.m_Scene = {};
		this.m_EditorScene = {};

		this.m_Camera = {};

		this.m_Controls = {};
		this.m_LocalPlayer = {};

		this.m_PhysicsWorld = {};
		this.m_Renderer = {};
	}

	Initialise() {
		console.log(ENGINE);
		this.m_Entities = [];

		this.m_PhysicsWorld = new CANNON.World({
			allowSleep: true,
			quatNormalizeFast: true,
			quatNormalizeSkip: 1.0
		});
		this.m_PhysicsWorld.gravity.set(0, -98, 0);
		this.m_PhysicsWorld.broadphase = new CANNON.NaiveBroadphase();
		this.m_PhysicsWorld.solver.iterations = 3;
		this.m_PhysicsWorld.solver.tolerance = 0.05;
		this.m_PhysicsWorld.defaultMaterial.friction = 0;
		this.m_PhysicsWorld.defaultContactMaterial.friction = 0;
		this.m_Scene = new THREE.Scene();
		this.m_EditorScene = new THREE.Scene();
		//if(window.EDITOR != void(0)) this.m_DebugRenderer = new THREE.CannonDebugRenderer(this.m_Scene, this.m_PhysicsWorld);

		this.m_Camera = new THREE.PerspectiveCamera(
			70, window.innerWidth / window.innerHeight, 0.1, 100000
		);

		this.m_Renderer = new THREE.WebGLRenderer({
			powerPreference: "high-performance"
		});

		this.m_Renderer.setClearColor(new THREE.Color(0x0, 0x0, 0x0));
		this.m_Renderer.setSize(window.innerWidth, window.innerHeight);
		this.m_Renderer.shadowMap.enabled = true;
		this.m_Renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.m_Renderer.shadowMap.autoUpdate = true;
		this.m_Renderer.debug.checkShaderErrors = false;
		//this.m_Renderer.shadowMap.renderSingleSided = false;
		//this.m_Renderer.shadowMap.renderReverseSided = true;

		this.m_Camera.position.x = 1500;
		this.m_Camera.position.y = 1000;
		this.m_Camera.position.z = -2500;
		this.m_Camera.lookAt(this.m_Scene.position);


		setTimeout(() => {
			if(window.EDITOR == void(0))
			{
				const colour = new THREE.Color(0x15161f);
				this.m_Scene.background = colour;
				this.m_Scene.fog = new THREE.FogExp2(colour, 0.0035);
				var ambientLight = new THREE.AmbientLight(0x000000);
				this.m_Scene.add(ambientLight);
				var spotLight = new THREE.SpotLight(0x606c7d);
				spotLight.position.set(500, 500, 1000);
				spotLight.castShadow = true;
				spotLight.shadow.mapSize.width = 256;
				spotLight.shadow.mapSize.height = 256;
				spotLight.shadow.camera.near = 0.5;
				spotLight.shadow.camera.far = 5000;
				spotLight.shadow.bias = 0.00005;
				//spotLight.angle = Math.PI/2;
				const dummyObject = new THREE.Object3D();
				dummyObject.position.set(1000, 0, -600);
				this.m_Scene.add(dummyObject);
				spotLight.target = dummyObject;
				this.m_Scene.add(spotLight);
				console.log(spotLight);
			}
			else
			{
				var ambientLight = new THREE.AmbientLight(0x404040);
				this.m_Scene.add(ambientLight);
			}
		}, 5000);

		document.getElementsByClassName("game-canvas")[0].appendChild(this.m_Renderer.domElement);

		this.m_Renderer.setAnimationLoop(this.render.bind(this));
	}

	Update(dt) {
		//this.ProcessInboundCommsQueue();
		this.m_PhysicsWorld.step(1 / 30, dt, 3);
		//this.m_DebugRenderer.update();

		this.m_Entities.forEach(e => e.Update(dt));
	}

	render() {
		this.m_Renderer.autoClear = false;
		this.m_Renderer.render(this.m_Scene, this.m_Camera);
		
		if(window.EDITOR != void(0)) this.m_Renderer.render(this.m_EditorScene, this.m_Camera);
	}
}

export default World;