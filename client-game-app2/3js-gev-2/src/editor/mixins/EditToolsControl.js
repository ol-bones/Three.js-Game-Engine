"use strict";

import Entity from "./../../engine/entity/entities/Entity";
import Component from "./../../engine/entity/components/Component";

import {mix, Mixin} from "mixwith";

let EditToolsControl = Mixin((superclass) => class extends superclass
{
    constructor()
    {
		super();

		this.m_SelectedTool = null;
		this.m_LastEntitySelectTime = 0;
		this.m_LastSelectedEntity = null;
		this.m_EditModeToggled = false;
    }

    ClearEditComponents(entity)
    {
		if(!entity || !entity.m_Components) return;
		
		Object.keys(entity.m_Components)
			.filter(c => entity.m_Components[c].m_Name.includes("EditComponent"))
			.map(c => entity.m_Components[c].m_Name)
			.forEach(c => entity.RemoveComponent(c));
    }

    SelectPositionEditTool()
	{
		if(this.m_EditModeToggled &&  this.m_SelectedEntity && this.m_SelectedEntity.m_Components)
		{
			this.ClearEditComponents(this.m_SelectedEntity);
			this.m_SelectedTool = "PositionEditComponent";
			this.ApplyTool();
		}
		else
		{
			this.m_SelectedTool = "PositionEditComponent";
		}
    }

    SelectScaleEditTool()
    {
		if(this.m_EditModeToggled && this.m_SelectedEntity && this.m_SelectedEntity.m_Components)
		{
			this.ClearEditComponents(this.m_SelectedEntity);
			this.m_SelectedTool = "ScaleEditComponent";
			this.ApplyTool();
		}
		else
		{
			this.m_SelectedTool = "ScaleEditComponent";
		}
    }

    SelectRotateEditTool()
    {
		if(this.m_EditModeToggled && this.m_SelectedEntity && this.m_SelectedEntity.m_Components)
		{
			this.ClearEditComponents(this.m_SelectedEntity);
			this.m_SelectedTool = "RotateEditComponent";
			this.ApplyTool();
		}
		else
		{
			this.m_SelectedTool = "RotateEditComponent";
		}
	}
		
	SelectHeightmapEditTool()
	{
		if(this.m_EditModeToggled && this.m_SelectedEntity && this.m_SelectedEntity.m_Components)
		{
			this.ClearEditComponents(this.m_SelectedEntity);
			this.m_SelectedTool = "HeightmapEditComponent";
			this.ApplyTool();
		}
		else
		{
			this.m_SelectedTool = "HeightmapEditComponent";
		}
	}

	SelectPlanePaintEditTool()
	{
		if(this.m_EditModeToggled && this.m_SelectedEntity && this.m_SelectedEntity.m_Components)
		{
			this.ClearEditComponents(this.m_SelectedEntity);
			this.m_SelectedTool = "PlanePaintEditComponent";
			this.ApplyTool();
		}
		else
		{
			this.m_SelectedTool = "PlanePaintEditComponent";
		}
	}

	ApplyTool()
	{
		let ToolType = (Component._TypeFromName({"name": this.m_SelectedTool}));
		this.m_SelectedEntity.AddComponent(new ToolType({Parent: this.m_SelectedEntity}));
	}

	NoTool()
	{
		this.m_SelectedTool = null;
		this.ClearEditComponents(this.m_SelectedEntity);
	}

    SelectEntity(entity)
    {
		if((Date.now() - this.m_LastEntitySelectTime) > 750)
		{
			this.SetSelectedEntity(entity);
		}
	}
	
	SetSelectedEntity(entity, supressCallback)
	{
	//	if(entity)
		{
			if(entity == void(0)) this.NoTool();

			this.m_LastSelectedEntity = this.m_SelectedEntity;
			this.m_SelectedEntity = entity;
			this.m_LastEntitySelectTime = Date.now();

			if(!supressCallback) this.m_UICallbacks.onEntitySelected(entity, true);

			if(entity && this.m_SelectedTool && entity !== this.m_LastSelectedEntity)
			{
				this.ClearEditComponents(this.m_LastSelectedEntity);
				this.ApplyTool();
			}
		}
	}
});

export default EditToolsControl;

