"use strict";

import Entity from "./../../entities/Entity";
import Component from "./../Component";
import {mix} from "mixwith";

class HeightmapEditComponent extends mix(Component).with()
{
    constructor(args)
    {
		super(args);

		this.m_LastMouse = new THREE.Vector2();

		this.m_Draggables = [];
		this.m_AxisHelpers = [];

		this.m_DragControls = null;

		this.m_Name = "HeightmapEditComponent";

		this.m_ModifyArrows = [];
		this.m_AreaSelected = false;

		this.m_Step = new THREE.Vector3(0, 0, 1);
    }

    Initialise()
    {
		super.Initialise();
	
		const up = new THREE.Vector3(0, 1, 0);
		for(let i = 0; i < 9; i++)
		{
			const arrow = new THREE.ArrowHelper
			(
				up,
				this.m_Parent.m_Position,
				this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingSphere.radius*0.1,
				0x00FF00,
				4,
				2
			);

			ENGINE.m_World.m_EditorScene.add(arrow);
			this.m_ModifyArrows.push(arrow);
		}

		this.m_Parent.m_ClickFunctions[0] = this.onMouseDown.bind(this);

		this.OnInitialised();
    }

    Update()
    {
		// todo :
		// get mouse pos
		// get vertices near mouse pos
		// do stuff
		// etc

		try
		{
		const hoveredEnt = ENGINE.m_Mouse.m_CurrentHoveredObject.m_ParentEntity;
		const mousePos = ENGINE.m_Mouse.m_WorldPosition;

			try
			{
				if(hoveredEnt != void(0) && hoveredEnt === this.m_Parent)
				{
					const verts = hoveredEnt.m_Components.RenderComponent.m_Mesh.geometry.vertices
						.map((v,i) => [v.clone().applyMatrix4(hoveredEnt.m_Components.RenderComponent.m_Mesh.matrixWorld), i])
						.sort((v, n) => v[0].distanceTo(mousePos) - n[0].distanceTo(mousePos));

					this.m_ModifyArrows.forEach((a,i) => a.position.set(verts[i][0].x, verts[i][0].y, verts[i][0].z));
					this.m_AreaSelected = true;
					this.m_VertsSelected = verts.slice(0, this.m_ModifyArrows.length).map(v => v[1]);
				}
				else
				{
					this.m_AreaSelected = false;
				}
			}
			catch(e) { this.m_AreaSelected = false; }
		}
		catch(e) { this.m_AreaSelected = false; }
    }

	onMouseDown()
	{
		try
		{
			if(this.m_AreaSelected && this.m_ModifyArrows.length > 0)
			{
				const renderComponent = this.m_Parent.m_Components.RenderComponent;
				const geometry = renderComponent.m_Mesh.geometry;
				
				this.m_VertsSelected.forEach(v =>
					geometry.vertices[v].add(this.m_Step)
				);

				const divs = this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.Divisions;
				const saved = [];
				
				const heights = geometry.vertices.map(
					v => v.z
				).reverse();

				let index = 0;
				for(let y = divs; y >= 0; y--)
				{
					saved.push([]);
					for(let x = 0; x <= divs; x++)
					{
						saved[saved.length-1].push([heights[index], x, y]);
						index++;
					}
					saved[saved.length-1].reverse();
				}

				this.m_Parent.m_Components.PhysicsComponent.m_Args.BodySettings.HeightMap = saved.map(
					row => row.map(v =>
					{
						const z = v[0];
						const x = v[1];
						const y = v[2];

						const p = new THREE.Vector2(x,y);
						const m = new THREE.Vector2(divs/2,divs/2);
						const rot = Math.PI/2;
						const r = p.rotateAround(m, rot);
						const rp = saved[Math.round(r.y)][Math.round(r.x)];

						return rp[0];
					}).reverse()
				);

				geometry.verticesNeedUpdate = true;
				this.m_Parent.m_Components.PhysicsComponent.regeneratePhys();
			}
		}
		catch(e) { console.log(e); }
	}

	regeneratePhys()
	{
        this.m_Parent.m_Components.PhysicsComponent.regeneratePhys();
	}

	SetStepX(v)
	{
		this.m_Step.setX(v);
	}

	SetStepY(v)
	{
		this.m_Step.setY(v);
	}

	SetStepZ(v)
	{
		this.m_Step.setZ(v);
	}

    Remove()
    {
		super.Remove();
		
		this.m_AreaSelected = false;

		this.m_ModifyArrows.forEach(v => ENGINE.m_World.m_EditorScene.remove(v));
		delete this.m_ModifyArrows;
    }
}

export default HeightmapEditComponent;