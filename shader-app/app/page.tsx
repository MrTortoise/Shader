import Image from "next/image";
import Shader from './Shader';

const webGlTutorialVertexShader = `
attribute vec2 aPosition;
varying vec2 vTexCoord;

void main() {
    // Pass through the position and set texture coordinates
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vTexCoord = (aPosition + vec2(1.0)) / 2.0; // Convert to [0, 1] range for texture coordinates
}

`

// Fragment Shader
const webGlTutorialFragmentShader = `  
precision mediump float;
varying vec2 vTexCoord;
uniform float uTime;

void main() {
    float color = 0.5 + 0.5 * sin(uTime + vTexCoord.x * 10.0);
    gl_FragColor = vec4(color, color, color, 1.0);         
}

`;

const zoomeyVertexShaderSource = `
attribute vec2 aPosition;
varying vec2 vTexCoord;

void main() {
    // Pass through the position and set texture coordinates
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vTexCoord = (aPosition + vec2(1.0)) / 2.0; // Convert to [0, 1] range for texture coordinates
}

`

// Fragment Shader
const zoomeyFragmentShaderSource = `  
precision mediump float;
varying vec2 vTexCoord;
uniform vec2 uResolution;
uniform float uTime;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy * 2. -1.;    
    uv.x *= uResolution.x / uResolution.y;
    float d = length(uv);
    d=sin(d*10.)/10.;
    d=abs(d);
    d = smoothstep(0.0,0.2,d);
    float color = 0.5 + 0.5 * abs(sin(uTime + vTexCoord.x * 10.0));
    gl_FragColor = vec4(d,-d, 0., 1.0);         
}

`;

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Shader width={1600} height={1200} vertexShaderSource={zoomeyVertexShaderSource} fragmentShaderSource={zoomeyFragmentShaderSource} />
        <Shader width={800} height={600} vertexShaderSource={webGlTutorialVertexShader} fragmentShaderSource={webGlTutorialFragmentShader} />

      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
