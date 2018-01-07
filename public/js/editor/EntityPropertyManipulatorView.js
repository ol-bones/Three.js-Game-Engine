// Dependencies
// @Game@
// @World@
// @Entity@
// @Component@

class EntityPropertyManipulatorView
{
    constructor()
    {
	this.m_SelectedEntityModel = {};
	this.m_EntityManipulatorView = $("#entity-manipulator-view");
    }

    onEntitySelect(entity_model)
    {
	let ref_Entity = Entity.FindByID(parseInt(entity_model.id));
	this.m_SelectedEntityModel = entity_model;

	this.FillMaterialEditor(ref_Entity);
	this.fillproperties(entity_model);
	this.fillcomponents(entity_model.components);
    }

    FillMaterialEditor(ref_Entity)
    {
	let texture_src = ref_Entity.m_Components.RenderComponent.m_Mesh.material.map.image.src;
	$("#material-editor-texture-view")[0].src = texture_src;
	$("#material-editor-texture-name")[0].innerHTML = texture_src;
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








