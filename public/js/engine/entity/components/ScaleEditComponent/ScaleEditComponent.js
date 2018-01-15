"use strict";

// Dependencies
// @Component@
// @Entity@

class ScaleEditComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_LastMouse = new THREE.Vector2();

	this.m_Draggables = [];
	this.m_AxisHelpers = [];

	this.m_DragControls = null;

	this.m_Name = "ScaleEditComponent";

	this.m_ArrowYU = null;
	this.m_ArrowXU = null;
	this.m_ArrowZU = null;
	this.m_ArrowYD = null;
	this.m_ArrowXD = null;
	this.m_ArrowZD = null;
    }

    Initialise()
    {
	super.Initialise();

	this.m_DragControls =  new THREE.DragControls(
	    this.m_Draggables,
	    GAME.m_World.m_Camera,
	    GAME.m_World.m_Renderer.domElement
	);
	this.m_DragControls.enabled = true;

	let parent_mesh = this.m_Parent.m_Components.RenderComponent.m_Mesh;
	this.m_Draggables.push(parent_mesh);

	parent_mesh.touchstart = () => this.TouchStartEvent(parent_mesh);

	parent_mesh.touchend = () => this.TouchEndEvent(parent_mesh);
	parent_mesh.touchdrag = (p) => this.MeshTouchDragEvent(parent_mesh, p);

	let YU = new THREE.Vector3(0,1,0);
	let YD = new THREE.Vector3(0, -1, 0);
	let XU = new THREE.Vector3(1, 0, 0);
	let XD = new THREE.Vector3(-1, 0, 0);
	let ZU = new THREE.Vector3(0, 0, 1);
	let ZD = new THREE.Vector3(0, 0, -1);

	this.m_ArrowXU = this.CreateArrow(XU, 0xFF0000);
	this.m_ArrowXD = this.CreateArrow(XD, 0xFF0000);
	this.m_ArrowYU = this.CreateArrow(YU, 0x00FF00);
	this.m_ArrowYD = this.CreateArrow(YD, 0x00FF00);
	this.m_ArrowZU = this.CreateArrow(ZU, 0x0000FF);
	this.m_ArrowZD = this.CreateArrow(ZD, 0x0000FF);

	this.m_AxisHelpers = this.m_Draggables.filter(m => m !== parent_mesh);

	this.OnInitialised();
    }

    W2S(obj)
    {
	let rect = GAME.m_World.m_Renderer.domElement.getBoundingClientRect();
	let width = rect.width;
	let height = rect.height + 50;


	var pos = obj.position.clone();
	pos.project(GAME.m_World.m_Camera);
	pos.x = ( pos.x * (width/2) ) + (width/2);
	pos.y = - ( pos.y * (height/2) ) + (height/2);

	return pos;
    }

    TouchStartEvent(mesh)
    {
	mesh.event_phase = 1;
	mesh.drags = [];
	GAME.m_World.m_Controls.enabled = false;
    }

    TouchEndEvent(mesh)
    {
	GAME.m_World.m_Controls.enabled = true;
	if(mesh.event_phase === 2)
	{
	    EDITOR.m_LastEntitySelectTime = Date.now();
	}
    }

    MeshTouchDragEvent(mesh, p)
    {
	mesh.event_phase = 2;
	this.m_Parent.SetPosition(p.x,p.y,p.z);
	this.m_AxisHelpers.forEach(m =>
	{
	    if(m.handle_offset)
	    {
		m.position.set(
		    m.handle_offset.x + this.m_Parent.m_Position.x,
		    m.handle_offset.y + this.m_Parent.m_Position.y,
		    m.handle_offset.z + this.m_Parent.m_Position.z
		);
	    }
	    else
	    {
		m.position.set(p.x,p.y,p.z);
	    }
	});
    }

    ArrowTouchDragEvent(mesh, t, x, y, dir, axis)
    {
	mesh.event_phase = 2;
	let m = new THREE.Vector2(x,y);
	let opp_head = this.m_Draggables.find(
	    head => head !== mesh && head.axis === axis
	);

	let opp_w2sm = this.W2S(opp_head);
	let opp_w2sm2d = new THREE.Vector2(opp_w2sm.x, opp_w2sm.y);

	let w2sm = this.W2S(mesh);
	let w2sm2d = new THREE.Vector2(w2sm.x, w2sm.y);

	let axis_normal_dir = new THREE.Vector2();
	axis_normal_dir.subVectors(w2sm2d, opp_w2sm2d).normalize();

	let mouse_normal_dir = new THREE.Vector2();
	mouse_normal_dir.subVectors(w2sm2d, m).normalize();

	let m_dist = new THREE.Vector2();
	m_dist.subVectors(w2sm2d, m)
	m_dist = m_dist.length()*0.05;

	let dot = axis_normal_dir.dot(mouse_normal_dir);
	let change = ((dot * m_dist) * 0.1 );
	this.AdjustScale(change, axis);
    }

    CreateArrowHeadSphere(dir, color)
    {
	let axis = Object.keys(dir).find(c => dir[c] !== 0);
	let geo = new THREE.BoxGeometry(10, 10, 10);
	let mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:color}));
	mesh.material.visible = true;
	let length = dir.y > 0 ? 45 : -45;
	let pos = new THREE.Vector3(0, length, 0);
	pos.applyAxisAngle(dir, Math.PI/2);
	pos.applyAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
	pos.add(this.m_Parent.m_Position);
	mesh.handle_offset = pos.clone().sub(this.m_Parent.m_Position);
	mesh.position.set(pos.x,pos.y,pos.z);

	mesh.m_ParentEntity = this.m_Parent;
	mesh.axis = axis;
	mesh.drags = [];
	mesh.touchstart = () => this.TouchStartEvent(mesh);
	mesh.touchend = () => this.TouchEndEvent(mesh);
	mesh.touchdrag = (t,x,y) => this.ArrowTouchDragEvent(mesh, t, x, y, dir, axis);

	GAME.m_World.m_EditorScene.add(mesh);
	this.m_Draggables.push(mesh);
	return mesh;
    }

    CreateArrow(dir, color)
    {
	let parent_mesh = this.m_Parent.m_Components.RenderComponent.m_Mesh;
	let parent_pos = parent_mesh.position;
	let line_mat = new THREE.LineDashedMaterial(
	{
	    color:color,
	    linewidth: 3,
	    dashSize: 3,
	    gapSize: 3
	});
	let line_geom = new THREE.Geometry();

	let length = dir.y > 0 ? 45 : -45;
	let pos = new THREE.Vector3(0, length, 0);
	pos.applyAxisAngle(dir, Math.PI/2);
	pos.applyAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
	line_geom.vertices.push(new THREE.Vector3(0,0,0), pos);

	let line = new THREE.Line(line_geom, line_mat);
	line.position.set(parent_pos.x, parent_pos.y, parent_pos.z);
	line.geometry.computeLineDistances();
	line.m_ParentEntity = this.m_Parent;
	GAME.m_World.m_EditorScene.add(line);
	this.m_Draggables.push(line);
	let head = this.CreateArrowHeadSphere(dir, color);
	head.line = line;

	return line;
    }

    AdjustScale(diff,axis)
    {
	switch(axis)
	{
	    case "x":
		if(this.m_Parent.m_Scale.x - diff <= 0) break;
		this.m_Parent.SetScaleX(
		    this.m_Parent.m_Scale.x - diff
		);
		this.m_AxisHelpers.forEach(mesh =>
		{
		    if(mesh.axis === axis)
		    {
			let scale_x = this.m_Parent.m_Scale.x;
			let offset = ((mesh.geometry.parameters.width));
			if(mesh.handle_offset.x > 0)
			{
			    mesh.handle_offset.x = (offset * scale_x) + (10*scale_x);
			}
			else
			{
			    mesh.handle_offset.x = (-offset * scale_x) - (10*scale_x);
			}
			mesh.position.x = mesh.handle_offset.x + this.m_Parent.m_Position.x;
			mesh.line.geometry.dynamic = true;
			mesh.line.geometry.vertices[1].x = mesh.handle_offset.x;
			mesh.line.geometry.verticesNeedUpdate = true;
		    }
		});
		break;
	    case "y":
		if(this.m_Parent.m_Scale.y - diff <= 0) break;
		this.m_Parent.SetScaleY(
		    this.m_Parent.m_Scale.y - diff
		);
		this.m_AxisHelpers.forEach(mesh =>
		{
		    if(mesh.axis === axis)
		    {
			let scale_y = this.m_Parent.m_Scale.y;
			let offset = ((mesh.geometry.parameters.width));
			if(mesh.handle_offset.y > 0)
			{
			    mesh.handle_offset.y = (offset * scale_y) + (10*scale_y);
			}
			else
			{
			    mesh.handle_offset.y = (-offset * scale_y) - (10*scale_y);
			}
			mesh.position.y = mesh.handle_offset.y + this.m_Parent.m_Position.y;
			mesh.line.geometry.dynamic = true;
			mesh.line.geometry.vertices[1].y = mesh.handle_offset.y;
			mesh.line.geometry.verticesNeedUpdate = true;
		    }
		});
		break;
	    case "z":
		if(this.m_Parent.m_Scale.z - diff <= 0) break;
		this.m_Parent.SetScaleZ(
		    this.m_Parent.m_Scale.z - diff
		);
		this.m_AxisHelpers.forEach(mesh =>
		{
		    if(mesh.axis === axis)
		    {
			let scale_z = this.m_Parent.m_Scale.z;
			let offset = ((mesh.geometry.parameters.width));
			if(mesh.handle_offset.z > 0)
			{
			    mesh.handle_offset.z = (offset * scale_z) + (10*scale_z);
			}
			else
			{
			    mesh.handle_offset.z = (-offset * scale_z) - (10*scale_z);
			}
			mesh.position.z = mesh.handle_offset.z + this.m_Parent.m_Position.z;
			mesh.line.geometry.dynamic = true;
			mesh.line.geometry.vertices[1].z = mesh.handle_offset.z;
			mesh.line.geometry.verticesNeedUpdate = true;
		    }
		});
		break;
	    default: return;
	}
    }

    Update()
    {

    }

    Remove()
    {
	super.Remove();

	this.m_DragControls.enabled = false;
	this.m_DragControls.deactivate();
	this.m_DragControls.dispose();
	delete this.m_DragControls;

	this.m_AxisHelpers.forEach(mesh =>
	{
	    GAME.m_World.m_EditorScene.remove(mesh);

	    if(mesh.line)
	    {
		delete mesh.line;
	    }
	    if(mesh.material)
	    {
		mesh.material.dispose();
		mesh.geometry.dispose();
		delete mesh.material;
		delete mesh.geometry;
	    }
	});

	this.m_AxisHelpers = null;
	delete this.m_AxisHelpers;
	this.m_Draggables = null;
	delete this.m_Draggables;

	this.m_ArrowYU = null;
	this.m_ArrowXU = null;
	this.m_ArrowZU = null;
	this.m_ArrowYD = null;
	this.m_ArrowXD = null;
	this.m_ArrowZD = null;

	delete	this.m_ArrowYU;
	delete	this.m_ArrowXU;
	delete	this.m_ArrowZU;
	delete	this.m_ArrowYD;
	delete	this.m_ArrowXD;
	delete	this.m_ArrowZD;
    }
}
