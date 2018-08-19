"use strict";

// Dependencies
// @Engine@

class EntityCreate extends mix(BaseObject).with(
    EditToolsControl, EditNavBarControl, EntityPropertyManipulatorView
)
{
    constructor()
    {
	super();

	this.defaultBox = JSON.parse(`{"type":1,"pos":{"x":0,"y":0,"z":0},"scale":{"x":25,"y":25,"z":25},"rot":{"axis":{"x":1,"y":0,"z":0},"r":0}}`);
	ENGINE.OnInitialised = () => this.Initialise();
    }

    Initialise()
    {
	EDITOR = this;
	let grid = new THREE.GridHelper(100,10);
	ENGINE.m_World.m_Scene.add(grid);
    }

    ImportModal()
    {
	$("#import-modal").modal();
    }

    ImportSelected()
    {
	if(this._ImportSelected)
	{
	    if(this._ImportSelected.includes(".obj"))
	    {
		this.AddOBJGuide(this._ImportSelected);
	    }
	    else if(this._ImportSelected.includes("_phys"))
	    {
		this.PhysModelParser(this._ImportSelected);
	    }
	}
    }

    ExportJSON()
    {
	let phys_list = entities()
	    .filter(e => e.__physname)
	    .map(e =>
	    {
		let curType = e.__phystype || 1;
		let curScale;
		switch(curType)
		{
		    case 1:
			curScale =
			{
			    x: e.__physscale.x * e.m_Scale.x,
			    y: e.__physscale.y * e.m_Scale.y,
			    z: e.__physscale.z * e.m_Scale.z
			};
			break;
		    case 2:
			let curParams = e.m_Components.RenderComponent.m_Mesh.geometry.parameters;
			curScale =
			{
			    rt: curParams.radiusTop,
			    rb: curParams.radiusBottom,
			    h: curParams.height,
			    s: curParams.radialSegments
			}
			break;
		    default:
			throw ("No phys type in exporter");
			break;
		}
		return {[e.__physname]:
		{
		    type: curType,
		    pos: e.m_Position,
		    scale: curScale,
		    rot: {axis:{
			    x: new THREE.Vector4().setAxisAngleFromQuaternion(
				e.m_Components.RenderComponent.m_Mesh.quaternion).x,
			    y: new THREE.Vector4().setAxisAngleFromQuaternion(
				e.m_Components.RenderComponent.m_Mesh.quaternion).y,
			    z: new THREE.Vector4().setAxisAngleFromQuaternion(
				e.m_Components.RenderComponent.m_Mesh.quaternion).z
			},
			r: new THREE.Vector4().setAxisAngleFromQuaternion(
			    e.m_Components.RenderComponent.m_Mesh.quaternion).w
			  + (curType === 2 ? Math.PI/2 : 0)
		    }
		}}
	    });

	let _phys_export = {};
	phys_list.forEach(json =>
	{
	    _phys_export[Object.keys(json)[0]] = json[Object.keys(json)[0]];
	});

	return _phys_export;
    }

    AddOBJGuide(name)
    {
	let obj = model(name);
	if(!obj)
	{
	    setTimeout(_=>this.AddOBJGuide(name));
	}
	else
	{
	    ENGINE.m_World.m_Scene.add(obj);
	}
    }

    PhysModelParser(path)
    {
	try
	{
	    let _phys = json(path);
	    console.log(_phys);
	    Object.keys(_phys).forEach(p =>
	    {
		if(_phys[p].type === 1) { this.AddBox(p, _phys[p]); }
		if(_phys[p].type === 2) { this.AddCylinder(p, _phys[p]); }
	    });
	}
	catch(e) { setTimeout(_=>this.PhysModelParser(path), 50); }
    }

    AddCylinder(name, p)
    {
	let e = new Entity(p.pos.x, p.pos.y, p.pos.z);
	e.__physname = name;
	e.__phystype = p.type;
	e.__physscale = p.scale;
	e.__postInitialised = false;

	e.AddComponent(new BasicCylinderMeshRenderComponent({
	    Parent: e,
	    Scale: {rt: p.scale.rt, rb: p.scale.rb, h:p.scale.h, s:p.scale.s}
	}));

	e.__OnInitialised = () =>
	{
	    if(!p.rot || e.__postInitialised) return;
	    e.m_Components.RenderComponent.m_Mesh.quaternion.setFromAxisAngle(
		new THREE.Vector3(p.rot.axis.x, p.rot.axis.y, p.rot.axis.z), p.rot.r-Math.PI/2
	    );
	    e.__postInitialised = true;
	    setTimeout(_=>this.render(), 100);
	};

	ENGINE.m_World.m_Entities.push(e);
    }

    AddBox(name, p)
    {
	let e = new Entity(p.pos.x, p.pos.y, p.pos.z);
	e.__physname = name;
	e.__phystype = p.type;
	e.__physscale = p.scale;
	e.__postInitialised = false;

	e.AddComponent(new BasicBoxMeshRenderComponent({
	    Parent: e,
	    Scale: {x: p.scale.x*2, y: p.scale.y*2, z:p.scale.z*2}
	}));

	e.__OnInitialised = () =>
	{
	    if(!p.rot || e.__postInitialised) return;
	    e.m_Components.RenderComponent.m_Mesh.quaternion.setFromAxisAngle(
		new THREE.Vector3(p.rot.axis.x, p.rot.axis.y, p.rot.axis.z), p.rot.r
	    );
	    e.__postInitialised = true;
	    setTimeout(_=>this.render(), 100);
	};

	ENGINE.m_World.m_Entities.push(e);
    }

    NewPhysEnt(str_type)
    {
	switch(str_type)
	{
	    case "box":
		this.AddBox("new_rigid_box", this.defaultBox);

		break;
	    case "cylinder":
	}
    }

    SelectPhysEnt(name, evt)
    {
	if(evt)
	{
	    name = $(evt.srcElement).attr("data-physname") || $(evt.srcElement.children[0]).attr("data-physname");
	}

	this.SelectEntity(entities().find(e => e.__physname === name).m_ID);
    }

    TogglePhysVisibility()
    {
	entities().filter(e => e.__physname)
	.map(e => e.m_Components.RenderComponent)
	.forEach(e =>
	{
	    e.m_Mesh.visible = !e.m_Mesh.visible;
	});
    }

    CopyPhysJSON()
    {
	let e_json = this.ExportJSON();
	$("#clip").html(JSON.stringify(e_json));
	$("#clipdiv").show();
	$("#clip").focus();
	$("#clip").select();
	document.execCommand('SelectAll')
	document.execCommand('copy');
	$("#clipdiv").hide();
    }

    DeletePhysEnts()
    {
	entities().filter(e => e.__physname).forEach(e => e.Delete());
    }

    DeletePhysEnt(name, evt)
    {
	if(evt)
	{
	    evt.srcElement.parentElement.remove();
	    evt.cancelBubble = true;
	    name = $(evt.srcElement.parentElement.children[0]).attr("data-physname");
	}
	entities().find(e => e.__physname === name).Delete();
    }

    SetPhysEntName(str_name, str_new_name)
    {
	entities().find(e => e.__physname && e.__physname == str_name).__physname = str_new_name;
    }

    render()
    {
	$("#top-left-pane").empty();

	$("#top-left-pane").append(whiskers.render(WHTML["entity_edit_component_view"],
	{
	    RenderComponent:
	    {
		Name: "OBJRenderComponent"
	    },
	    PhysicsModel:
	    {
		Name: "Physics Model",
		Count: entities().filter(e => e.__physname).length,
		Entities: entities().filter(e => e.__physname).map(e=>e.__physname)
	    }
	}));

	$(".rigid-body-shape-name").on("keydown", (e) =>
	{
	    var keyCode = e.which || e.keyCode;
	    if(keyCode == 13)
	    {
		e.preventDefault();
		e.currentTarget.value = e.currentTarget.value.trim();
		EDITOR.SetPhysEntName(
		    $(e.currentTarget).attr("data-physname"),
		    e.currentTarget.value
		);
		$(e.currentTarget).attr("data-physname", e.currentTarget.value);
	    }
	});
    }
}
