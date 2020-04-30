"use strict";

import LightComponent from "./../LightComponent";
import {mix} from "mixwith";

class PointLightComponent extends mix(LightComponent).with()
{
    constructor(args)
    {
        super(args);
    }

    Initialise()
    {
        super.Initialise();

        this.m_Light = new THREE.PointLight(
            this.m_Args.color || 0xff4400,
            this.m_Args.intensity || 0.9,
            this.m_Args.distance || 520,
            this.m_Args.decay || 2
        );

		this.OnInitialised();
    }

    Update()
    {
	}
}

export default PointLightComponent;