"use strict";

import Entity from "./../../../entities/Entity";
import DoorComponent from "./../DoorComponent";
import {mix} from "mixwith";

class SlidingDoorComponent extends mix(DoorComponent).with()
{
    constructor(args)
    {
        super(args);

        this.m_IsOpen = false;
        this.m_IsClosed = true;

        this.m_IsOpening = false;
        this.m_IsClosing = false;

        this.m_SlideDirection = new THREE.Vector3(0,0,1);
        this.m_SlideDistance  = 20;
        this.m_SlideSpeed = 0.05;

        this.m_InitialPosition = new THREE.Vector3();

        this.m_TriggerID = null;
    }

    Initialise()
    {
        super.Initialise();

        this.m_SlideDirection = new THREE.Vector3(
            this.m_Args.slidedirection_x || 0,
            this.m_Args.slidedirection_y || 0,
            this.m_Args.slidedirection_z || 1
        );

        this.m_SlideDistance = this.m_Args.slidedistance || 20;
        this.m_SlideSpeed = this.m_Args.slidespeed || 0.05;

        if(this.m_Args.triggerid)
        {
            const triggerEntity = Entity.FindByID(Number(this.m_Args.triggerid));

            if(triggerEntity.m_Components.TriggerComponent)
            {
                const trigger = triggerEntity.m_Components.TriggerComponent;
                if(trigger && trigger.m_TriggerFunctions && Array.isArray(trigger.m_TriggerFunctions))
                {
                    trigger.m_TriggerFunctions.push(this.Open.bind(this));
                }
            }
        }

		this.OnInitialised();
    }

    Open(evt)
    {
        if(this.m_IsClosed && !this.m_IsOpen && !this.m_IsOpening && !this.m_IsClosing)
        {
            this.m_InitialPosition = this.m_Parent.m_Position.clone();
            this.m_IsOpening = true;
        }
    }

    Update()
    {
        if(this.m_IsOpening)
        {
            let distance = this.m_Parent.m_Position.distanceTo(this.m_InitialPosition);

            const slideSpeed = (this.m_SlideDistance * this.m_SlideSpeed)
                * (Math.min(Math.max(1, distance), this.m_SlideDistance)/this.m_SlideDistance);
                    
            const slideVector = this.m_SlideDirection.clone().multiplyScalar(slideSpeed);

            const nextPosition = new THREE.Vector3(
                this.m_Parent.m_Position.x + slideVector.x,
                this.m_Parent.m_Position.y + slideVector.y,
                this.m_Parent.m_Position.z + slideVector.z
            );

            this.m_Parent.SetPosition(
                nextPosition.x,
                nextPosition.y,
                nextPosition.z
            );

            console.log(slideSpeed);
            
            distance = this.m_Parent.m_Position.distanceTo(this.m_InitialPosition);

            if(distance >= this.m_SlideDistance)
            {
                this.m_IsOpening = false;
                this.m_IsOpen = true;
                this.m_IsClosed = false;
                this.m_IsClosing = false;
            }
        }
	}
}

export default SlidingDoorComponent;