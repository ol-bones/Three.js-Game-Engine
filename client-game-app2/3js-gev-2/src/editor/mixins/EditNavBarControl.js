"use strict";

let EditNavBarControl = (Main) => class extends Main
{
    constructor()
    {
	super();

	this.m_DebugRendererToggled = false;
    }

    NavMenuItemToggle(e) { $(e.srcElement).toggleClass("menu-toggled"); }

    ToggleEditMode(e)
    {
	this.NavMenuItemToggle(e);

	if(this.m_EditModeToggled)
	{
	    this.m_EditModeToggled = false;
	    if(this.m_ref_SelectedEntity
	    && this.m_ref_SelectedEntity.m_Components[this.m_SelectedTool])
	    {
		this.m_ref_SelectedEntity.RemoveComponent(this.m_SelectedTool);
	    }
	    delete this.m_ref_SelectedEntity;
	    delete this.m_Ref_LastSelectedEntity;
	    ENGINE.StopUpdating(2, () => ENGINE.m_World.m_Entities.forEach(e=>e.Update()));
	    ENGINE.BeginUpdating(1, () => ENGINE.m_World.Update());
	}
	else
	{
	    this.m_EditModeToggled = true;
	    ENGINE.StopUpdating(1, () => ENGINE.m_World.Update());
	    ENGINE.BeginUpdating(2, () => ENGINE.m_World.m_Entities.forEach(e=>e.Update()));
	}
    }

    ToggleDebugRenderer(e)
    {
	this.NavMenuItemToggle(e);

	if(this.m_DebugRendererToggled)
	{
	    entities().forEach(e => e.RemoveComponent("DebugComponent"));
	    ENGINE.m_World.m_DebugRenderer._material.visible = false;
	    ENGINE.StopUpdating(3, () => ENGINE.m_World.m_DebugRenderer.update());
	    this.m_DebugRendererToggled = false;
	}
	else
	{
	    entities().forEach(e =>
	    {
		if(e.m_Components.RenderComponent && e.m_Components.RenderComponent.m_Debuggable
		&& e.m_Components.RenderComponent.constructor.name !== "OBJRenderComponent")
		{
		    try
		    {
			e.AddComponent(new DebugComponent({Parent: e}));
		    } catch(Exception) {}
		}
	    });
	    ENGINE.m_World.m_DebugRenderer._material.visible = true;
	    ENGINE.BeginUpdating(3, () => ENGINE.m_World.m_DebugRenderer.update());
	    this.m_DebugRendererToggled = true;
	}
    }
}
