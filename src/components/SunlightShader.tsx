import { useEffect, useRef } from "react";

interface SunlightShaderProps {
  active: boolean;
  reducedMotion: boolean;
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
  uniform float uDepth;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;

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
    for (int octave = 0; octave < 4; octave++) {
      value += valueNoise(p) * amplitude;
      p = p * 2.03 + 17.17;
      amplitude *= 0.5;
    }
    return value;
  }

  mat2 rotate2d(float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return mat2(cosine, -sine, sine, cosine);
  }

  float softBand(float value, float center, float halfWidth, float feather) {
    return 1.0 - smoothstep(halfWidth, halfWidth + feather, abs(value - center));
  }

  void main() {
    vec2 pointerShift = (uPointer - 0.5) * vec2(0.028, 0.02);
    vec2 timeShift = vec2(
      sin(uTime * 0.083) + sin(uTime * 0.031) * 0.45,
      cos(uTime * 0.071) + sin(uTime * 0.027) * 0.35
    ) * 0.0018;
    vec2 scrollShift = vec2(uScroll * 0.022, -uScroll * 0.014);
    vec2 uv = vUv + pointerShift + timeShift + scrollShift;

    vec2 lightCenter = vec2(0.78, 0.55) + (uPointer - 0.5) * vec2(0.24, 0.18);
    vec2 lightDelta = uv - lightCenter;
    lightDelta.x *= mix(0.82, 1.0, clamp(uAspect / 1.45, 0.0, 1.0));
    float poolDistance = length(lightDelta / vec2(0.78, 0.94));
    float pool = 1.0 - smoothstep(0.34, 0.94, poolDistance);

    vec2 frame = uv - vec2(0.73, 0.5);
    frame.x *= clamp(uAspect, 0.78, 1.72);
    frame = rotate2d(-0.285) * frame;

    float edgeWarp = (fbm(frame * 3.2 + vec2(uTime * 0.006, 0.0)) - 0.5) * 0.018;
    float verticalRail = softBand(frame.x + edgeWarp, 0.19, 0.046, 0.038);
    float upperRail = softBand(frame.y + edgeWarp * 0.55, 0.245, 0.036, 0.035);
    float lowerRail = softBand(frame.y - edgeWarp * 0.4, -0.255, 0.034, 0.034);
    float frameShadow = max(verticalRail, max(upperRail, lowerRail));

    float cloud = fbm(uv * vec2(2.7, 2.1) + vec2(uTime * 0.005, -uTime * 0.003));
    float paneLight = pool * (1.0 - frameShadow * 0.72);
    paneLight *= mix(0.82, 1.04, cloud);

    float fineGrain = hash21(gl_FragCoord.xy * 0.73);
    float clusteredGrain = valueNoise(gl_FragCoord.xy * 0.065 + vec2(19.0, 7.0));
    float sunlightGrain = mix(fineGrain, clusteredGrain, 0.34);
    paneLight *= mix(0.78, 1.18, sunlightGrain);
    float scrollWarmth = clamp(uDepth, 0.0, 1.0);
    float lightAlpha = paneLight * (0.052 + fineGrain * 0.014) * mix(1.46, 2.42, scrollWarmth);
    float afternoonExposure = smoothstep(0.18, 0.82, paneLight);
    float exposureGrain = mix(0.84, 1.08, sunlightGrain);
    lightAlpha += afternoonExposure * mix(0.048, 0.135, scrollWarmth) * exposureGrain;
    float shadowAlpha = frameShadow * (0.105 + cloud * 0.028) * mix(1.0, 1.42, scrollWarmth);

    vec3 sunlight = mix(vec3(1.0, 0.34, 0.42), vec3(1.0, 0.18, 0.28), scrollWarmth);
    vec3 exposureTarget = mix(vec3(1.0, 0.72, 0.76), vec3(1.0, 0.52, 0.6), scrollWarmth);
    vec3 exposedSunlight = mix(sunlight, exposureTarget, mix(0.48, 0.6, scrollWarmth));
    vec3 frameTone = mix(vec3(0.16, 0.13, 0.1), vec3(0.36, 0.032, 0.006), scrollWarmth);
    float fieldAlpha = max(lightAlpha, shadowAlpha);
    vec3 fieldColor = mix(exposedSunlight, frameTone, smoothstep(0.018, 0.09, shadowAlpha));
    float ambientWarmAlpha = mix(0.042, 0.052, scrollWarmth);
    float combinedAlpha = min(1.0, fieldAlpha + ambientWarmAlpha);
    vec3 combinedColor = (fieldColor * fieldAlpha + exposedSunlight * ambientWarmAlpha) / max(combinedAlpha, 0.0001);

    // The page compositor expects premultiplied color channels. Keeping RGB
    // bounded by alpha prevents Safari from promoting faint light into opaque
    // white geometry when it composites the transparent WebGL canvas.
    gl_FragColor = vec4(combinedColor * combinedAlpha, combinedAlpha);
  }
`;

export function SunlightShader({ active, reducedMotion }: SunlightShaderProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const sceneElement = host.closest<HTMLElement>("[data-sunlight-shadow-host]")
      ?? host.closest<HTMLElement>(".folio-scene");
    if (!active) return;

    const canvas = document.createElement("canvas");
    canvas.className = "mat-sunlight-shader__canvas";
    host.appendChild(canvas);

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      stencil: false,
    });

    if (!gl) {
      host.dataset.shaderFailed = "true";
      canvas.remove();
      return undefined;
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const compiledVertex = compileShader(gl.VERTEX_SHADER, vertexShader);
    const compiledFragment = compileShader(gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram();

    if (!compiledVertex || !compiledFragment || !program) {
      host.dataset.shaderFailed = "true";
      if (compiledVertex) gl.deleteShader(compiledVertex);
      if (compiledFragment) gl.deleteShader(compiledFragment);
      if (program) gl.deleteProgram(program);
      canvas.remove();
      return undefined;
    }

    gl.attachShader(program, compiledVertex);
    gl.attachShader(program, compiledFragment);
    gl.linkProgram(program);
    gl.deleteShader(compiledVertex);
    gl.deleteShader(compiledFragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      host.dataset.shaderFailed = "true";
      gl.deleteProgram(program);
      canvas.remove();
      return undefined;
    }

    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) {
      host.dataset.shaderFailed = "true";
      gl.deleteProgram(program);
      canvas.remove();
      return undefined;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const aspectLocation = gl.getUniformLocation(program, "uAspect");
    const depthLocation = gl.getUniformLocation(program, "uDepth");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const scrollLocation = gl.getUniformLocation(program, "uScroll");
    const pointerLocation = gl.getUniformLocation(program, "uPointer");
    const pointerTarget = { x: 0.5, y: 0.5 };
    const pointerCurrent = { x: 0.5, y: 0.5 };
    let scrollTarget = window.scrollY / Math.max(window.innerHeight, 1);
    let scrollCurrent = scrollTarget;
    let scrollMomentumCurrent = 0;
    const readScrollDepth = () => {
      const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      return Math.min(1, Math.max(0, window.scrollY / scrollRange));
    };
    let depthTarget = readScrollDepth();
    let depthCurrent = depthTarget;
    let aspect = 1;
    let animationFrame = 0;
    let lastRender = -Infinity;
    let footerVisible = false;
    const startedAt = window.performance.now();

    const render = (elapsed: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(aspectLocation, aspect);
      gl.uniform1f(depthLocation, depthCurrent);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(scrollLocation, scrollCurrent);
      gl.uniform2f(pointerLocation, pointerCurrent.x, pointerCurrent.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (sceneElement) {
        const depthCurve = depthCurrent * depthCurrent * (3 - 2 * depthCurrent);
        const scrollWarmth = Math.max(0, Math.min(1, depthCurrent));
        const scrollMomentum = reducedMotion ? 0 : scrollMomentumCurrent;
        const motionEnergy = Math.abs(scrollMomentum);
        const quietSway = reducedMotion ? 0 : Math.sin(elapsed * 0.083) * 1.1;
        const shadowX = -10.5
          + depthCurve * 23
          + scrollMomentum * 7
          + (pointerCurrent.x - 0.5) * 4
          + quietSway;
        const shadowY = 6.2
          + depthCurve * 12.8
          + motionEnergy * 4
          + (0.5 - pointerCurrent.y) * 2.4
          + (reducedMotion ? 0 : Math.cos(elapsed * 0.071) * 0.55);
        const shadowBlur = 10.5 + depthCurve * 9 + motionEnergy * 4.5;
        const shadowRed = Math.round(48 + scrollWarmth * 78);
        const shadowGreen = Math.round(38 - scrollWarmth * 31);
        const shadowBlue = Math.round(30 - scrollWarmth * 27);
        const shadowOpacity = 0.19 + depthCurve * 0.12 + motionEnergy * 0.055;
        const paperShadowOpacity = 0.082 + depthCurve * 0.068 + motionEnergy * 0.028;
        const contactShadowX = -3.4
          + depthCurve * 5.6
          + scrollMomentum * 1.35
          + (pointerCurrent.x - 0.5) * 0.5;
        const contactShadowY = 2.4
          + depthCurve * 3.2
          + motionEnergy * 0.8
          + (0.5 - pointerCurrent.y) * 0.35;
        const contactShadowBlur = 3.2 + depthCurve * 1.8 + motionEnergy * 0.65;
        const contactShadowOpacity = 0.25 + depthCurve * 0.07 + motionEnergy * 0.035;
        const paperContactShadowOpacity = 0.13 + depthCurve * 0.06 + motionEnergy * 0.02;
        const paperLightX = 78 + (pointerCurrent.x - 0.5) * 24;
        const paperLightY = 55 + (pointerCurrent.y - 0.5) * 18;
        sceneElement.style.setProperty("--sun-shadow-x", `${shadowX.toFixed(2)}px`);
        sceneElement.style.setProperty("--sun-shadow-y", `${shadowY.toFixed(2)}px`);
        sceneElement.style.setProperty("--sun-shadow-blur", `${shadowBlur.toFixed(2)}px`);
        sceneElement.style.setProperty("--sun-shadow-color", `rgb(${shadowRed} ${shadowGreen} ${shadowBlue} / ${shadowOpacity.toFixed(3)})`);
        sceneElement.style.setProperty("--sun-paper-shadow-color", `rgb(${shadowRed} ${shadowGreen} ${shadowBlue} / ${paperShadowOpacity.toFixed(3)})`);
        sceneElement.style.setProperty("--sun-contact-shadow-x", `${contactShadowX.toFixed(2)}px`);
        sceneElement.style.setProperty("--sun-contact-shadow-y", `${contactShadowY.toFixed(2)}px`);
        sceneElement.style.setProperty("--sun-contact-shadow-blur", `${contactShadowBlur.toFixed(2)}px`);
        sceneElement.style.setProperty("--sun-contact-shadow-color", `rgb(${shadowRed} ${shadowGreen} ${shadowBlue} / ${contactShadowOpacity.toFixed(3)})`);
        sceneElement.style.setProperty("--sun-paper-contact-shadow-color", `rgb(${shadowRed} ${shadowGreen} ${shadowBlue} / ${paperContactShadowOpacity.toFixed(3)})`);
        sceneElement.style.setProperty("--sun-paper-light-x", `${paperLightX.toFixed(2)}%`);
        sceneElement.style.setProperty("--sun-paper-light-y", `${paperLightY.toFixed(2)}%`);
      }
    };

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      aspect = width / height;
      scrollTarget = window.scrollY / height;
      scrollCurrent = scrollTarget;
      scrollMomentumCurrent = 0;
      depthTarget = readScrollDepth();
      depthCurrent = depthTarget;
      render(reducedMotion ? 18 : (window.performance.now() - startedAt) / 1000);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      if (
        event.clientX < bounds.left
        || event.clientX > bounds.right
        || event.clientY < bounds.top
        || event.clientY > bounds.bottom
      ) return;

      pointerTarget.x = (event.clientX - bounds.left) / Math.max(bounds.width, 1);
      pointerTarget.y = 1 - (event.clientY - bounds.top) / Math.max(bounds.height, 1);
    };

    const onScroll = () => {
      const nextScroll = window.scrollY / Math.max(window.innerHeight, 1);
      scrollMomentumCurrent = reducedMotion
        ? 0
        : Math.max(-1, Math.min(1, (nextScroll - scrollCurrent) * 3.2));
      scrollTarget = nextScroll;
      scrollCurrent = scrollTarget;
      depthTarget = readScrollDepth();
      depthCurrent = depthTarget;
      if (footerVisible) return;
      if (reducedMotion) {
        render(18);
      } else {
        render((window.performance.now() - startedAt) / 1000);
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!reducedMotion) window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();

    const animate = (now: number) => {
      animationFrame = 0;
      if (footerVisible) return;
      if (now - lastRender >= 50) {
        lastRender = now;
        pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.042;
        pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.042;
        scrollMomentumCurrent += (0 - scrollMomentumCurrent) * 0.24;
        if (Math.abs(scrollMomentumCurrent) < 0.001) scrollMomentumCurrent = 0;
        render((now - startedAt) / 1000);
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (reducedMotion || footerVisible || animationFrame) return;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const onFooterVisibility = (event: Event) => {
      footerVisible = Boolean((event as CustomEvent<boolean>).detail);
      if (footerVisible) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        return;
      }
      render((window.performance.now() - startedAt) / 1000);
      startAnimation();
    };

    document.addEventListener(
      "parosayshi:footer-visibility",
      onFooterVisibility,
    );

    if (!reducedMotion) {
      startAnimation();
    } else {
      render(reducedMotion ? 18 : 0);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener(
        "parosayshi:footer-visibility",
        onFooterVisibility,
      );
      window.cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      sceneElement?.style.removeProperty("--sun-shadow-x");
      sceneElement?.style.removeProperty("--sun-shadow-y");
      sceneElement?.style.removeProperty("--sun-shadow-blur");
      sceneElement?.style.removeProperty("--sun-shadow-color");
      sceneElement?.style.removeProperty("--sun-paper-shadow-color");
      sceneElement?.style.removeProperty("--sun-contact-shadow-x");
      sceneElement?.style.removeProperty("--sun-contact-shadow-y");
      sceneElement?.style.removeProperty("--sun-contact-shadow-blur");
      sceneElement?.style.removeProperty("--sun-contact-shadow-color");
      sceneElement?.style.removeProperty("--sun-paper-contact-shadow-color");
      sceneElement?.style.removeProperty("--sun-paper-light-x");
      sceneElement?.style.removeProperty("--sun-paper-light-y");
      canvas.remove();
    };
  }, [active, reducedMotion]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="mat-sunlight-shader"
      data-active={active}
    />
  );
}
