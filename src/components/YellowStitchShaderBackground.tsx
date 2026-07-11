import { useEffect, useRef } from 'react';

export default function YellowStitchShaderBackground() {
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

      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        float m0 = 1.0 - 0.5 * (a0.x*a0.x + h.x*h.x);
        float m1 = 1.0 - 0.5 * (a0.y*a0.y + h.y*h.y);
        float m2 = 1.0 - 0.5 * (a0.z*a0.z + h.z*h.z);
        vec3 g = vec3(a0.x * x0.x + h.x * x0.y, a0.y * x12.x + h.y * x12.y, a0.z * x12.z + h.z * x12.w);
        return 130.0 * dot(m, g);
      }

      void main() {
          vec2 uv = v_texCoord;
          vec2 mouse = u_mouse / u_resolution;
          
          if(u_resolution.x > u_resolution.y) {
              float aspect = u_resolution.x / u_resolution.y;
              uv.x *= aspect;
              mouse.x *= aspect;
          } else {
              float aspect = u_resolution.y / u_resolution.x;
              uv.y *= aspect;
              mouse.y *= aspect;
          }
          
          // Azure Equinox Palette
          vec3 surface = vec3(0.968, 0.976, 1.0); // #f7f9ff
          vec3 primary = vec3(0.0, 0.157, 0.333); // #002855 (Approx deep navy)
          vec3 skyBlue = vec3(0.529, 0.808, 0.922); // Sky blue accent
          vec3 warmGold = vec3(0.85, 0.65, 0.13); // Warm gold accent
          vec3 brightYellow = vec3(1.0, 0.85, 0.1); // Bright yellow accent

          float t = u_time * 0.2;
          
          // Create layered noise for fluid motion
          float n1 = snoise(uv * 2.0 + t);
          float n2 = snoise(uv * 3.0 - t * 1.5 + n1);
          float n3 = snoise(uv * 1.5 + vec2(n1, n2) + t * 0.5);
          
          // Base gradient flow
          vec3 color = mix(surface, skyBlue, smoothstep(-1.0, 1.0, n1) * 0.3);
          color = mix(color, primary, smoothstep(0.2, 1.0, n2) * 0.15);
          
          // Add gold highlight based on noise and mouse proximity
          float dist = length(uv - mouse);
          float mouseGlow = smoothstep(0.4, 0.0, dist);
          float goldFactor = smoothstep(0.3, 0.8, n3);
          
          color = mix(color, warmGold, goldFactor * 0.1);
          color += warmGold * mouseGlow * 0.05;

          // Add a little yellow based on the second noise layer
          float yellowFactor = smoothstep(0.4, 0.9, n2);
          color = mix(color, brightYellow, yellowFactor * 0.12);

          gl_FragColor = vec4(color, 1.0);
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
