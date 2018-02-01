"use strict";

// Dependencies
// @Engine@
// @World@
// @Entity@
// @Component@

let EntityPropertyManipulatorView = (Main) => class extends Main
{
    constructor()
    {
	super();

	this.m_SelectedEntityModel = {};
	this.m_EntityManipulatorView = $("#entity-manipulator-view");
    }

    onEntitySelect(entity_model)
    {
	try
	{
	    let ref_Entity = Entity.FindByID(parseInt(entity_model.id));
	    this.m_SelectedEntityModel = entity_model;

	    try{this.FillMaterialEditor(ref_Entity)}catch(e){};
	    this.fillproperties(entity_model);
	    this.fillcomponents(entity_model.components);

	    if(ref_Entity.m_Components.RenderComponent
	    && !ref_Entity.m_Components[EDITOR.m_SelectedTool]
	    && EDITOR.m_EditModeToggled)
	    {
		if(EDITOR.m_ref_LastSelectedEntity)
		{
		    let lastComponents = EDITOR.m_ref_LastSelectedEntity.m_Components;
		    if(EDITOR.m_ref_LastSelectedEntity !== ref_Entity)
		    {
			console.log(lastComponents);
			let edit_components = Object.keys(lastComponents)
			    .filter(c => lastComponents[c].m_Name.includes("EditComponent"))
			    .map(c => lastComponents[c].m_Name)

			if(edit_components.length > 0)
			{
			    edit_components.forEach(c => EDITOR.m_ref_LastSelectedEntity.RemoveComponent(c));
			}
		    }
		}
		let ToolType = (Component._TypeFromName({"name":EDITOR.m_SelectedTool}));
		ref_Entity.AddComponent(new ToolType({Parent: ref_Entity}));
	    }
	}
	catch(Exception) {}
    }

    FillMaterialEditor(ref)
    {
	let texture_src;
	if(ref.constructor.name === "String")
	{
	    texture_src = "/textures/" + ref;
	}
	else if(ref.constructor.name === "Entity")
	{
	    texture_src = ref.m_Components.RenderComponent.m_Mesh.material.map.image.src;
	}
	else { return; }
	let name_start_index = texture_src.lastIndexOf("/")+1;
	let texture_name = texture_src.substring(name_start_index, texture_src.length);
	$("#material-editor-texture-view")[0].src = texture_src;
	$("#material-editor-texture-name").html(texture_name);
    }

    fillproperties(entity_model)
    {
	$("#entity-name")[0].value = "Entity";
	$("#entity-id")[0].value = entity_model.id;
	$("#entity-x")[0].value = entity_model.pos.x;
	$("#entity-y")[0].value = entity_model.pos.y;
	$("#entity-z")[0].value = entity_model.pos.z;
    }

    fillcomponents(component_models)
    {
	let components = $("#component-modal-tabs");
	components.empty();

	let first = true;
	let list_html = "";

	component_models.forEach((model) =>
	{
	    list_html += whiskers.render(WHTML["component_modal_tab"],
	    {
		firstComponent: first,
		componentName: model.name
	    });

	    first = false;
	});

	this.fillargs(component_models);
	components.append(list_html);
    }

    fillargs(components)
    {
	let args = $("#component-modal-content");
	args.empty();

	let first = true;
    	let args_html = "";

	components.forEach(c =>
	{
	    let componentKeyValuePairs = [];
	    Object.keys(c.args).forEach((key) =>
	    {
		if(c.args[key] || !c.args[key] || Object.keys(c.args[key]).length === 1)
		{
		    componentKeyValuePairs.push([key, c.args[key]]);
		}
	    });
	    args_html += whiskers.render(WHTML["component_modal_body"],
	    {
		firstComponent: first,
		componentName: c.name,
		componentKeys: componentKeyValuePairs.map(kvp => kvp[0]),
		componentValues: componentKeyValuePairs.map(kvp => kvp[1])
	    });
	    first = false;
	});

	args.append(args_html);
    }
}








