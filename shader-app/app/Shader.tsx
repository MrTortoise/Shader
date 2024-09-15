'use client'

import { useEffect, useRef } from 'react';

const Shader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

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

    const tutorialShader ={ vertex: webGlTutorialVertexShader, fragment: webGlTutorialFragmentShader}


    // Compile Shader
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) => {
      const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
      const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

      const program = gl.createProgram();
      if (!program) {
        console.error('Program creation error');
        return null;
      }

      if (!vertexShader || !fragmentShader) {
        console.error('Shader compilation error');
        return null;}

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return;
      }

      gl.useProgram(program);
      return program;
    }

   

    // // Create Program
    const program = createProgram(gl, tutorialShader.vertex, tutorialShader.fragment);
    if (!program) return;
        // Setup vertex data (e.g., a simple triangle)
        const vertices = new Float32Array([
          -1.0, -1.0,
           1.0, -1.0,
          -1.0,  1.0,
           1.0, -1.0,
          -1.0,  1.0,
           1.0,  1.0
      ]);

      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
      // Bind position attribute
      const positionLocation = gl.getAttribLocation(program, 'aPosition');
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionLocation);
  
      // Get uniform location for time
      const timeLocation = gl.getUniformLocation(program, 'uTime');
      if (!timeLocation) {
        console.error('Time uniform location not found');
        return;
      }
      // Get uniform locations
      const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
  
      // Set canvas resolution
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      const render = (time: number) => {
        gl.uniform1f(timeLocation, time * 0.001);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} style={{ width: '100%', height: 'auto' }} />;
};

export default Shader;