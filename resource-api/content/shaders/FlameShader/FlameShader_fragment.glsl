varying vec3 pos;
uniform float delta;
varying vec3 vNormal;
varying vec3 wPosition;

void main()
{
	float faceDiff = abs(dot(vNormal, wPosition));

	float alpha = (vec4(0.0, 0.05+(0.75-min(faceDiff, 0.75)*(1.5-min((abs(pos.y)*0.3)/6.0, 1.5)))*faceDiff, 0.0, 1.0) * viewMatrix).y;

	gl_FragColor = vec4(
		1.0,
		faceDiff,
		0.0,
		alpha
	);
}
