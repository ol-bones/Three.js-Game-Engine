"use strict";

import * as THREE from "three";
import Entity from "../../entities/Entity";
import Component from "../Component";
import {mix} from "mixwith";

class VehiclePassengerComponent extends mix(Component).with()
{
    constructor(args)
    {
		super(args);

		this.m_Canvas = document.querySelector("canvas");
		
		this.m_Name = "VehiclePassengerComponent";

		this.m_SeatEyePosition = new THREE.Vector3();

		this.m_IsSeated = false;

	/*	this.m_MovementKeyStates = {
			"w": false,
			"s": false,
			"a": false,
			"s": false
		}; */
    }

    Initialise()
    {
		this.RegisterKeyEvents();

		this.m_SeatEyePosition.x = this.m_Args.eyeOffset.x;
		this.m_SeatEyePosition.y = this.m_Args.eyeOffset.y;
		this.m_SeatEyePosition.z = this.m_Args.eyeOffset.z;

		this.m_IsSeated = this.m_Args.enterOnLoad;

		if(this.m_Args.enterOnLoad)
		{
			this.Enter();
		}

		super.Initialise();
		this.OnInitialised();
	}
	
	RegisterKeyEvents()
	{
		//window.addEventListener("mousedown", this.onFire.bind(this), false);

		window.addEventListener("keydown", (e) =>
		{
			const key = e.key;
			const held = e.repeat;

		/*	if(key === "w") this.m_MovementKeyStates["w"] = true;
			if(key === "a") this.m_MovementKeyStates["a"] = true;
			if(key === "s") this.m_MovementKeyStates["s"] = true;
			if(key === "d") this.m_MovementKeyStates["d"] = true;
			if(key === ' ') return this.Jump();*/

		}, false);

		window.addEventListener("keyup", (e) =>
		{
			const key = e.key;

		/*	if(key === "w") this.m_MovementKeyStates["w"] = false;
			if(key === "a") this.m_MovementKeyStates["a"] = false;
			if(key === "s") this.m_MovementKeyStates["s"] = false;
			if(key === "d") this.m_MovementKeyStates["d"] = false; */

		}, false);
	}

	GetLocalPlayer()
	{
		return entities().filter(e => e.m_Components.FPSPlayerControl)[0];
	}
	
	Enter()
	{
		const localPlayer = this.GetLocalPlayer();
		if(localPlayer)
		{
			localPlayer.m_Components.FPSPlayerControl.DisableMovement();
			this.m_IsSeated = true;
		}
	}

	Exit()
	{
		const localPlayer = this.GetLocalPlayer();
		if(localPlayer)
		{
			localPlayer.m_Components.FPSPlayerControl.EnableMovement();
			this.m_IsSeated = false;
		}
	}

    Update()
    {
		const localPlayer = this.GetLocalPlayer();
		if(this.m_IsSeated && localPlayer != void(0))
		{
			const parentPosition = this.m_Parent.m_Position;

			localPlayer.SetPosition(
				parentPosition.x,
				parentPosition.y,
				parentPosition.z,
				true
			)
		}
	}
}

export default VehiclePassengerComponent;