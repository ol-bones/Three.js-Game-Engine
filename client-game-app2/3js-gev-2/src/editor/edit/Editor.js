"use strict";

import * as THREE from "three";
import { OrbitControls }  from "./../../libs/OrbitControls";

import World from "./../../engine/entity/World";
import BaseObject from "./../../engine/entity/entities/BaseObject";
import Entity from "./../../engine/entity/entities/Entity";

import WorldLoader from "./../mixins/WorldLoader";
import EditToolsControl from "./../mixins/EditToolsControl";

import {mix} from "mixwith";

class Editor extends mix(BaseObject).with(WorldLoader, EditToolsControl)
{
    constructor()
    {
		super();

		this.m_UpdateIntervalID = null;
		this.m_SelectedEntity = null;

		ENGINE.OnInitialised = () => this.Initialise();

		this.m_UICallbacks = {};
    }

    Initialise()
    {
		window.EDITOR = this;

		ENGINE.m_World.m_Controls = new OrbitControls(ENGINE.m_World.m_Camera, ENGINE.m_World.m_Renderer.domElement);

		ENGINE.m_World.m_Camera.position.set(4615, 2983, 440);

		ENGINE.m_World.m_Camera.quaternion.set(
			-0.37519805904961856,
			0.24519856029339523,
			0.10361291255600737,
			0.8879011470130592
		);

		this.m_EditModeToggled = true;
		ENGINE.StopUpdating(1);
		ENGINE.BeginUpdating(2, () => ENGINE.m_World.m_Entities.forEach(e=>e.Update()));

		let grid = new THREE.GridHelper(100000, 100);
		ENGINE.m_World.m_Scene.add(grid);
	//	this.LoadWorld();
	}
	
	AddEntity(json, wp = true)
	{
		try
		{
			this.SetSelectedEntity(null, false);
			Entity.FromFile(window.json(json), wp ? ENGINE.m_World.m_Entities[0] : null, new THREE.Vector3(0,0,0));
		} catch(e) { setTimeout(this.AddEntity.bind(this, json, wp), 50); }
	}

    AddNewBox()
    {
		Entity.FromFile(
		{
			"pos":
			{
				"x":0,
				"y":150,
				"z":0
			},
			"rot":
			{
				"x":0,
				"y":0,
				"z":0,
				"w":1
			},
			"parent":0,
			"entities":[],
			"components":
			[
				{
					"args":
					{
					"Scale":
					{
						"x": 25,
						"y": 25,
						"z": 25
					}
					},
					"name":"BasicBoxMeshRenderComponent",
					"updateable":false
				},
				{
					"args":{"Type":1},
					"name":"BasicPhysicsComponent",
					"updateable":false
				}
			]
		}, entities()[0], new THREE.Vector3(0,0,0));
	}

	AddNewSphere()
	{
		Entity.FromFile(
		{
			"pos": {"x":0,"y":150,"z":0},
			"rot": {"x":0,"y":0,"z":0,"w":1},
			"parent":0,
			"entities":[],
			"components":
			[
				{
					"args":
					{
					"Radius": 25,
					"Segments": 36
					},
					"name": "BasicSphereMeshRenderComponent"
				},
				{
					"args":{"Type":1,"BodySettings":{"type":"sphere","radius":25, "move":true, "pos":{"x":0,"y":150,"z":0}}},
					"name": "BasicPhysicsComponent"
				}
			],
		}, entities()[0], new THREE.Vector3(0,0,0));
    }

	AddNewWorldPiece()
	{
		Entity.FromFile(
			{
				"id": "0",
				"pos": { "x": 0, "y": 0, "z": 0 },
				"rot": { "x":0, "y":0, "z":0, "w":1 },
				"scale": { "x": 1, "y": 1, "z": 1 },
				"entities": [],
				"components":
				[
					{
						"args": { "Parent": 0 },
						"name": "WorldPieceComponent",
						"updateable": false
					}
				]
			},
			null,
			new THREE.Vector3(0,0,0)
		);
	}

    DeleteEntity(id, evt)
    {
		if(evt)
		{
			evt.srcElement.parentElement.parentElement.remove();
			evt.cancelBubble = true;
		}
		entities().find(e => e.m_ID === id).Delete();
    }

    render()
    {
		this.m_Controls.update();
		super.render();
    }
}

window.Editor = {};
let EDITOR = window.Editor;

export default Editor;