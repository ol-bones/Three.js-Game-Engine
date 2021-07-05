"use strict";

import Entity from "./../../entities/Entity";
import Component from "./../Component";
import {mix} from "mixwith";
import { readyException } from "jquery";

class BasicTrainComponent extends mix(Component).with()
{
    constructor(args)
    {
      super(args);

      this.m_Name = "BasicTrainComponent";

      this.m_Nodes = [];

      this.m_Progress = 0;

      this.m_Speed = 5;
      this.m_RotateSpeed = 0.0075;

      this.m_Loop = true;
    }

    Initialise()
    {
      super.Initialise();

      this.m_Nodes = this.m_Args.Nodes
        .map(id => Entity.FindByID(id))
        .filter(id => !!id);

      if(this.m_Nodes.length !== this.m_Args.Nodes.length)
      {
        throw "Nodes not found in world";
      }

      const startNode = this.m_Nodes[0];

      if(!startNode.IsInitialised()
      || startNode.m_Position == void(0)
      || startNode.m_Position.x == void(0))
      {
        throw "Node not initialised";
      }

      this.m_Parent.SetPosition(
        startNode.m_Position.x,
        startNode.m_Position.y,
        startNode.m_Position.z
      );

      this.m_Parent.SetRotation(
        startNode.m_Rotation.x,
        startNode.m_Rotation.y,
        startNode.m_Rotation.z,
        true
      );

      this.m_CurrentNode = 0;

      this.OnInitialised();
    }


    Update()
    {
     // if(window.EDITOR) return;
      
      const currentNodeIndex = this.m_CurrentNode;
      const nextNodeIndex = currentNodeIndex + 1;

      const currentNode = this.m_Nodes[currentNodeIndex === -1 ? 0 : currentNodeIndex];
      const nextNode = this.m_Nodes[nextNodeIndex];

      const normal = new THREE.Vector3(
        nextNode.m_Position.x - this.m_Parent.m_Position.x,
        nextNode.m_Position.y - this.m_Parent.m_Position.y,
        nextNode.m_Position.z - this.m_Parent.m_Position.z
      ).normalize().multiplyScalar(this.m_Speed);

      const angleLerp = this.m_Parent.m_Rotation
        .clone()
        .rotateTowards(nextNode.m_Rotation, this.m_RotateSpeed);

      this.m_Parent.SetRotationQ(
        angleLerp.x,
        angleLerp.y,
        angleLerp.z,
        angleLerp.w,
        true
      );
      
      this.m_Parent.SetPosition(
        this.m_Parent.m_Position.x + normal.x,
        this.m_Parent.m_Position.y + normal.y,
        this.m_Parent.m_Position.z + normal.z
      );

      if(this.m_Parent.m_Position.distanceTo(nextNode.m_Position) < 15)
      {
        this.m_CurrentNode += 1;
      }

      if(this.m_Loop && this.m_CurrentNode >= this.m_Nodes.length - 1)
      {
        this.m_CurrentNode = -1;
      }

    }
}

export default BasicTrainComponent;