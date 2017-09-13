// Dependencies
// @Game@

class Mouse
{
    constructor()
    {
	this.m_Ray = new THREE.Raycaster();

	this.m_ScreenPosition = new THREE.Vector2(0,0);
	this.m_WorldPosition = new THREE.Vector3(0,0,0);

	this.m_CurrentHoveredObject = null;
	this.m_LastHoveredObject = null;

	this.m_CurrentClickedOBject = null;
	this.m_LastClickedObject = null;

	document.addEventListener("mousemove", this._onMouseMove.bind(this), false);
	document.addEventListener("click", this._onMouseClick.bind(this), false);
    }

    _onMouseMove(evt)
    {
	evt.preventDefault();

	this.m_ScreenPosition.x = (  event.clientX / window.innerWidth  ) * 2 - 1;
	this.m_ScreenPosition.y = -( event.clientY / window.innerHeight ) * 2 + 1;

	this.m_Ray.setFromCamera(this.m_ScreenPosition, GAME.m_World.m_Camera);


	var intersects = this.m_Ray.intersectObjects(GAME.m_World.m_Entities.filter(e =>
	e.m_Renderable).map(e => e.m_Components.RenderComponent.m_Mesh));

	if(intersects.length > 0)
	{
	    this.m_WorldPosition.set
	    (
		intersects[0].point.x,
		intersects[0].point.y,	
		intersects[0].point.z
	    );

	    GAME.m_World.m_Entities.forEach((entity) =>
	    {
		if(entity.m_Renderable && entity.m_Components.RenderComponent.m_Mesh)
		{
		    entity.m_Components.RenderComponent.m_Mesh.material.color.setHex(0xFFFFFF);
		}
	    });

	    if(intersects[0].object !== this.m_CurrentHoveredObject)
	    {
		this.m_LastHoveredObject = null;
	    }
	    this.m_CurrentHoveredObject = intersects[0].object;
	    intersects[0].object.material.color.setHex(0xFF0000);	
	}
	else
	{
	    this.m_CurrentHoveredObject = null;
	}
    }

    _onMouseClick(evt)
    {
	evt.preventDefault();

	if(evt && this.m_CurrentHoveredObject)
	{
	    console.log(this.m_CurrentHoveredObject);
	    if(this.m_CurrentHoveredObject !== this.m_CurrentClickedObject)
	    {
		this.m_LastClickedObject = this.m_CurrentClickedObject;
	    }
	    this.m_CurrentClickedObject = this.m_CurrentHoveredObject;

	    if(this.m_CurrentClickedObject.m_ParentEntity
	    && this.m_CurrentClickedObject.m_ParentEntity.m_IsClickable)
	    {
		this.m_CurrentClickedObject.m_ParentEntity.Click();
	    }
	}
    }

    Update()
    {
	
    }
}
