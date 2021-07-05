"use strict";

import * as THREE from "three";
import Entity from "./../../entities/Entity";
import Component from "./../Component";
import {mix} from "mixwith";

class BasicNodeComponent extends mix(Component).with()
{
    constructor(args)
    {
      super(args);

      this.m_Name = "BasicNodeComponent";

      this.m_ArrowForwards = null;
      this.m_ArrowUp = null;

    }

    Initialise()
    {
      super.Initialise();

      if(window.EDITOR != void(0))
      {
        const boxJSON =
        {
          "args":
          {
            "Parent": this.m_Parent
          },
          "name":"BasicBoxMeshRenderComponent",
          "updateable": false
        };
        
        const editorComponentReference = Component;

        const boxComponent = editorComponentReference.FromFile(boxJSON);
        this.m_Parent.AddComponent(boxComponent);

        this.m_ArrowUp = new THREE.ArrowHelper
        (
          new THREE.Vector3(0, 1, 0),
          this.m_Parent.m_Position,
          Math.max(this.m_Parent.m_Scale.x, 50),
          new THREE.Color(1,1,1),
          0.2 * 50,
          (0.2 * 30)
        );

        this.m_ArrowUp.line.material.linewidth = 3;
        this.m_ArrowUp.m_ParentEntity = this.m_Parent;
        ENGINE.m_World.m_EditorScene.add(this.m_ArrowUp);

        this.m_ArrowForwards = new THREE.ArrowHelper
        (
          new THREE.Vector3(0, 1, 0),
          this.m_Parent.m_Position,
          Math.max(this.m_Parent.m_Scale.x, 50),
          new THREE.Color(1,1,1),
          0.2 * 50,
          (0.2 * 30)
        );

        this.m_ArrowForwards.line.material.linewidth = 3;
        this.m_ArrowForwards.m_ParentEntity = this.m_Parent;
        ENGINE.m_World.m_EditorScene.add(this.m_ArrowForwards);
      }

      this.OnInitialised();
    }


    Update()
    {
      if(this.m_ArrowForwards != void(0))
      {
        this.m_ArrowForwards.setDirection(
          this.m_Parent.m_Components.RenderComponent.m_Mesh.getWorldDirection(
            new THREE.Vector3()
          )
        );

        const angleColourComponents = new THREE.Euler().setFromQuaternion(this.m_Parent.m_Rotation);

        angleColourComponents.x /= (Math.PI*2);
        angleColourComponents.y /= (Math.PI*2);
        angleColourComponents.z /= (Math.PI*2);

        const angleColourAsVector = angleColourComponents.toVector3().normalize();

        this.m_ArrowForwards.setColor(new THREE.Color(
          Math.abs(angleColourAsVector.x),
          Math.abs(angleColourAsVector.y),
          Math.abs(angleColourAsVector.z)
        ));

        this.m_ArrowUp.setColor(new THREE.Color(
          Math.abs(angleColourAsVector.x),
          Math.abs(angleColourAsVector.y),
          Math.abs(angleColourAsVector.z)
        ));
      }
    }
}

export default BasicNodeComponent;