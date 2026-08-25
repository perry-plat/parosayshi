import { useEffect, useRef } from "react";

interface WallLightShaderProps {
  glowColor: string;
  lightColor: string;
  reducedMotion: boolean;
}

type Rgb = [number, number, number];

function hexToRgb(value: string): Rgb {
  const normalized = value.replace("#", "").trim();
  const hex = normalized.length === 3
    ? normalized.split("").map((character) => `${character}${character}`).join("")
    : normalized;
  const parsed = Number.parseInt(hex, 16);
  if (!Number.isFinite(parsed)) return [1, 1, 1];
  return [
    ((parsed >> 16) & 255) / 255,
    ((parsed >> 8) & 255) / 255,
    (parsed & 255) / 255,
  ];
}

const vertexShader = /* glsl */ `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uAspect;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uLightSize;
  uniform vec2 uPointer;
  uniform vec3 uGlowColor;
  uniform vec3 uLightColor;
  uniform vec3 uWallColor;
  uniform sampler2D uShadowMap;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int octave = 0; octave < 5; octave++) {
      value += valueNoise(p) * amplitude;
      p = p * 2.03 + 17.17;
      amplitude *= 0.5;
    }
    return value;
  }

  float sdRoundedBox(vec2 p, vec2 halfSize, float radius) {
    vec2 d = abs(p) - halfSize + radius;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
  }

  float canopyBreeze(float time, float phase, float index) {
    float longBreeze = sin(time * (0.72 + index * 0.045) + phase);
    float passingGust = sin(time * 0.29 + phase * 0.7);
    float gustEnvelope = 0.76 + (sin(time * 0.13 + phase * 0.41) + 1.0) * 0.2;
    float gustArrival = pow(max(0.0, sin(time * 0.37 + phase * 1.3)), 3.0);
    return (longBreeze * 0.68 + passingGust * 0.32) * gustEnvelope
      + gustArrival * 0.3;
  }

  float shadowLumaAt(vec2 uv) {
    vec3 sampleColor = texture2D(uShadowMap, clamp(uv, 0.0, 1.0)).rgb;
    return dot(sampleColor, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    vec2 uv = vUv;
    float slowTime = uTime * 0.12;

    // Keep the shader's unlit pixels identical to the document background.
    // The stationary CSS grain supplies the material texture across both the
    // canvas and the scroll runway, so the canvas never reads as a section.
    vec3 wall = uWallColor;

    vec2 screen = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);
    vec2 lightCenter = vec2(0.018, 0.09);
    vec2 lightSize = uLightSize;
    vec2 lightUv = (screen - lightCenter) / lightSize;
    float edgeNoise = (fbm(lightUv * 2.6 + vec2(7.0, 13.0)) - 0.5) * 0.012;
    float edgeDistance = sdRoundedBox(lightUv, vec2(0.96), 0.035) + edgeNoise;
    float lightMask = 1.0 - smoothstep(-0.008, 0.008, edgeDistance);
    float lightBloom = 1.0 - smoothstep(-0.34, 0.06, edgeDistance);
    float lightHalo = 1.0 - smoothstep(0.0, 0.06, max(edgeDistance, 0.0));

    float exposureCloud = fbm(lightUv * 1.35 + vec2(4.3, 1.7));
    float exposure = mix(0.92, 1.0, exposureCloud);
    vec3 sunsetLight = uLightColor * vec3(1.08, 1.0, 1.02);
    vec3 illuminatedWall = mix(wall, sunsetLight, 0.96);
    float bloomVariation = mix(0.82, 1.08, exposureCloud);
    illuminatedWall += lightBloom * uGlowColor * 0.047 * bloomVariation;
    vec3 illuminatedSurface = mix(wall, illuminatedWall, clamp(exposure, 0.0, 1.0));

    float shadowScaleY = 1.2083333;
    vec2 shadowSize = vec2(lightSize.x * 1.14, lightSize.y * shadowScaleY);
    vec2 shadowProjectionUv = (screen - lightCenter) / shadowSize;
    vec2 drift = vec2(sin(slowTime) * 0.008, cos(slowTime * 0.83) * 0.005);
    vec2 q = shadowProjectionUv + drift + (uPointer - 0.5) * vec2(0.025, 0.018);
    float shadowBottomAnchor = -0.5 + 0.48 / shadowScaleY;
    vec2 shadowUv = q * 0.5 + 0.5 + vec2(0.055, shadowBottomAnchor);
    // Keep the trunk, ledge, and bird grounded while the canopy catches the wind.
    float canopyWeight = pow(smoothstep(0.34, 0.84, shadowUv.y), 1.48);
    // Keep the spatial wind map fixed. Animating this noise field makes the
    // entire projection undulate like water instead of moving like foliage.
    float windField = fbm(shadowUv * vec2(3.2, 5.0) + vec2(5.4, 8.1));
    float leftWeight = exp(-pow((shadowUv.x - 0.24) * 4.2, 2.0));
    float centerWeight = exp(-pow((shadowUv.x - 0.52) * 4.5, 2.0));
    float rightWeight = exp(-pow((shadowUv.x - 0.8) * 4.2, 2.0));
    float breezeWeight = leftWeight + centerWeight + rightWeight + 0.0001;
    float groupedBreeze = (
      canopyBreeze(uTime, 0.2, 0.0) * leftWeight
      + canopyBreeze(uTime, 2.4, 1.0) * centerWeight
      + canopyBreeze(uTime, 4.6, 2.0) * rightWeight
    ) / breezeWeight;
    float primarySway = groupedBreeze * mix(0.028, 0.046, windField);

    float groupedFlutter = (
      sin(uTime * 1.37 + 0.2) * leftWeight
      + sin(uTime * 1.46 + 2.4) * centerWeight
      + sin(uTime * 1.31 + 4.6) * rightWeight
    ) / breezeWeight;
    vec2 windOffset = vec2(
      (primarySway + groupedFlutter * 0.0065) * canopyWeight * 1.08,
      groupedFlutter * 0.0018 * canopyWeight
    );
    vec2 movingShadowUv = shadowUv + windOffset;
    vec2 shadowTexel = vec2(1.0 / 1254.0);
    float centerLuma = shadowLumaAt(movingShadowUv);
    float neighborLuma = (
      shadowLumaAt(movingShadowUv + vec2(shadowTexel.x * 2.5, 0.0))
      + shadowLumaAt(movingShadowUv - vec2(shadowTexel.x * 2.5, 0.0))
      + shadowLumaAt(movingShadowUv + vec2(0.0, shadowTexel.y * 2.5))
      + shadowLumaAt(movingShadowUv - vec2(0.0, shadowTexel.y * 2.5))
    ) * 0.25;
    float shadowDarkness = 1.0 - centerLuma;
    float sharpenedDarkness = clamp(
      shadowDarkness + (neighborLuma - centerLuma) * 0.72,
      0.0,
      1.0
    );
    float softSilhouette = smoothstep(0.055, 0.285, shadowDarkness);
    float definedSilhouette = smoothstep(0.085, 0.235, sharpenedDarkness);
    float projectedShadow = max(softSilhouette * 0.82, definedSilhouette);

    // Let the silhouette land with slightly more optical density than the
    // ambient wall while retaining the same underlying wall hue.
    vec3 shadowedWall = wall * 0.955;
    vec3 projectedSurface = mix(illuminatedSurface, shadowedWall, projectedShadow);
    vec3 color = mix(wall, projectedSurface, lightMask);
    float outsideGlow = lightHalo * (1.0 - lightMask);
    color += outsideGlow * uGlowColor * 0.018;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

export function WallLightShader({ glowColor, lightColor, reducedMotion }: WallLightShaderProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const glowColorRef = useRef<Rgb>(hexToRgb(glowColor));
  const lightColorRef = useRef<Rgb>(hexToRgb(lightColor));
  const renderNowRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    glowColorRef.current = hexToRgb(glowColor);
    lightColorRef.current = hexToRgb(lightColor);
    renderNowRef.current();
  }, [glowColor, lightColor]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.className = "wall-light-shader__canvas";
    host.appendChild(canvas);

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
      stencil: false,
    });

    if (!gl) {
      host.dataset.shaderFailed = "true";
      canvas.remove();
      return undefined;
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Wall light shader failed to compile", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      host.dataset.shaderFailed = "true";
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      if (program) gl.deleteProgram(program);
      canvas.remove();
      return undefined;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      host.dataset.shaderFailed = "true";
      gl.deleteProgram(program);
      canvas.remove();
      return undefined;
    }

    const buffer = gl.createBuffer();
    const shadowTexture = gl.createTexture();
    if (!buffer || !shadowTexture) {
      host.dataset.shaderFailed = "true";
      if (buffer) gl.deleteBuffer(buffer);
      if (shadowTexture) gl.deleteTexture(shadowTexture);
      gl.deleteProgram(program);
      canvas.remove();
      return undefined;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const aspect = gl.getUniformLocation(program, "uAspect");
    const time = gl.getUniformLocation(program, "uTime");
    const resolution = gl.getUniformLocation(program, "uResolution");
    const lightSize = gl.getUniformLocation(program, "uLightSize");
    const pointer = gl.getUniformLocation(program, "uPointer");
    const glowColorUniform = gl.getUniformLocation(program, "uGlowColor");
    const lightColorUniform = gl.getUniformLocation(program, "uLightColor");
    const wallColorUniform = gl.getUniformLocation(program, "uWallColor");
    const shadowMap = gl.getUniformLocation(program, "uShadowMap");

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, shadowTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255]),
    );
    gl.uniform1i(shadowMap, 0);

    const pointerTarget = { x: 0.5, y: 0.5 };
    const pointerCurrent = { x: 0.5, y: 0.5 };
    const currentGlowColor = [...glowColorRef.current] as Rgb;
    const currentLightColor = [...lightColorRef.current] as Rgb;
    let currentWallColor: Rgb = [0.914, 0.898, 0.871];
    const startedAt = performance.now();
    let frame = 0;
    let disposed = false;
    let viewAspect = 1;
    let lightHalfWidth = 0.17;
    let lightHalfHeight = 0.24;

    const render = (seconds: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform1f(aspect, viewAspect);
      gl.uniform1f(time, seconds);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(lightSize, lightHalfWidth, lightHalfHeight);
      gl.uniform2f(pointer, pointerCurrent.x, pointerCurrent.y);
      gl.uniform3fv(glowColorUniform, currentGlowColor);
      gl.uniform3fv(lightColorUniform, currentLightColor);
      gl.uniform3fv(wallColorUniform, currentWallColor);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, shadowTexture);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    renderNowRef.current = () => {
      if (reducedMotion) {
        currentGlowColor.splice(0, 3, ...glowColorRef.current);
        currentLightColor.splice(0, 3, ...lightColorRef.current);
      }
      render(reducedMotion ? 18 : (performance.now() - startedAt) / 1000);
    };

    const shadowImage = new Image();
    shadowImage.decoding = "async";
    shadowImage.onload = () => {
      if (disposed) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, shadowTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        shadowImage,
      );
      delete host.dataset.shadowFailed;
      render(reducedMotion ? 18 : (performance.now() - startedAt) / 1000);
    };
    shadowImage.onerror = () => {
      if (disposed) return;
      host.dataset.shadowFailed = "true";
    };
    shadowImage.src = "/assets/invoice-folio/photographic-shadow-matte-leafy.png";

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      viewAspect = width / height;

      const styles = window.getComputedStyle(host);
      currentWallColor = hexToRgb(styles.getPropertyValue("--wall-color") || "#e9e5de");
      const apertureWidth = Number.parseFloat(styles.getPropertyValue("--wall-window-width")) || 296;
      const apertureHeight = Number.parseFloat(styles.getPropertyValue("--wall-window-height")) || 413;
      const softEdgeScale = 0.96;
      lightHalfWidth = apertureWidth / (2 * softEdgeScale * height);
      lightHalfHeight = apertureHeight / (2 * softEdgeScale * height);

      render(reducedMotion ? 18 : (performance.now() - startedAt) / 1000);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.x = event.clientX / Math.max(window.innerWidth, 1);
      pointerTarget.y = 1 - event.clientY / Math.max(window.innerHeight, 1);
    };

    const animate = (now: number) => {
      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.018;
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.018;
      for (let channel = 0; channel < 3; channel += 1) {
        currentGlowColor[channel] += (glowColorRef.current[channel] - currentGlowColor[channel]) * 0.055;
        currentLightColor[channel] += (lightColorRef.current[channel] - currentLightColor[channel]) * 0.055;
      }
      render((now - startedAt) / 1000);
      frame = window.requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    if (!reducedMotion) window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();
    if (!reducedMotion) frame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      renderNowRef.current = () => undefined;
      shadowImage.onload = null;
      shadowImage.onerror = null;
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(shadowTexture);
      gl.deleteProgram(program);
      canvas.remove();
    };
  }, [reducedMotion]);

  return <div ref={hostRef} aria-hidden="true" className="wall-light-shader" />;
}
