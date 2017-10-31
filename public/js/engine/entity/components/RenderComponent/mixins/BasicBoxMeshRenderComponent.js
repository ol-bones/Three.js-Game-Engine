// Dependencies
// @RenderComponent@

class BasicBoxMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
	super(args);
    }

    Initialise()
    {
	super.Initialise();

	var boxTex = texture("check.png");
	if(!boxTex.isTexture) { return; }

	var matBox = new THREE.MeshPhongMaterial( { color: 0xffffff, map: boxTex } );

	var geoBox = new THREE.BoxGeometry(
	    this.m_Args.Scale ? this.m_Args.Scale.x : 25,
	    this.m_Args.Scale ? this.m_Args.Scale.y : 25,
	    this.m_Args.Scale ? this.m_Args.Scale.z : 25
	);

	if(this.m_Parent.m_Components.MaterialComponent)
	{
	    matBox = this.m_Parent.m_Components.MaterialComponent.m_Material;
	}

	geoBox.center();

	var mshBox = new THREE.Mesh(geoBox, matBox );

	this.m_Mesh = mshBox;
	this.SetPosition
	(
	    this.m_Parent.m_Position.x,
	    this.m_Parent.m_Position.y,
	    this.m_Parent.m_Position.z
	);
	this.m_Mesh.m_ParentEntity = this.m_Parent || null;
	GAME.m_World.m_Scene.add(this.m_Mesh);
	this.m_IsInitialised = true;
    }

    Update()
    {
    }
}
