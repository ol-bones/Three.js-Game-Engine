"use strict";

// Dependencies
// @Component@
// @Entity@

class RotateEditComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_LastMouse = new THREE.Vector2();

	this.m_Draggables = [];
	this.m_AxisHelpers = [];

	this.m_DragControls = null;

	this.m_Name = "RotateEditComponent";

	this.m_ArrowYU = null;
	this.m_ArrowXU = null;
	this.m_ArrowZU = null;
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
	let XU = new THREE.Vector3(1, 0, 0);
	let ZU = new THREE.Vector3(0, 0, 1);

	this.m_ArrowXU = this.CreateArrow(XU, 0xFF0000);
	this.m_ArrowYU = this.CreateArrow(YU, 0x00FF00);
	this.m_ArrowZU = this.CreateArrow(ZU, 0x0000FF);

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
	this.m_Draggables.filter(m => m.axis && m !== mesh)
			 .forEach(m => m.material.visible = false);
    }

    TouchEndEvent(mesh)
    {
	ENGINE.m_World.m_Controls.enabled = true;
	this.m_Draggables.filter(m => m.axis && m !== mesh)
			 .forEach(m => m.material.visible = true);

	if(mesh.event_phase === 2)
	{
	    EDITOR.m_LastEntitySelectTime = Date.now();
	}
    }

    MeshTouchDragEvent(mesh, p)
    {
	mesh.event_phase = 2;
	this.m_Parent.SetPosition(p.x,p.y,p.z);
	this.m_AxisHelpers.forEach(m => m.position.set(p.x,p.y,p.z));
    }

    // This isn't quite 100% user friendly but I can't be bothered
    // to do the maths because it doesn't really make much difference
    // so who cares. Some times it rotates the opposite way to the drag. The fix is to make ref points on the toruses, can't be bothered.
    ArrowTouchDragEvent(mesh, t, x, y, dir, axis)
    {
	mesh.event_phase = 2;
	let m = new THREE.Vector2(x,y);

	if(mesh.last_mouse)
	{
	    let m_drag_normal = mesh.last_mouse.clone().sub(m).normalize();
	    this.AdjustRotation(mesh.drag_compare(m_drag_normal), axis);
	}
	mesh.last_mouse = m;
    }

    CreateArrow(dir, color)
    {
	let parent = this.m_Parent.m_Components.RenderComponent;
	let boundingRadius = parent.GetSizeRadius();

	let geometry = new THREE.TorusGeometry(
	    2*boundingRadius,
	    0.1*boundingRadius, 16, 100
	);
	let material = new THREE.MeshBasicMaterial( { color:color } );
	let mesh = new THREE.Mesh( geometry, material );

	mesh.rotateOnAxis(dir, Math.PI/2);
	let axis = Object.keys(dir).find(c=>dir[c]!==0);
	if(axis==="y")
	{
	    mesh.rotateX(Math.PI/2);
	    mesh.drag_compare = (normal) =>
	    {
		if(Math.abs(Math.round(normal.x)))
		{
		    return -Math.round(normal.x);
		}
		else
		{
		    return Math.round(normal.y);
		}
	    }
	}
	if(axis==="x")
	{
	    mesh.rotateY(Math.PI/2);
	    mesh.drag_compare = (normal) =>
	    {
		if(Math.abs(Math.round(normal.x)))
		{
		    return -Math.round(normal.x);
		}
		else
		{
		    return Math.round(normal.y);
		}
	    }
	}
	if(axis==="z")
	{
	    mesh.drag_compare = (normal) =>
	    {
		if(Math.abs(Math.round(normal.x)))
		{
		    return -Math.round(normal.x);
		}
		else
		{
		    return Math.round(normal.y);
		}
	    }
	}

	mesh.position.set(parent.m_Mesh.position.x, parent.m_Mesh.position.y, parent.m_Mesh.position.z);
	mesh.m_ParentEntity = this.m_Parent;
	mesh.axis = axis;
	mesh.drags = [];
	mesh.touchstart = () => this.TouchStartEvent(mesh);
	mesh.touchend = () => this.TouchEndEvent(mesh);
	mesh.touchdrag = (t,x,y) => this.ArrowTouchDragEvent(mesh, t, x, y, dir, axis);


	ENGINE.m_World.m_EditorScene.add(mesh);
	this.m_Draggables.push(mesh);

	return mesh;
    }

    AdjustRotation(diff,axis)
    {
	let body = this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody;
	let axis_ang = body.quaternion.toAxisAngle();
	let newQuat = new CANNON.Quaternion();
	switch(axis)
	{
	    case "x":
		newQuat.setFromAxisAngle(
		    new CANNON.Vec3(1,0,0),
		    (diff*0.05)
		);
		break;
	    case "y":
		newQuat.setFromAxisAngle(
		    new CANNON.Vec3(0,1,0),
		    (diff*0.05)
		);
		break;
	    case "z":
		newQuat.setFromAxisAngle(
		    new CANNON.Vec3(0,0,1),
		    (diff*0.05)
		);
		break;
	    default: return;
	}
	body.quaternion = body.quaternion.mult(newQuat);
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

	delete	this.m_ArrowYU;
	delete	this.m_ArrowXU;
	delete	this.m_ArrowZU;
    }
}
