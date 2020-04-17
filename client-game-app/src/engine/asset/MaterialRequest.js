"use strict";

import AssetRequest from "./AssetRequest";
import LOADSTATE from "./LoadState";
import {mix} from "mixwith";

const axios = require('axios');

class MaterialRequest extends mix(AssetRequest).with()
{
    constructor(uri)
    {
		super(uri);

		this.m_Data = null;
    }

    Initialise()
    {
		this.m_LoadState = LOADSTATE.INITIALISING;

		this.OnInitialised();
    }

    Download()
    {
		try
		{
			this.OnDownloading();
			axios.get(`http://${CONFIG.host}/materials/` + this.m_URI + ".json")
				.then((data) => this.OnComplete(data.data))
				.catch((error) => this.OnError(error));
		}
		catch(Exception)
		{
			this.OnError(Exception);
		}
    }

    OnComplete(data)
    {
		super.OnComplete();
		this.m_Data = data;
		this.m_LoadState = LOADSTATE.PROCESS;
    }

    OnFinished(material)
    {
		this.m_Asset = material;
		super.OnFinished();
    }

    Process()
    {
		try
		{
			let material;

			const data = this.m_Data;
			switch(data.type)
			{
				case "THREE.MeshPhongMaterial":
				{
					material = new THREE.MeshPhongMaterial(
					{
						color: data.color ? new THREE.Color().setHex(data.color) : new THREE.Color(1,1,1),
						map: texture(data.texture),
						transparent: true,
						opacity: 1
					});

					if(data.repeat && data.repeat.length === 2)
					{
						if(data.repeat[0] > 1 || data.repeat[1] > 1)
						{
							material.map.repeat.set(data.repeat[0], data.repeat[1]);
							material.map.wrapS = THREE.RepeatWrapping;
							material.map.wrapT = THREE.RepeatWrapping;
						}
					}

					material.map.needsUpdate = true;
					material.needsUpdate = true;
					break;
				}
				case "TerrainMapMaterial":
				{
					const map = texture(data.texture || "/grass2.jpg");
					const map2 = texture(data.texture2 || "/default.jpg");
					const glsl = json("/shaders/TerrainMapMaterial");

					const color = new THREE.Color(1,1,1);

					const canvas  = document.createElement('canvas');
					canvas.width = data.blendmap[0].length;
					canvas.height = data.blendmap.length;
					
					const context = canvas.getContext("2d");
					const imgData = context.createImageData(canvas.width, canvas.height);
					
					let index = 0;
					for(let y = data.blendmap.length - 1; y >= 0; y--)
					{
						for(let x = 0; x < data.blendmap[0].length; x++)
						{
							imgData.data[index++] = data.blendmap[x][y]; // R
							imgData.data[index++] = data.blendmap[x][y]; // G
							imgData.data[index++] = data.blendmap[x][y]; // B
							imgData.data[index++] = data.blendmap[x][y]; // A
						}
					}

					context.putImageData(imgData, 0, 0);
				
					var image = new Image();
					image.src = canvas.toDataURL();

					const bm = new THREE.Texture();
					bm.format = THREE.RGBAFormat;
					bm.image = image;

					material = new THREE.ShaderMaterial(
					{
						uniforms: THREE.UniformsUtils.merge([
							THREE.ShaderLib.phong.uniforms,
							{
								map: { type: "t", value: map},
								map2: { type: "t", value: map2},
								blendmap: { type:"t", value: bm },
								diffuse: { type: "c", value: color },
								emissive: { type: "c", value: new THREE.Color(0x000000) },
								specular: { type: "c", value: new THREE.Color(0x111111) },
								shininess: { type: "f", value: 30 },
								repeat: { type: "v2", value: new THREE.Vector2(data.repeat[0], data.repeat[1]) }
							}
						]),
						vertexShader: glsl.vertexShader,
						fragmentShader: glsl.fragmentShader,
						lights: true,
						defines: {
							USE_MAP: true,
							USE_UV: true
						}
					});

					if(data.repeat && data.repeat.length === 2)
					{
						if(data.repeat[0] > 1 || data.repeat[1] > 1)
						{
							material.uniforms.map.value.repeat.set(data.repeat[0], data.repeat[1]);
							material.uniforms.map.value.wrapS = THREE.RepeatWrapping;
							material.uniforms.map.value.wrapT = THREE.RepeatWrapping;
							material.uniforms.map2.value.repeat.set(data.repeat[0], data.repeat[1]);
							material.uniforms.map2.value.wrapS = THREE.RepeatWrapping;
							material.uniforms.map2.value.wrapT = THREE.RepeatWrapping;
						}
					}
					
					material.uniforms.map.value.needsUpdate = true;
					material.uniforms.map2.value.needsUpdate = true;
					material.uniforms.blendmap.value.needsUpdate = true;
					material.combine = THREE.MultiplyOperation;

					material.color = color;
					material.blendmap = data.blendmap;
					break;
				}
				default:

					break;
			}

			this.OnFinished(material);
		}
		catch(Exception)
		{
			console.log(Exception);
		}
    }
}

export default MaterialRequest;

