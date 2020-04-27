"use strict";

class EntityModel
{
    constructor(object)
    {
		let renderComponent = object.m_Components.RenderComponent;

		this._object = object;
		this.ID = object.m_ID.toString();
		this.POS = {
			x: object.m_Position.x - (object.m_Parent ? object.m_Parent.m_Position.x : 0),
			y: object.m_Position.y - (object.m_Parent ? object.m_Parent.m_Position.y : 0),
			z: object.m_Position.z - (object.m_Parent ? object.m_Parent.m_Position.z : 0)
		} || {};

		this.ROT = renderComponent && renderComponent.m_Mesh ?
			{
			"x": renderComponent.m_Mesh.rotation._x,
			"y": renderComponent.m_Mesh.rotation._y,
			"z": renderComponent.m_Mesh.rotation._z
			}
		:
			{x:0,y:0,z:0,w:1};

		this.SCALE =
		{
			"x": object.m_Scale.x,
			"y": object.m_Scale.y,
			"z": object.m_Scale.z
		};

		this.PARENT = object.m_Parent ? object.m_Parent.m_ID : -1;
		this.ENTITIES = object.m_Entities.map(e => e.DataModel().ToJSON()) || [];
		this.COMPONENTS = Object.keys(object.m_Components)
			.filter(c => c !== "DebugComponent")
			.filter(c => !c.endsWith("EditComponent"))
			.map(c => object.m_Components[c].DataModel().ToJSON()) || [];
    }

    ToJSON()
    {
		return {
			id: this.ID,
			pos: this.POS,
			rot: this.ROT,
			scale: this.SCALE,
			parent: this.PARENT,
			entities: this.ENTITIES,
			components: this.COMPONENTS
		};
    }

    ToHTML()
    {
		let EntityInfo = this.GetDisplayInfo();

		if(this.ENTITIES.length > 0)
		{
			let entities_html = "";
			this._object.m_Entities.forEach(e => { entities_html += (e.DataModel().ToHTML()); });

			return whiskers.render(WHTML["entity_tree_list_view"],
			{
				EntityHasChildren: true,
				EntityString: EntityInfo.name,
				EntityID: this.ID,
				EntityIcon: EntityInfo.icon,
				EntityChildren: entities_html
			});
		}
		else
		{
			return whiskers.render(WHTML["entity_tree_list_view"],
			{
				EntityHasChildren: false,
				EntityString: EntityInfo.name,
				EntityID: this.ID,
				EntityIcon: EntityInfo.icon,
				EntityChildren: ""
			});
		}
    }

    GetDisplayInfo()
    {
		if(this.HasComponent("WorldPieceComponent"))
		{
			return {name: "WorldPiece", icon: "glyphicon-globe"};
		}
		if(this.HasComponent("WASDPlayerControlComponent"))
		{
			return {name: "LocalPlayer", icon: "glyphicon-user"};
		}
		if(this.HasComponent("TriggerComponent"))
		{
			return {name: "Trigger", icon: "glyphicon-text-width"};
		}
		return {name: "Entity", icon:"glyphicon-cog"};
    }

    HasComponent(name) { return this.COMPONENTS.find(c => c.name === name); }
}

export default EntityModel;