import BaseObject from "./BaseObject";
import Movable from "./../mixins/Movable";
import Clickable from "./../mixins/Clickable";
import Savable from "./../mixins/Savable";
import Component from "./../components/Component";

import Comms from "./../mixins/Comms/Comms";
import {mix} from "mixwith";

class Entity extends mix(BaseObject).with(Comms, Movable, Clickable, Savable)
{
	constructor(x, y, z) {
		super();

		this.m_ID = Entity._idGenerator();

		this.m_Parent = ENGINE.m_World;

		this.m_Components = {};
		this.m_Entities = [];

		this.__IsInitialised = false;
		this.__OnInitialised = () => null;

		this.m_Position = new THREE.Vector3(x, y, z);
		this.m_Scale = new THREE.Vector3(1, 1, 1);
		this.m_Rotation = new THREE.Quaternion(0, 0, 0, 1);
	}

	Initialise() {
		this._InitialiseComponents();
	}

	OnInitialised() {
		this.__OnInitialised();
		this.__OnInitialised = () => null;
		if (entities().includes(this)) return;
		entities().push(this);
	}

	_InitialiseComponents() {
		if (Object.keys(this.m_Components).length === 0) {
			if (!this.IsInitialised()) {
				this.__IsInitialised = true;
				this.OnInitialised(this);
			}
		}
		else if (!this.IsInitialised() && this._IsInitialised()) {
			this.__IsInitialised = true;
			this.OnInitialised(this);
		}

		Object.keys(this.m_Components)
			.filter(key => !this.m_Components[key].m_IsInitialised)
			.filter(key => {
				return (this.IsFirstComponent(key)
					||
					this.PreviousComponent(key).m_IsInitialised);
			})
			.forEach((key) => { try { this.m_Components[key].Initialise(); } catch (e) { } });
	}

	IsInitialised() { return this.__IsInitialised; }

	_IsInitialised() {
		return (Object.keys(this.m_Components)
			.filter(key => this.m_Components[key].m_IsInitialised))
			.length === this.ComponentCount();
	}

	IsFirstComponent(componentName) {
		return (Object.keys(this.m_Components).indexOf(componentName) === 0);
	}

	PreviousComponent(componentName) {
		let prevComponentIndex = this.PreviousComponentIndex(componentName);
		let componentKeys = Object.keys(this.m_Components);
		let previousComponentKey = componentKeys[prevComponentIndex];

		let previousComponent = this.m_Components[previousComponentKey];

		return previousComponent;
	}

	PreviousComponentIndex(componentName) {
		return Object.keys(this.m_Components).indexOf(componentName) - 1;
	}

	ComponentCount() {
		return Object.keys(this.m_Components).length;
	}

	AddComponent(component) {
		this.m_Components[component.m_Name] = component;
		this.__IsInitialised = false;
		return true;
	}

	RemoveComponent(component) {
		if (typeof component === "string" && this.m_Components[component]) {
			this.m_Components[component].Remove();
			this.m_Components[component] = {};
			delete this.m_Components[component];
			return true;
		}
		return false;
	}

	AddChild(entity) {
		entity.m_Parent = this;
		this.m_Entities.push(entity);
		//if (window.Editor) { EDITOR.render(); }
	}

	RemoveChild(entity) {
		delete this.m_Entities[this.m_Entities.indexOf(entity)];
		this.m_Entities.splice(this.m_Entities.indexOf(entity), 1);
	}

	SetPosition(x, y, z) {
		this.m_Position.set(x, y, z);
		if (this.m_Components.PhysicsComponent) {
			this.m_Components.PhysicsComponent.m_PhysicsBody.position.set(x, y, z);
		}
	}

	_SetPosition(x, y, z) {
		this.m_Position.set(x, y, z);
	}

	SetPositionX(x) { this.SetPosition(x, this.m_Position.y, this.m_Position.z); }
	SetPositionY(y) { this.SetPosition(this.m_Position.x, y, this.m_Position.z); }
	SetPositionZ(z) { this.SetPosition(this.m_Position.x, this.m_Position.y, z); }

	SetScale(x, y, z) {
		this.m_Scale.set(x, y, z);
		if (this.m_Components.RenderComponent) {
			this.m_Components.RenderComponent.SetScale(x, y, z);
		}
		if (this.m_Components.PhysicsComponent) {
			this.m_Components.PhysicsComponent.Remove();
			this.m_Components.PhysicsComponent.Initialise();
			this._SetRotation(
				this.m_Rotation.x,
				this.m_Rotation.y,
				this.m_Rotation.z
			);
		}
	}

	SetScaleX(x) { this.SetScale(x, this.m_Scale.y, this.m_Scale.z); }
	SetScaleY(y) { this.SetScale(this.m_Scale.x, y, this.m_Scale.z); }
	SetScaleZ(z) { this.SetScale(this.m_Scale.x, this.m_Scale.y, z); }

	_SetRotation(x, y, z) {
		this.m_Rotation.set(x, y, z);
		if (this.m_Components.RenderComponent && this.m_Components.RenderComponent.m_Mesh
		&& !this.m_Components.PhysicsComponent) {
			this.m_Components.RenderComponent.m_Mesh.rotation.set(x, y, z);

			return;
		}
		if (this.m_Components.PhysicsComponent && this.m_Components.PhysicsComponent.m_PhysicsBody) {
			this.m_Components.PhysicsComponent.SetRotation(x, y, z);

			return;
		}
	}

	SetRotation(x, y, z)
	{
		this._SetRotation(x, y, z);
	}

	SetRotationX(x) {
		this.SetRotation(
			x,
			this.m_Rotation.y,
			this.m_Rotation.z
		);
	}

	SetRotationY(y) {
		this.SetRotation(
			this.m_Rotation.x,
			y,
			this.m_Rotation.z
		);
	}

	SetRotationZ(z) {
		this.SetRotation(
			this.m_Rotation.x,
			this.m_Rotation.y,
			z
		);
	}

	Delete() {
		while (this.m_Entities.length > 0) { this.m_Entities.forEach(_ => _.Delete()); }
		Object.keys(this.m_Components).forEach(
			c => this.m_Components[c].Remove()
		);

		this.m_Parent.m_Entities.splice(
			this.m_Parent.m_Entities.indexOf(this), 1
		);

		ENGINE.m_World.m_FlatEntities.splice(
			ENGINE.m_World.m_FlatEntities.indexOf(this), 1
		);
	}

	Update() {
		if (this.IsInitialised()) {
			Object.keys(this.m_Components).forEach(c => this.m_Components[c].Update());
			if (this.m_Components.RenderComponent) {
				this.m_Components.RenderComponent.SetPosition
					(
					this.m_Position.x, this.m_Position.y, this.m_Position.z
					);
			}
			this.ProcessInboundCommsQueue();
			this.m_Entities.forEach(e => e.Update());
		}
		else {
			this._InitialiseComponents();
		}
	}

	DataModel() {
		return new EntityModel(this);
	}
}

import DebugComponent from "./../components/../components/./DebugComponent/DebugComponent";
import GRIDPlayerControlComponent from "./../components/GRIDPlayerControlComponent/GRIDPlayerControlComponent";
import MinigolfClientBallControlComponent from "./../components/MinigolfClientBallControlControlComponent/MinigolfClientBallControlComponent";
import PathFindingNodeComponent from "./../components/PathFindingNodeComponent/PathFindingNodeComponent";
import PhysicsComponent from "./../components/PhysicsComponent/PhysicsComponent";
import BasicPhysicsComponent from "./../components/PhysicsComponent/mixins/BasicPhysicsComponent";
import OBJPhysicsComponent from "./../components/PhysicsComponent/mixins/OBJPhysicsComponent";
import PositionEditComponent from "./../components/PositionEditComponent/PositionEditComponent";
import BasicBoxMeshRenderComponent from "./../components/RenderComponent/mixins/BasicBoxMeshRenderComponent";
import BasicCylinderMeshRenderComponent from "./../components/RenderComponent/mixins/BasicCylinderMeshRenderComponent";
import BasicHullMeshRenderComponent from "./../components/RenderComponent/mixins/BasicHullMeshRenderComponent";
import BasicShapeMeshRenderComponent from "./../components/RenderComponent/mixins/BasicShapeMeshRenderComponent";
import BasicSphereMeshRenderComponent from "./../components/RenderComponent/mixins/BasicSphereMeshRenderComponent";
import OBJRenderComponent from "./../components/RenderComponent/mixins/OBJRenderComponent";
import RenderComponent from "./../components/RenderComponent/RenderComponent";
import RotateEditComponent from "./../components/RotateEditComponent/RotateEditComponent";
import ScaleEditComponent from "./../components/ScaleEditComponent/ScaleEditComponent";
import TriggerComponent from "./../components/TriggerComponent/TriggerComponent";
import WASDPlayerControlComponent from "./../components/WASDPlayerControlComponent/WASDPlayerControlComponent";
import WorldPieceComponent from "./../components/WorldPieceComponent/WorldPieceComponent";

window.ComponentTypes = [
    DebugComponent,
    GRIDPlayerControlComponent,
    MinigolfClientBallControlComponent,
    PathFindingNodeComponent,
    PhysicsComponent,
    BasicPhysicsComponent,
    OBJPhysicsComponent,
    PositionEditComponent,
    BasicBoxMeshRenderComponent,
    BasicCylinderMeshRenderComponent,
    BasicHullMeshRenderComponent,
    BasicShapeMeshRenderComponent,
    BasicSphereMeshRenderComponent,
    OBJRenderComponent,
    RenderComponent,
    RotateEditComponent,
    ScaleEditComponent,
    TriggerComponent,
    WASDPlayerControlComponent,
    WorldPieceComponent,
    Component
];

Component._TypeFromName = (json) => ComponentTypes.find(t => t.name === json.name);
Component.FromFile = (json) => new (Component._TypeFromName(json))(json.args);

Entity._idCount = 0;

Entity._idGenerator = () => Entity._idCount++;

Entity.FindByID = (id) => entities().find(e => e.m_ID === id);

Entity.FromFile = (json, parent, offset) => {
	let entity = new Entity(json.pos.x + offset.x, json.pos.y + offset.y, json.pos.z + offset.z);

	if (json.rot) {
		entity.__OnInitialised = () => {
			entity.SetRotation(json.rot.x, json.rot.y, json.rot.z, json.rot.w);
		}
	}

	try {
		parent.AddChild(entity);
	}
	catch (e) {
		ENGINE.m_World.m_Entities.push(entity);
	}
	finally {
		json.components.forEach(c => {
			c.args.Parent = entity;
			entity.AddComponent(Component.FromFile(c));
		});
		json.entities.forEach(c => Entity.FromFile(c, entity, offset));
		//if (window.Editor) { EDITOR.render(); }
		return entity;
	}
};

export default Entity;













