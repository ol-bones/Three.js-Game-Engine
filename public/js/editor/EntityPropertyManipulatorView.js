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
	this.m_SelectedEntityModel = entity_model;

	this.fillproperties(entity_model);
	this.fillcomponents(entity_model.components);
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
	    let html = "";
	    if(first)
	    {
		html += "<li class=\"active\">";
	    }
	    else
	    {
		html += "<li>";
	    }
	    html += "<a data-toggle=\"tab\" ";
	    html += "href=\"#" + model.name + "\">";
	    html += model.name + "</a></li>";

	    list_html += html;
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
	    let html = "<div id=\"";
	    html += c.name + "\" class=\"";
	    if(first)
	    {
		html += "tab-pane fade in active\">";
	    }
	    else
	    {
		html += "tab-pane fade\">";
	    }
	    Object.keys(c.args).forEach((key) =>
	    {
		if(c.args[key] || !c.args[key] || Object.keys(c.args[key]).length === 1)
		{
		    html += "<div class=\"input-group\">";
		    html += "<span class=\"input-group-addon\">" + key + "</span>";
		    html += "<input id=\"arg\" type=\"text\" class=\"form-control\" name=\"arg\" value=\"" + c.args[key] + "\"></div>";
		}
		else
		{
		}
	    });
	    html += "</div>";
	    args_html += html;
	    first = false;
	});
	args.append(args_html);
    }
}








