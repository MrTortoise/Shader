precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float sdEquilateralTriangle( in vec2 p, in float r )
{
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy * 2. -1.;    
    uv.x *= u_resolution.x / u_resolution.y;
    vec3 fc = vec3(0.0);

  for(float i=0.0;i<5.0;i++){    
    uv = fract(-uv*1.66)-0.5;
    float d = sdEquilateralTriangle(uv, 0.68)*2.-1.;
    vec3 color = palette(d, vec3(-0.122, 0.508, 0.328),vec3(1.538, 0.388, 0.348),vec3(1.898, 0.828, 0.709),vec3(7.562, 1.998, 4.507));
    d=sin(d*7.-u_time)/7.;
    d=abs(d);
    d =pow( (0.01)/d,1.2);
    fc += color *d;
}
    gl_FragColor = vec4(fc, 1.0);         
}