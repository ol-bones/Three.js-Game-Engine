"use strict";

import RenderComponent from "./../RenderComponent";
import {mix} from "mixwith";

class OBJRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
		super(args);
    }

    Initialise()
    {
		super.Initialise();

		this.m_Mesh = model(this.m_Args.model);
		this.m_Meshes = _.flattenDeep(this.m_Mesh.children);
		this.m_Meshes.forEach(m => m.material = m.material.clone());
		this.m_Meshes.forEach(m =>
		{
			m.m_ParentEntity = this.m_Parent
			m.castShadow = this.m_Args.castShadow == void(0) ? true : this.m_Args.castShadow;
			m.receiveShadow = true;
			if(this.m_Args.renderOrder !== undefined) m.renderOrder = this.m_Args.renderOrder;
		});

		if(this.m_Args.texture) this.SetTexture(this.m_Args.texture);
		if(this.m_Args.material)
		{
			this.SetMaterial(this.m_Args.material, this.OnInitialised.bind(this));
		}
		else
		{
			this.OnInitialised();
		}
    }

    SetTexture(name)
    {
		try
		{
			this.m_Meshes.forEach(m => {
				m.material.map = texture(name);
				m.material.map.needsUpdate = true;
				m.material.transparent = true;
				m.material.alphaTest = 0.5;
				m.material.side = 2;
				m.material.shininess = 2;
				m.material.lights = true;
				m.material.fog = true;
				m.material.needsUpdate = true;
			});
		}
		catch(Exception)
		{
			setTimeout(() => this.SetTexture(name), 100);
		}
	}

	SetMaterial(name, oncomplete)
	{
		try
		{
			this.m_Meshes.forEach(m => {
				m.material = window.material(name);
				m.material.map.needsUpdate = true;
				m.material.needsUpdate = true;
			});

			if(oncomplete) oncomplete();
		}
		catch(Exception)
		{
			setTimeout(() => this.SetMaterial(name), 100);
		}
	}
	
    SetColor(col, failedAttempts = 0)
    {
		this.m_Colour = col;
		this.m_Meshes.forEach(m =>
		{
			try
			{
				m.material.color.set(col);
			}
			catch (e)
			{
				if(failedAttempts > 10)
				{
					console.error(e);
				}
				else
				{
					setTimeout(() => this.SetColor(col, failedAttempts + 1), 100);
				}
			}
		});
	}
	
	SetOpacity(o)
	{
		this.m_Meshes.forEach(m =>
			m.material.opacity = o
		);
	}

	Highlight()
	{
		this.m_Meshes.forEach(m =>
			m.material.color.set(new THREE.Color(10, 1, 1))
		);
	}

	Unhighlight()
	{
		this.m_Meshes.forEach(m =>
			m.material.color.set(this.m_Colour)
		);
	}

    Update()
    {
    }
}

export default OBJRenderComponent;