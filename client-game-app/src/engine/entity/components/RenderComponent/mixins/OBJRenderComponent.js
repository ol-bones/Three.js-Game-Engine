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
		});

		if(this.m_Args.texture) this.SetTexture(this.m_Args.texture);
		this.OnInitialised();
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
				m.material.needsUpdate = true;
			});
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
			this.m_Meshes.forEach(m => {
				m.material = window.material(name);
				m.material.map.needsUpdate = true;
				m.material.needsUpdate = true;
			});
		}
		catch(Exception)
		{
			setTimeout(() => this.SetMaterial(name), 100);
		}
	}
	
    SetColor(col)
    {
		this.m_Colour = col;
		this.m_Meshes.forEach(m =>
			m.material.color.set(col)
		);
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