"use strict";

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
    }

    Update()
    {
		const now = performance.now();
		const delta = (now - (((now/1000) << 2 >> 2) * 1000)) / 1000;
		this.m_Mesh.material.uniforms.delta.value = delta;
    }
}

export default FlameRenderComponent;