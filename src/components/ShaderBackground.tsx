import { useEffect, useRef } from 'react';

export default function ShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      void main() {
          vec2 uv = v_texCoord;
          
          // Adjust aspect ratio to prevent stretching
          if(u_resolution.x > u_resolution.y) {
              uv.x *= u_resolution.x / u_resolution.y;
          } else {
              uv.y *= u_resolution.y / u_resolution.x;
          }

          float time = u_time * 0.15;
          
          // Generate smooth noise/wave patterns
          float noise1 = sin(uv.x * 2.0 + time) * cos(uv.y * 1.5 - time) * 0.5 + 0.5;
          float noise2 = sin(uv.y * 2.5 + time * 1.2) * cos(uv.x * 1.8 + time * 0.8) * 0.5 + 0.5;
          float noise3 = sin((uv.x + uv.y) * 1.5 - time * 0.5) * 0.5 + 0.5;

          // Website palette
          vec3 softWhite = vec3(0.992, 0.996, 0.996); // #FDFEFE
          vec3 skyBlue = vec3(0.561, 0.812, 0.918);   // #8FCFEA
          vec3 warmGold = vec3(0.788, 0.573, 0.184);  // #C9922F
          
          // Create a subtle gold highlight
          vec3 lightGold = mix(softWhite, warmGold, 0.15);
          
          // Base mix of soft white and sky blue
          vec3 baseColor = mix(softWhite, skyBlue, noise1 * 0.6);
          // Add variation
          baseColor = mix(baseColor, softWhite, noise2 * 0.5);
          // Add subtle warm gold accents
          vec3 finalColor = mix(baseColor, lightGold, noise3 * 0.7);

          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function compileShader(src: string, type: number): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(vs, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fs, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    // Handle ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = (width || 1280) * dpr;
        canvas.height = (height || 720) * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    });
    resizeObserver.observe(container);

    // Initial sizing
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width || 1280;
    canvas.height = rect.height || 720;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      const nx = (e.clientX - canvasRect.left) / canvasRect.width;
      const ny = 1.0 - (e.clientY - canvasRect.top) / canvasRect.height;
      mouseRef.current = { x: nx * canvas.width, y: ny * canvas.height };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const start = performance.now();
    const render = () => {
      if (!gl || !canvas) return;
      const time = (performance.now() - start) * 0.001;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      if (uTime) gl.uniform1f(uTime, time);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(requestRef.current);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      if (gl) {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
