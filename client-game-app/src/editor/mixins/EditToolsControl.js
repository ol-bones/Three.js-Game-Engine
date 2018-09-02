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
		this.m_ref_LastSelectedEntity = null;
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
		&& this.m_SelectedEntity && this.m_SelectedEntity.m_Components)
		{
			this.ClearEditComponents(this.m_SelectedEntity);
			this.m_SelectedTool = "PositionEditComponent";
			let ToolType = (Component._TypeFromName({"name":this.m_SelectedTool}));
			this.m_SelectedEntity.AddComponent(new ToolType({Parent: this.m_SelectedEntity}));
		}
		else
		{
			this.m_SelectedTool = "PositionEditComponent";
		}
    }

    SelectScaleEditTool()
    {
		if(this.m_EditModeToggled && this.m_SelectedTool !== null
		&& this.m_SelectedEntity && this.m_SelectedEntity.m_Components)
		{
			this.ClearEditComponents(this.m_SelectedEntity);
			this.m_SelectedTool = "ScaleEditComponent";
			let ToolType = (Component._TypeFromName({"name":this.m_SelectedTool}));
			this.m__SelectedEntity.AddComponent(new ToolType({Parent: this.m_SelectedEntity}));
		}
		else
		{
			this.m_SelectedTool = "ScaleEditComponent";
		}
    }

    SelectRotateEditTool()
    {
		if(this.m_EditModeToggled && this.m_SelectedTool !== null
		&& this.m_SelectedEntity && this.m_SelectedEntity.m_Components)
		{
			this.ClearEditComponents(this.m_SelectedEntity);
			this.m_SelectedTool = "RotateEditComponent";
			let ToolType = (Component._TypeFromName({"name":this.m_SelectedTool}));
			this.m_SelectedEntity.AddComponent(new ToolType({Parent: this.m_SelectedEntity}));
		}
		else
		{
			this.m_SelectedTool = "RotateEditComponent";
		}
    }

    SelectEntity(entity)
    {
		if((Date.now() - this.m_LastEntitySelectTime) > 750)
		{
			if(entity)
			{
				this.m_ref_LastSelectedEntity = this.m_SelectedEntity;
				this.m_SelectedEntity = entity;
				this.m_UICallbacks.onEntitySelected(entity);
				//this.onEntitySelect(entity.GetSavableData());
			}
			console.log(Date.now() - this.m_LastEntitySelectTime);
			this.m_LastEntitySelectTime = Date.now();
		}
    }
});

export default EditToolsControl;

