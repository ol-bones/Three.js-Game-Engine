"use strict";

let EditToolsControl = (Main) => class extends Main
{
    constructor()
    {
	super();

	this.m_SelectedTool = null;
	this.m_LastEntitySelectTime = 0;
	this.m_ref_LastSelectedEntity = null;
	this.m_ref_SelectedEntity = null;
	this.m_EditModeToggled = false;
    }

    ClearEditComponents(entity)
    {
	Object.keys(entity.m_Components)
	    .filter(c => entity.m_Components[c].m_Name.includes("EditComponent"))
	    .map(c => entity.m_Components[c].m_Name)
	    .forEach(c => entity.RemoveComponent(c));
    }

    SelectPositionEditTool()
    {
	if(this.m_EditModeToggled && this.m_SelectedTool !== null
	&& this.m_ref_SelectedEntity && this.m_ref_SelectedEntity.m_Components)
	{
	    this.ClearEditComponents(this.m_ref_SelectedEntity);
	    this.m_SelectedTool = "PositionEditComponent";
	    let ToolType = (Component._TypeFromName({"name":this.m_SelectedTool}));
	    this.m_ref_SelectedEntity.AddComponent(new ToolType({Parent:
this.m_ref_SelectedEntity}));
	}
	else
	{
	    this.m_SelectedTool = "PositionEditComponent";
	}
    }

    SelectScaleEditTool()
    {
	if(this.m_EditModeToggled && this.m_SelectedTool !== null
	&& this.m_ref_SelectedEntity && this.m_ref_SelectedEntity.m_Components)
	{
	    this.ClearEditComponents(this.m_ref_SelectedEntity);
	    this.m_SelectedTool = "ScaleEditComponent";
	    let ToolType = (Component._TypeFromName({"name":this.m_SelectedTool}));
	    this.m_ref_SelectedEntity.AddComponent(new ToolType({Parent:
this.m_ref_SelectedEntity}));
	}
	else
	{
	    this.m_SelectedTool = "ScaleEditComponent";
	}
    }

    SelectRotateEditTool()
    {
	if(this.m_EditModeToggled && this.m_SelectedTool !== null
	&& this.m_ref_SelectedEntity && this.m_ref_SelectedEntity.m_Components)
	{
	    this.ClearEditComponents(this.m_ref_SelectedEntity);
	    this.m_SelectedTool = "RotateEditComponent";
	    let ToolType = (Component._TypeFromName({"name":this.m_SelectedTool}));
	    this.m_ref_SelectedEntity.AddComponent(new ToolType({Parent:
this.m_ref_SelectedEntity}));
	}
	else
	{
	    this.m_SelectedTool = "RotateEditComponent";
	}
    }

    SelectEntity(id)
    {
	if((Date.now() - this.m_LastEntitySelectTime) > 750)
	{
	    let entity = entities().find(e => e.m_ID === id);
	    if(entity)
	    {
		this.m_ref_LastSelectedEntity = this.m_ref_SelectedEntity;
		this.m_ref_SelectedEntity = entity;
		this.m_EntityManipulator.onEntitySelect(entity.GetSavableData());
	    }
	    console.log(Date.now() - this.m_LastEntitySelectTime);
	    this.m_LastEntitySelectTime = Date.now();
	}
    }
}

