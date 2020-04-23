uniform float delta;
varying vec3 pos;
varying vec3 vNormal;
varying vec3 nNormal;
varying vec3 wPosition;

void main()
{
	pos = position;

	float offset = 15.0 * sin(delta-0.5);
	if(pos.y < 0.0)
	{
		float diff = (abs(pos.y))-(abs(-10.5-offset));
		pos.x += ((diff*pos.x)*0.0175) * abs(cos((delta-0.5) / 0.3));
		pos.z += ((diff*pos.z)*0.0175) * abs(cos((delta-0.5) / 0.3));
	}
	else
	{
		pos.y += pos.y * 2.0;
		pos.x = pos.x * ((80.0-pos.y)/80.0);
		pos.z = pos.z * ((80.0-pos.y)/80.0);
		float diff = (abs(pos.y))-(abs(-10.5-offset));
		pos.x += ((diff*pos.x)*0.0175) * abs(cos((delta-0.5) / 0.3));
		pos.z += ((diff*pos.z)*0.0175) * abs(cos((delta-0.5) / 0.3));

		float waveStrength = 5.0;
		if(pos.y > 55.5)
		{
			waveStrength *= (pos.y - 55.5)/20.0;

			vec3 wavey = vec3(0.0, 0.0, 0.0);
			wavey.x = (waveStrength * sin(delta*6.283));
			wavey.z = (waveStrength * cos(delta*6.283));
		}
		vec3 wavey = vec3(0.0, 0.0, 0.0);
		wavey.x = (waveStrength * sin(delta*6.283));
		wavey.z = (waveStrength * cos(delta*6.283));

		wavey *= ((pos.y)/55.0) * (min(pos.y, 10.0) / 10.0);
		if(pos.y > 55.5) 
		{
			wavey.x += (5.0 * sin(delta*6.283));
			wavey.z += (5.0 * cos(delta*6.283));
		}
		pos += vec3((vec4(wavey, 1.0) * viewMatrix).xyz);

	}

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	wPosition = normalize((modelViewMatrix * vec4(pos, 1.0)).xyz);
	vNormal = normalize(normalMatrix * normal);
}