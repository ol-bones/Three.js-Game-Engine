import BaseObject from "./BaseObject";
import Movable from "./../mixins/Movable";
import Clickable from "./../mixins/Clickable";
import Savable from "./../mixins/Savable";

import Component from "./../components/Component";
import Comms from "./../mixins/Comms/Comms";

import EntityModel from "./../models/EntityModel";

import {mix} from "mixwith";

class Entity extends mix(BaseObject).with(Comms, Movable, Clickable, Savable)
{
	constructor(
		x, y, z,
		px, py, pz,
		sx, sy, sz,
		parent)
	{
		super();

		this.m_ID = Entity._idGenerator();

		this.m_Parent = parent || ENGINE.m_World;

		this.m_Components = {};
		this.m_Entities = [];

		this.__IsInitialised = false;
		this.__OnInitialised = () => null;

		this.m_Position = new THREE.Vector3(x, y, z);
		this.m_OriginalOffset = this.m_Position.clone();
		this.m_ParentOffset = new THREE.Vector3(px, py, pz);

		this.m_Scale = new THREE.Vector3(sx || 1, sy || 1, sz || 1);
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
			.forEach((key) =>
			{
				try
				{
					const now = Date.now();
					const component = this.m_Components[key];
					if(component != void(0)
					&& now - component.m_LastInitialisedTime > 1000)
					{
						component.m_LastInitialisedTime = now;
						component.Initialise();
					}
				} catch (e) {}
			});
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

		if(this.m_Entities.length > 0) this.m_Entities.forEach(e =>
			e.SetPosition(
				e.m_ParentOffset.x + this.m_Position.x,
				e.m_ParentOffset.y + this.m_Position.y,
				e.m_ParentOffset.z + this.m_Position.z
			)
		);
	}

	_SetPosition(x, y, z) {
		this.m_Position.set(x, y, z);
	}

	SetPositionX(x) { this.SetPosition(x, this.m_Position.y, this.m_Position.z); }
	SetPositionY(y) { this.SetPosition(this.m_Position.x, y, this.m_Position.z); }
	SetPositionZ(z) { this.SetPosition(this.m_Position.x, this.m_Position.y, z); }

	SetScale(x, y, z, propagate = true) {
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

		if(propagate && this.m_Entities.length > 0) this.m_Entities.forEach(e =>
			e.SetScale(x, y, z, propagate)
		);
	}

	SetScaleX(x) { this.SetScale(x, this.m_Scale.y, this.m_Scale.z); }
	SetScaleY(y) { this.SetScale(this.m_Scale.x, y, this.m_Scale.z); }
	SetScaleZ(z) { this.SetScale(this.m_Scale.x, this.m_Scale.y, z); }

	_SetRotation(x, y, z, propagate = true) {
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

		if(propagate && this.m_Entities.length > 0) this.m_Entities.forEach(e =>
			e._SetRotation(x, y, z, propagate)
		);
	}

	SetRotation(x, y, z, propagate = true)
	{
		this._SetRotation(x, y, z, propagate);
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

	Update(dt) {
		if (this.IsInitialised()) {
			Object.keys(this.m_Components).forEach(c => this.m_Components[c].Update(dt));
			if (this.m_Components.RenderComponent) {
				this.m_Components.RenderComponent.SetPosition
					(
					this.m_Position.x, this.m_Position.y, this.m_Position.z
					);
			}
			this.ProcessInboundCommsQueue();
			this.m_Entities.forEach(e => e.Update(dt));
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
import FPSPlayerControl from "./../components/FPSPlayerControl/FPSPlayerControl";
import PathFindingNodeComponent from "./../components/PathFindingNodeComponent/PathFindingNodeComponent";
import PhysicsComponent from "./../components/PhysicsComponent/PhysicsComponent";
import BasicPhysicsComponent from "./../components/PhysicsComponent/mixins/BasicPhysicsComponent";
import HeightmapPhysicsComponent from "./../components/PhysicsComponent/mixins/HeightmapPhysicsComponent";
import OBJPhysicsComponent from "./../components/PhysicsComponent/mixins/OBJPhysicsComponent";
import PositionEditComponent from "./../components/PositionEditComponent/PositionEditComponent";
import BasicBoxMeshRenderComponent from "./../components/RenderComponent/mixins/BasicBoxMeshRenderComponent";
import BasicCylinderMeshRenderComponent from "./../components/RenderComponent/mixins/BasicCylinderMeshRenderComponent";
import BasicHullMeshRenderComponent from "./../components/RenderComponent/mixins/BasicHullMeshRenderComponent";
import BasicShapeMeshRenderComponent from "./../components/RenderComponent/mixins/BasicShapeMeshRenderComponent";
import BasicSphereMeshRenderComponent from "./../components/RenderComponent/mixins/BasicSphereMeshRenderComponent";
import HeightmapPlaneMeshRenderComponent from "./../components/RenderComponent/mixins/HeightmapPlaneMeshRenderComponent";
import OBJRenderComponent from "./../components/RenderComponent/mixins/OBJRenderComponent";
import VegetationMeshRenderComponent from "./../components/RenderComponent/mixins/VegetationMeshRenderComponent";
import FlameRenderComponent from "./../components/RenderComponent/mixins/FlameRenderComponent";
import RenderComponent from "./../components/RenderComponent/RenderComponent";
import PointLightComponent from "./../components/LightComponent/mixins/PointLightComponent";
import LightComponent from "./../components/LightComponent/LightComponent";
import RotateEditComponent from "./../components/RotateEditComponent/RotateEditComponent";
import ScaleEditComponent from "./../components/ScaleEditComponent/ScaleEditComponent";
import HeightmapEditComponent from "./../components/HeightmapEditComponent/HeightmapEditComponent";
import PlanePaintEditComponent from "./../components/PlanePaintEditComponent/PlanePaintEditComponent";
import TriggerComponent from "./../components/TriggerComponent/TriggerComponent";
import WASDPlayerControlComponent from "./../components/WASDPlayerControlComponent/WASDPlayerControlComponent";
import WorldPieceComponent from "./../components/WorldPieceComponent/WorldPieceComponent";

window.ComponentTypes = [
    DebugComponent,
    GRIDPlayerControlComponent,
	MinigolfClientBallControlComponent,
	FPSPlayerControl,
    PathFindingNodeComponent,
    PhysicsComponent,
	BasicPhysicsComponent,
	HeightmapPhysicsComponent,
    OBJPhysicsComponent,
    PositionEditComponent,
    BasicBoxMeshRenderComponent,
    BasicCylinderMeshRenderComponent,
    BasicHullMeshRenderComponent,
    BasicShapeMeshRenderComponent,
	BasicSphereMeshRenderComponent,
	HeightmapPlaneMeshRenderComponent,
	VegetationMeshRenderComponent,
	FlameRenderComponent,
	PlanePaintEditComponent,
    OBJRenderComponent,
	RenderComponent,
	PointLightComponent,
	LightComponent,
    RotateEditComponent,
	ScaleEditComponent,
	HeightmapEditComponent,
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

Entity.FromFile = (json, parent, offset, postinit) => {
	console.log(json);

	const entityPosition = new THREE.Vector3(json.pos.x, json.pos.y, json.pos.z);
	const parentPosition = new THREE.Vector3();
	if(parent != void(0)) parentPosition.add(parent.m_OriginalOffset);
	const spawnPosition = entityPosition.clone().add(parentPosition);

	let entity = new Entity(
		spawnPosition.x, spawnPosition.y, spawnPosition.z,
		entityPosition.x, entityPosition.y, entityPosition.z,
		json.scale.x, json.scale.y, json.scale.z,
		parent
	);

	if (json.rot || json.scale) {
		entity.__OnInitialised = () => {
			if(json.scale) entity.SetScale(
				json.scale.x, json.scale.y, json.scale.z, false
			);
			if(json.rot) entity.SetRotation(
				json.rot.x, json.rot.y, json.rot.z, json.rot.w, false
			);

			const coloredComponent = json.components.find(c => { 
				try { if(c.args.material.color) {return true;} } catch(e) { return false; }
			});

			if(coloredComponent)
			{
				entity.m_Components.RenderComponent.SetColor(new THREE.Color().setHex(coloredComponent.args.material.color));
			}

			if(entity.m_Components.PhysicsComponent)
			{
				entity.m_Components.PhysicsComponent.m_PhysicsBody.wakeUp();
			}

			if(postinit && typeof postinit === "function") try { postinit(entity); } catch(e) {}
		}
	}

	try {
		if(parent != void(0))
		{
			parent.AddChild(entity);
		}
		else
		{
			ENGINE.m_World.m_Entities.push(entity);
		}
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













