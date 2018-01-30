"use strict";

// Dependencies
// @Component@
// @Entity@

class PositionEditComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_LastMouse = new THREE.Vector2();

	this.m_Draggables = [];
	this.m_AxisHelpers = [];

	this.m_DragControls = null;

	this.m_Name = "PositionEditComponent";

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
	    ENGINE.m_World.m_Camera,
	    ENGINE.m_World.m_Renderer.domElement
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
	let rect = ENGINE.m_World.m_Renderer.domElement.getBoundingClientRect();
	let width = rect.width;
	let height = rect.height + 50;


	var pos = obj.position.clone();
	pos.project(ENGINE.m_World.m_Camera);
	pos.x = ( pos.x * (width/2) ) + (width/2);
	pos.y = - ( pos.y * (height/2) ) + (height/2);

	return pos;
    }

    TouchStartEvent(mesh)
    {
	mesh.event_phase = 1;
	mesh.drags = [];
	ENGINE.m_World.m_Controls.enabled = false;
    }

    TouchEndEvent(mesh)
    {
	ENGINE.m_World.m_Controls.enabled = true;
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
	mouse_normal_dir.multiplyScalar(dir[axis]);

	let m_dist = new THREE.Vector2();
	m_dist.subVectors(w2sm2d, m)
	m_dist = m_dist.length();

	let dot = axis_normal_dir.dot(mouse_normal_dir);
	let change = ((dot * m_dist) * 0.1 );

	this.AdjustPosition(change, axis);
    }

    CreateArrowHeadSphere(dir, size)
    {
	let axis = Object.keys(dir).find(c => dir[c] !== 0);
	let geo = new THREE.SphereGeometry(10, 32, 32);
	let mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:0x00FF00}));
	mesh.material.visible = true;
	let length = dir.y > 0 ? size : -size;
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

	ENGINE.m_World.m_EditorScene.add(mesh);
	this.m_Draggables.push(mesh);
    }

    CreateArrow(dir, color)
    {
	let axis = Object.keys(dir).find(c => dir[c] !== 0);
	let size = Math.max(this.m_Parent.m_Components.RenderComponent.GetSize3()[axis], 50);
	let arrow = new THREE.ArrowHelper
	(
	    dir,
	    this.m_Parent.m_Position,
	    size,
	    color,
	    0.2 * 50,
	    (0.2 * 30)
	);
	arrow.line.material.linewidth = 3;
	arrow.m_ParentEntity = this.m_Parent;
	ENGINE.m_World.m_EditorScene.add(arrow);
	this.m_Draggables.push(arrow);
	this.CreateArrowHeadSphere(dir, size);

	return arrow;
    }

    AdjustPosition(diff,axis)
    {
	switch(axis)
	{
	    case "x":
		this.m_AxisHelpers.forEach(mesh =>
		    mesh.position.x += diff
		);
		this.m_Parent.SetPositionX(
		    this.m_Parent.m_Position.x + diff
		);
		break;
	    case "y":
		this.m_AxisHelpers.forEach(mesh =>
		    mesh.position.y -= diff
		);
		this.m_Parent.SetPositionY(
		    this.m_Parent.m_Position.y - diff
		);
		break;
	    case "z":
		this.m_AxisHelpers.forEach(mesh =>
		    mesh.position.z += diff
		);
		this.m_Parent.SetPositionZ(
		    this.m_Parent.m_Position.z + diff
		);
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
	    ENGINE.m_World.m_EditorScene.remove(mesh);

	    if(mesh.line)
	    {
		mesh.line.material.dispose();
		mesh.line.geometry.dispose();
		delete mesh.line.material;
		delete mesh.line.geometry;
	    }
	    if(mesh.cone)
	    {
		mesh.cone.material.dispose();
		mesh.cone.geometry.dispose();
		delete mesh.cone.material;
		delete mesh.cone.geometry;
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
