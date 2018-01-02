"use strict";

// Dependencies
// @Component@

class MaterialComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "MaterialComponent";

	this.m_Texture =  args.texture || "check.png";
	this.m_Material = null;

	// temporary
	this._Fade = 0;
    }

    Initialise()
    {
	super.Initialise();

	let mat_texture = texture(this.m_Texture);
	if(!mat_texture.isTexture) { return; }

	this.m_Material = new THREE.MeshPhongMaterial(
	{
	    color: 0x00FF00,
	    map: mat_texture,
	    transparent: true,
	    opacity: 0
	});

	this.OnInitialised();
    }

    Update()
    {
	this.m_Material.color.setHex("0x00FF00");
	this._Fade += 0.1;
	if(this._Fade > 3) { this._Fade = 0.5; }
	this.m_Material.opacity = Math.sin(this._Fade);
    }
}
