"use strict";

import * as THREE from "three";

class Mouse
{
    constructor()
    {
		this.m_Ray = new THREE.Raycaster();

		this.m_ScreenPosition = new THREE.Vector2(0,0);
		this.m_WorldPosition = new THREE.Vector3(0,0,0);

		this.m_CurrentHoveredObject = null;
		this.m_LastHoveredObject = null;

		this.m_CurrentClickedObject = null;
		this.m_LastClickedObject = null;

		this.m_HighlightMousePick = false;

		this.m_Canvas = document.querySelector("canvas");
		this.m_Nav = document.getElementById("#Navbar");

		this.m_Canvas.addEventListener("mousemove", this._onMouseMove.bind(this), false);
		this.m_Canvas.addEventListener("click", this._onMouseClick.bind(this), false);
    }

    _onMouseMove(evt)
    {
		evt.preventDefault();

		let width = this.m_Canvas.width;
		let height = this.m_Canvas.height;

		this.m_ScreenPosition.x = ( evt.layerX / width  ) * 2 - 1;
		this.m_ScreenPosition.y = -( evt.layerY / height ) * 2 + 1;

		this.m_Ray.setFromCamera(this.m_ScreenPosition, ENGINE.m_World.m_Camera);

		let intersects = this.m_Ray.intersectObjects(_.flatten(entities()
			.filter(e => e.m_Renderable && e.m_Components.RenderComponent && e.m_Components.RenderComponent.m_Meshes)
			.map(e => e.m_Components.RenderComponent.m_Meshes))
		);

		if(intersects.length > 0)
		{
			this.m_WorldPosition.set
			(
				intersects[0].point.x,
				intersects[0].point.y,
				intersects[0].point.z
			);

			entities().forEach((entity) =>
			{
				if(entity.m_Renderable &&  entity.m_Components.RenderComponent && entity.m_Components.RenderComponent.m_Meshes)
				{
					entity.m_Components.RenderComponent.Unhighlight();
				}
			});

			if(intersects[0].object !== this.m_CurrentHoveredObject)
			{
				this.m_LastHoveredObject = null;
			}
			this.m_CurrentHoveredObject = intersects[0].object;

			if(!this.m_HighlightMousePick) return;

			intersects[0].object.m_ParentEntity.m_Components.RenderComponent.Highlight();
		}
		else
		{
			this.m_CurrentHoveredObject = null;
		}
    }

    _onMouseClick(evt)
    {
		if(evt.target.tagName === "CANVAS")
		{
			evt.preventDefault();
			if(THREE.OrbitControls.curDragging)
			{
				setTimeout(()=>THREE.OrbitControls.curDragging = false, 50);
				return;
			}

			if(evt && this.m_CurrentHoveredObject)
			{
				if(this.m_CurrentHoveredObject !== this.m_CurrentClickedObject)
				{
					this.m_LastClickedObject = this.m_CurrentClickedObject;
				}
				this.m_CurrentClickedObject = this.m_CurrentHoveredObject;

				if(this.m_CurrentClickedObject.m_ParentEntity
				&& this.m_CurrentClickedObject.m_ParentEntity.m_IsClickable)
				{
					try{if(EDITOR)
					{
						EDITOR.SelectEntity(this.m_CurrentClickedObject.m_ParentEntity);
					}}catch(E){} // temporary
					this.m_CurrentClickedObject.m_ParentEntity.Click();
				}
			}
		}
    }

    Update()
    {
    }
}

export default Mouse;