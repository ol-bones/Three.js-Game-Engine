"use strict";

import Entity from "./../../entities/Entity";
import Component from "./../Component";
import {mix} from "mixwith";

class RenderComponent extends mix(Component).with()
{
    constructor(args)
    {
			super(args);

			this.m_Debuggable = true;

			this.m_Name = "RenderComponent";
			this.m_Parent.m_Renderable = true;
			this.m_Mesh = args.Mesh || null;

			this.m_Colour = new THREE.Color(1,1,1);
    }

    Initialise()
    {
			super.Initialise();
    }

    OnInitialised()
    {
		this.SetPosition(
			this.m_Parent.m_Position.x,
			this.m_Parent.m_Position.y,
			this.m_Parent.m_Position.z
		);

		this.m_Mesh.m_ParentEntity = this.m_Parent || null;

		this.m_Mesh.castShadow = this.m_Args.castShadow == void(0) ? true : this.m_Args.castShadow;
		this.m_Mesh.receiveShadow = true;

		ENGINE.m_World.m_Scene.add(this.m_Mesh);
		this.m_IsInitialised = true;
    }

    GetSize3()
    {
			let box = new THREE.Box3().setFromObject(
				this.m_Mesh
			);
			return new THREE.Vector3(
				Math.abs(box.max.x - box.min.x),
				Math.abs(box.max.y - box.min.y),
				Math.abs(box.max.z - box.min.z)
			);
    }

    GetSizeRadius()
    {
			let box = new THREE.Box3().setFromObject(
				this.m_Mesh
			);
			return box.min.distanceTo(box.max);
    }

    SetTexture(name)
    {
			try
			{
				this.m_Mesh.material.map = texture(name);
				this.m_Mesh.material.map.needsUpdate = true;
				this.m_Mesh.material.needsUpdate = true;
			}
			catch(Exception)
			{
				setTimeout(() => this.SetTexture(name), 100);
			}
		}
		
		SetMaterial(name)
		{
			try
			{
				this.m_Mesh.material = window.material(name);
				this.m_Mesh.material.map.needsUpdate = true;
				this.m_Mesh.material.needsUpdate = true;
			}
			catch(Exception)
			{
				setTimeout(() => this.SetMaterial(name), 100);
			}
		}

    SetColor(c)
    {
			this.m_Colour = c;
			this.m_Mesh.material.color.set(c);
	}
	
	SetOpacity(o)
	{
		this.m_Mesh.material.opacity = o;
	}

	Highlight()
	{
		try
		{
			this.m_Mesh.material.color.set(new THREE.Color(10, 1, 1));
		} catch(e) {}
	}

	Unhighlight()
	{
		try
		{
			this.m_Mesh.material.color.set(this.m_Colour);
		} catch(e) {}
	}

    SetPosition(x,y,z)
    {
			this.m_Mesh.position.set(x,y,z);
			if(this.m_Parent.m_Components.DebugComponent)
			{
				this.m_Parent.m_Components.DebugComponent.SetPosition(x,y,z);
			}
    }

    SetScale(x,y,z)
    {
		this.m_Mesh.scale.set(x,y,z);
    }

    Remove()
    {
			ENGINE.m_World.m_Scene.remove(this.m_Mesh);
			try
			{
				this.m_Mesh.material.dispose();
				delete this.m_Mesh.material;
			} catch(e) {}
			delete this.m_Mesh;
    }

    Update()
    {
	}
	
	InlineMaterialArgs()
	{
		const materialObject = this.m_Mesh.material;
		
		if(materialObject.map != void(0))
		{
			return {
				type: materialObject.type ? `THREE.${materialObject.type}` : "THREE.MeshPhongMaterial",
				texture: materialObject.map.image.currentSrc.split("textures")[1],
				repeat: [materialObject.map.repeat.x, materialObject.map.repeat.y],
				color: materialObject.color.getHex()
			}
		}
		else if(materialObject.uniforms != void(0))
		{
			return {
				type: "TerrainMapMaterial",
				texture: materialObject.uniforms.map.value.image.currentSrc.split("textures")[1],
				repeat: [materialObject.uniforms.repeat.value.x, materialObject.uniforms.repeat.value.y],
				color: new THREE.Color(1,1,1).getHex(),
				blendmap: materialObject.uniforms.blendmap.value
			}
		}
	}
}

export default RenderComponent;