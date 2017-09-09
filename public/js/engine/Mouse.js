// Dependencies
// @Game@

class Mouse
{
    constructor()
    {
	this.m_Ray = new THREE.Raycaster();

	this.m_ScreenPosition = new THREE.Vector2(0,0);
	this.m_WorldPosition = new THREE.Vector3(0,0,0);
console.log("Mouse constructor()");
	document.addEventListener( 'mousemove', this._onMouseMove.bind(this), false );
    }

    _onMouseMove(evt)
    {
	evt.preventDefault();

	this.m_ScreenPosition.x = (  event.clientX / window.innerWidth  ) * 2 - 1;
	this.m_ScreenPosition.y = -( event.clientY / window.innerHeight ) * 2 + 1;
	this.Update();
    }

    Update()
    {
	this.m_Ray.setFromCamera(this.m_ScreenPosition, GAME.m_World.m_Camera);

	var intersects = this.m_Ray.intersectObjects(GAME.m_World.m_Entities.map((entity) =>
	entity.m_Components.RenderComponent.m_Mesh));

	if(intersects.length > 0)
	{
	    GAME.m_World.m_Entities.forEach((entity) =>
	    {
		if(entity.m_Components.RenderComponent.m_Mesh)
		{
		    entity.m_Components.RenderComponent.m_Mesh.material.color.setHex(0xFFFFFF);
		}
	    });

	    intersects[0].object.material.color.setHex(0xFF0000);
	}
    }
}
