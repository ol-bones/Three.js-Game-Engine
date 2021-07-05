"use strict";

import * as THREE from "three";
import RenderComponent from "./../RenderComponent";
import {mix} from "mixwith";

class FlameRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
		super(args);
    }

    Initialise()
    {
		super.Initialise();

		var geoBox = new THREE.SphereGeometry(
			25, 25, 100
		);

		geoBox.center();

		const mat = material("flame");
		if(mat == void(0)) throw new Error();
		var mshBox = new THREE.Mesh(geoBox, mat);

		this.m_Mesh = mshBox;
		this.m_Meshes = mshBox;
		this.OnInitialised();

		this.m_LastGreen = 1.0;
    }

    Update(dt)
    {
		const now = performance.now();
		const delta = (now - (((now/1000) << 2 >> 2) * 1000)) / 1000;
		this.m_Mesh.material.uniforms.delta.value = delta;

		const light = this.m_Parent.m_Components.LightComponent;
		if(light)
		{
			this.m_LastGreen += (Math.random() - 0.5) * 0.05;
			this.m_LastGreen = this.m_LastGreen % 1;
			light.SetColor(new THREE.Color(
				1.0,
				Math.min(Math.max(this.m_LastGreen, 0.25), 0.75),
				0.0
			).getHex());
		}
    }
}

export default FlameRenderComponent;