"use strict";

import RenderComponent from "./../RenderComponent";
import {mix} from "mixwith";

class VegetationMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
		super(args);

		const isEditor = window.EDITOR != void(0);

		if(!isEditor)
		{

		}
		else
		{
		}
    }

    Initialise()
    {
		super.Initialise();

		const isEditor = window.EDITOR != void(0);

		if(!isEditor)
		{

			const count = this.m_Args.count;

			let vegetationMesh = this.CreateMesh(
				material(this.m_Args.material || "default"),
				count
			);

			const width = this.m_Args.Scale.x;
			const height = this.m_Args.Scale.z;
			const veg = new THREE.Object3D();

			if(this.m_Args.distribution === "uniform")
			{
				const lenTotal = Math.floor(Math.sqrt(count));
				this.UniformDistribution(veg, lenTotal, width, height, vegetationMesh);
			}
			else
			{
				this.RandomDistribution(veg, count, width, height, vegetationMesh);
			}
			
			this.m_Mesh = vegetationMesh;
			this.m_Meshes = vegetationMesh;

			this.OnInitialised();
		}
		else
		{
			var geoBox = new THREE.BoxGeometry(1,1,1);
			geoBox.center();
	
			var mshBox = new THREE.Mesh(geoBox, new THREE.MeshBasicMaterial({
				color: 0xffffff,
				transparent: true,
				map: texture("/vegetationseed.jpg"),
				opacity: 0.25
			}));

			mshBox.material.needsUpdate = true;
			mshBox.material.map.needsUpdate = true;

			this.m_Mesh = mshBox;
			this.m_Meshes = mshBox;
			this.OnInitialised();
		}
    }

	UniformDistribution(veg, len, width, height, mesh)
	{
		let index = 0;
		for(let x = 1; x <= len; x++)
		{
			for(let y = 1; y <= len; y++)
			{
				veg.position.set(
					((x/len) * width) - width/2,
					Math.random() * 5,
					((y/len) * height) - height/2
				);

				veg.rotation.set(
					Math.random() * (Math.PI*0.05),
					Math.random() * Math.PI,
					Math.random() * (Math.PI*0.05)
				)

				veg.updateMatrix();
				mesh.setMatrixAt(index, veg.matrix);
				index++;
			}
		}
	}

	RandomDistribution(veg, len, width, height, mesh)
	{
		for(let i = 0; i <= len; i++)
		{
			veg.position.set(
				(Math.random() * width) - width/2,
				Math.random() * 5,
				(Math.random() * height) - height/2
			);

			veg.rotation.set(
				Math.random() * (Math.PI*0.05),
				Math.random() * Math.PI,
				Math.random() * (Math.PI*0.05)
			)

			veg.updateMatrix();
			mesh.setMatrixAt(i, veg.matrix);
		}
	}

	CreateMesh(veg_material, count)
	{
		if(veg_material == void(0)) throw new Error();
		if(this.m_Args.lathe != void(0))
		{
			const heightSegments = this.m_Args.lathe.heightSegments;
			const vegHeight = this.m_Args.lathe.vegHeight;
			const vegWidth = this.m_Args.lathe.vegWidth;

			const points = [];
			for(let i = 0; i < heightSegments+1; i++)
			{
				points.push(new THREE.Vector2(
					i * vegWidth,
					i * vegHeight
				));
			}

			const geom = new THREE.LatheBufferGeometry(points);
			return new THREE.InstancedMesh(geom, veg_material, count);
		}
	}

    SetScale(x,y,z)
    {
		if(window.EDITOR != void(0)) this.m_Mesh.scale.set(x,y,z);
	}
	

    SetColor(c)
    {
		// fuck you
    }

    Update()
    {
    }
}

export default VegetationMeshRenderComponent;