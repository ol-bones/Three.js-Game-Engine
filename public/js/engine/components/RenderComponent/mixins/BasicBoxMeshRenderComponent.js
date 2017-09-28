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

		var matBox = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } );

		var geoBox = new THREE.BoxGeometry(
			this.m_Args.Scale ? this.m_Args.Scale.x : 2.5,
			this.m_Args.Scale ? this.m_Args.Scale.y : 2.5,
			this.m_Args.Scale ? this.m_Args.Scale.z : 2.5
		);

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
    }

    Update()
    {
    }
}
