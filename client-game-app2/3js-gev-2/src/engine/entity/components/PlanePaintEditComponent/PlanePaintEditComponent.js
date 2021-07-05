"use strict";

import Entity from "./../../entities/Entity";
import Component from "./../Component";
import {mix} from "mixwith";

class PlanePaintEditComponent extends mix(Component).with()
{
    constructor(args)
    {
		super(args);

		this.m_LastMouse = new THREE.Vector2();

		this.m_Draggables = [];
		this.m_AxisHelpers = [];

		this.m_DragControls = null;

		this.m_Name = "PlanePaintEditComponent";

		this.m_ModifyArrows = [];
		this.m_AreaSelected = false;

		this.m_Step = new THREE.Vector3(0, 0, 1);
		this.m_PaintStrength = 1;
		this.m_BrushSize = 1;

		this.m_BlendMapMesh = null;
    }

    Initialise()
    {
		super.Initialise();
	
		this.CreateArrows();

		this.m_Parent.m_ClickFunctions[0] = this.onMouseDown.bind(this);

		const renderComponent = this.m_Parent.m_Components.RenderComponent;
		const blendMapRef = renderComponent.m_Args.material.blendmap;
		const width = blendMapRef.length;
		const height = blendMapRef[0].length;
		this.m_BlendMapMesh = this.CreateBlendMapMesh(width, height);
		this.AddBlendMapMeshToEditorScene(this.m_BlendMapMesh);

		this.OnInitialised();
    }

	CreateArrows()
	{
		const up = new THREE.Vector3(0, 1, 0);
		if(this.m_ModifyArrows.length)
		{
			this.m_ModifyArrows.forEach(arrow => {
				ENGINE.m_World.m_EditorScene.remove(arrow);
			});

			this.m_ModifyArrows = [];
		}

		for(let i = 0; i < this.m_BrushSize; i++)
		{
			const arrow = new THREE.ArrowHelper
			(
				up,
				this.m_Parent.m_Position,
				1,
				0x00FF00,
				4,
				2
			);

			ENGINE.m_World.m_EditorScene.add(arrow);
			this.m_ModifyArrows.push(arrow);
		}
	}

	CreateBlendMapMesh(width, height)
	{
		try
		{
			const renderComponent = this.m_Parent.m_Components.RenderComponent;
			const geometry = renderComponent.m_Mesh.geometry;

			return new THREE.Mesh(
				new THREE.PlaneGeometry(
					geometry.boundingBox.max.x,
					geometry.boundingBox.max.y,
					width,
					height
				)
			);
		} catch(e) { return null; }
	}

	AddBlendMapMeshToEditorScene(mesh)
	{
		try
		{
			this.m_BlendMapMesh = mesh;
			ENGINE.m_World.m_EditorScene.add(mesh);
			mesh.applyMatrix4(this.m_Parent.m_Components.RenderComponent.m_Mesh.matrixWorld);
			mesh.geometry.computeBoundingBox();
			const offsetx = mesh.geometry.boundingBox.max.x;
			const offsety = mesh.geometry.boundingBox.max.y;
			mesh.geometry.translate(offsetx, offsety, 0);
			mesh.geometry.verticesNeedUpdate = true;
			mesh.material.visible = false;
		} catch(e) {}
	}

	DeleteBlendMapMesh()
	{
		try
		{
			ENGINE.m_World.m_EditorScene.remove(this.m_BlendMapMesh);
			this.m_BlendMapMesh = null;
		} catch(e) {}
	}

    Update()
    {
		try
		{
		const hoveredEnt = ENGINE.m_Mouse.m_CurrentHoveredObject.m_ParentEntity;
		const mousePos = ENGINE.m_Mouse.m_WorldPosition;

			try
			{
				if(hoveredEnt != void(0) && hoveredEnt === this.m_Parent)
				{
					const verts = this.m_BlendMapMesh.geometry.vertices
						.map((v,i) => [v.clone().applyMatrix4(this.m_BlendMapMesh.matrixWorld), i])
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

				if(!renderComponent.m_Mesh.material.uniforms.blendmap.value) return;

				const blendMapRef = renderComponent.m_Args.material.blendmap;
				const material = renderComponent.m_Mesh.material;
				const blendGeometry = this.m_BlendMapMesh.geometry;

				const vertRef = (i) => new THREE.Vector2(
					blendGeometry.vertices[i].x / geometry.boundingBox.max.x, 
					blendGeometry.vertices[i].y / geometry.boundingBox.max.y
				);

				const min = new THREE.Vector2();
				const max = new THREE.Vector2(blendMapRef.length, blendMapRef.length);

				const vertVector = (v) => vertRef(v)
					.multiplyScalar(blendMapRef.length)
					.subScalar(1)
					.floor()
					.clamp(min, max);

				const paint = (v) => blendMapRef[v.x][v.y] = Math.max(Math.min(Math.floor(
					blendMapRef[v.x][v.y] + this.m_PaintStrength
				), 255), 0);

				this.m_VertsSelected.map(vertVector).forEach(paint);

				this.UpdateMaterial()
			}
		}
		catch(e) { console.log(e); }
	}

	UpdateMaterial()
	{
		try
		{
			const renderComponent = this.m_Parent.m_Components.RenderComponent;
			const blendMapRef = renderComponent.m_Args.material.blendmap;
			const material = renderComponent.m_Mesh.material;

			const canvas  = document.createElement('canvas');
			canvas.width = blendMapRef[0].length;
			canvas.height = blendMapRef.length;

			const context = canvas.getContext("2d");
			const imgData2 = context.createImageData(canvas.width, canvas.height);

			let index1 = 0;
			for(let y = blendMapRef.length - 1; y >= 0; y--)
			{
				for(let x = 0; x < blendMapRef[0].length; x++)
				{
					const pixel = Math.abs(Math.max(Math.min(Math.floor(blendMapRef[x][y]), 255), 0));

					imgData2.data[index1++] = pixel; // R
					imgData2.data[index1++] = pixel; // G
					imgData2.data[index1++] = pixel; // B
					imgData2.data[index1++] = pixel; // A
				}
			}

			context.putImageData(imgData2, 0, 0);

			var image2 = new Image();
			image2.src = canvas.toDataURL();

			const bm2 = new THREE.Texture();
			bm2.format = THREE.RGBAFormat;
			bm2.image = image2;

			material.uniforms.blendmap.value = bm2;
			material.uniforms.blendmap.value.needsUpdate = true;
			material.uniformsNeedUpdate = true;
		}
		catch(e) { console.log(e); }
	}

    Remove()
    {
		try
		{
			super.Remove();
			
			this.m_AreaSelected = false;

			this.m_ModifyArrows.forEach(v => ENGINE.m_World.m_EditorScene.remove(v));
			delete this.m_ModifyArrows;

			this.DeleteBlendMapMesh();
		}
		catch(e) { console.log(e); }
    }
}

export default PlanePaintEditComponent;