'use client'

import { useEffect, useRef } from 'react';

interface IShaderProps {
  width: number;
  height: number;
  vertexShaderSource: string;
  fragmentShaderSource: string;
}

const Shader: React.FC<IShaderProps> = ({ width, height, vertexShaderSource, fragmentShaderSource, ...props }: IShaderProps) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

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
        return null;
      }

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
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (!program) return;
    // Setup vertex data (e.g., a simple triangle)
    const vertices = new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      1.0, -1.0,
      -1.0, 1.0,
      1.0, 1.0
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Bind position attribute
    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    //Get uniform location for time
    const timeLocation = gl.getUniformLocation(program, 'uTime');
    if (!timeLocation) {
      console.warn('Time uniform location not found');
     // return;
    }

    //Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    if (!resolutionLocation) {
      console.warn('Resolution uniform location not found');
     // return; it feels like when things are not used in the shader, they are not compiled so the get fails
    }

    // Set canvas resolution
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    const render = (time: number) => {

      gl.useProgram(program);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    return () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }, []);

  return <canvas ref={canvasRef} width={width} height={height} style={{ width: '100%', height: 'auto' }} />;
};

export default Shader;