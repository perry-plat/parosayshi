import { useEffect, useRef } from "react";

interface Bloom {
  bornAt: number;
  color: string;
  life: number;
  size: number;
  sway: number;
  variant: number;
  x: number;
  y: number;
}

const PETAL_PATTERNS = [
  [[0, -2], [-1, -1], [1, -1], [-2, 0], [0, 0], [2, 0], [-1, 1], [1, 1]],
  [[-1, -2], [1, -2], [-2, -1], [0, -1], [2, -1], [-1, 0], [1, 0], [0, 1]],
  [[0, -3], [-1, -2], [1, -2], [-2, -1], [2, -1], [-1, 0], [0, 0], [1, 0]],
] as const;

const FLOWER_COLORS = ["#ffd6df", "#ff9ab4", "#ffbd68", "#f8eee2", "#d9b2ff", "#9bc8ff"];

function easeOut(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

export function GrassBloomField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionQuery.matches;
    let blooms: Bloom[] = [];
    let animationFrame = 0;
    let visible = true;
    let lastPoint: { x: number; y: number } | null = null;
    let stationarySince = 0;
    let sproutedForStop = false;
    let width = 1;
    let height = 1;
    let pixelRatio = 1;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = false;
    };

    const addBloom = (x: number, y: number, now: number, sizeMultiplier = 1) => {
      const seed = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453);
      const random = seed - Math.floor(seed);
      blooms.push({
        bornAt: now,
        color: FLOWER_COLORS[Math.floor(random * FLOWER_COLORS.length)]!,
        life: 6800 + random * 2800,
        size: (2.1 + random * 1.55) * sizeMultiplier,
        sway: (random - 0.5) * 1.8,
        variant: Math.floor(random * PETAL_PATTERNS.length),
        x: Math.round(x),
        y: Math.round(y),
      });
      if (blooms.length > 72) blooms = blooms.slice(-72);
    };

    const sproutCluster = (x: number, y: number, now: number) => {
      const seed = Math.abs(Math.sin(x * 39.17 + y * 17.81) * 43758.5453);
      const random = seed - Math.floor(seed);
      addBloom(x, y, now, 1.1);
      addBloom(x - 12 - random * 8, y + 3 + random * 8, now + 80, 0.72);
      if (random > 0.32) addBloom(x + 13 + random * 7, y + 5, now + 140, 0.64);
    };

    const isProtectedTarget = (clientX: number, clientY: number) => {
      const target = document.elementFromPoint(clientX, clientY);
      return Boolean(
        target?.closest(
          "[data-bloom-block], a, button, input, textarea, select, summary, [role='button'], [role='link']",
        ),
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType === "touch") return;
      const bounds = host.getBoundingClientRect();
      if (
        event.clientX < bounds.left
        || event.clientX > bounds.right
        || event.clientY < bounds.top
        || event.clientY > bounds.bottom
      ) {
        lastPoint = null;
        stationarySince = 0;
        sproutedForStop = false;
        return;
      }
      if (isProtectedTarget(event.clientX, event.clientY)) {
        lastPoint = null;
        stationarySince = 0;
        sproutedForStop = false;
        return;
      }

      const next = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
      const now = performance.now();
      if (!lastPoint) {
        lastPoint = next;
        stationarySince = now;
        sproutedForStop = false;
        return;
      }

      const deltaX = next.x - lastPoint.x;
      const deltaY = next.y - lastPoint.y;
      const distance = Math.hypot(deltaX, deltaY);
      if (distance > 3) {
        lastPoint = next;
        stationarySince = now;
        sproutedForStop = false;
      }
    };

    const onPointerLeave = () => {
      lastPoint = null;
      stationarySince = 0;
      sproutedForStop = false;
    };

    const drawAmbience = (now: number) => {
      const time = reducedMotion ? 0 : now * 0.00008;
      const lightX = width * (0.62 + Math.sin(time * 1.7) * 0.09);
      const lightY = height * (0.4 + Math.cos(time * 1.3) * 0.08);
      const light = context.createRadialGradient(
        lightX,
        lightY,
        0,
        lightX,
        lightY,
        Math.max(width, height) * 0.62,
      );
      light.addColorStop(0, "rgba(255, 207, 222, 0.06)");
      light.addColorStop(0.48, "rgba(244, 216, 255, 0.02)");
      light.addColorStop(1, "rgba(19, 43, 0, 0.07)");
      context.fillStyle = light;
      context.fillRect(0, 0, width, height);
    };

    const drawBloom = (bloom: Bloom, now: number) => {
      const age = now - bloom.bornAt;
      const progress = Math.max(0, Math.min(1, age / bloom.life));
      const opening = easeOut(Math.min(1, progress / 0.16));
      const fade = progress > 0.76 ? 1 - (progress - 0.76) / 0.24 : 1;
      const pixel = bloom.size * opening;
      if (pixel <= 0.1 || fade <= 0) return;

      const stemHeight = Math.max(2, Math.round(5 * opening));
      const pattern = PETAL_PATTERNS[bloom.variant] ?? PETAL_PATTERNS[0];
      context.save();
      context.globalAlpha = Math.max(0, fade);
      const sway = Math.sin(now * 0.0012 + bloom.x) * bloom.sway * opening;
      context.translate(bloom.x + sway, bloom.y);

      context.fillStyle = "#315a12";
      context.fillRect(
        Math.round(-pixel * 0.45),
        Math.round(pixel * 1.2),
        Math.max(1, Math.round(pixel * 0.8)),
        Math.round(pixel * stemHeight),
      );
      if (opening > 0.7) {
        context.fillRect(
          Math.round(pixel * 0.4),
          Math.round(pixel * 3),
          Math.round(pixel * 1.8),
          Math.max(1, Math.round(pixel * 0.8)),
        );
        context.fillRect(
          Math.round(-pixel * 1.6),
          Math.round(pixel * 4.2),
          Math.round(pixel * 1.5),
          Math.max(1, Math.round(pixel * 0.8)),
        );
      }

      context.fillStyle = "rgba(24, 44, 10, 0.48)";
      pattern.forEach(([column, row]) => {
        context.fillRect(
          Math.round(column * pixel + pixel * 0.55),
          Math.round(row * pixel + pixel * 0.55),
          Math.ceil(pixel),
          Math.ceil(pixel),
        );
      });

      context.fillStyle = bloom.color;
      pattern.forEach(([column, row]) => {
        context.fillRect(
          Math.round(column * pixel),
          Math.round(row * pixel),
          Math.ceil(pixel),
          Math.ceil(pixel),
        );
      });
      context.fillStyle = "#6d3c16";
      context.fillRect(
        Math.round(-pixel * 0.45),
        Math.round(-pixel * 0.45),
        Math.max(1, Math.ceil(pixel)),
        Math.max(1, Math.ceil(pixel)),
      );
      context.restore();
    };

    const render = (now: number) => {
      animationFrame = 0;
      if (!visible) return;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      drawAmbience(now);

      blooms = blooms.filter((bloom) => now - bloom.bornAt < bloom.life);
      if (
        lastPoint
        && stationarySince > 0
        && !sproutedForStop
        && now - stationarySince > 560
      ) {
        sproutCluster(lastPoint.x, lastPoint.y, now);
        sproutedForStop = true;
      }
      blooms.forEach((bloom) => drawBloom(bloom, now));
      if (!reducedMotion || blooms.length > 0) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const start = () => {
      if (!animationFrame && visible) animationFrame = window.requestAnimationFrame(render);
    };

    const onMotionChange = () => {
      reducedMotion = reducedMotionQuery.matches;
      blooms = [];
      start();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      start();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) start();
      else if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    });

    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    reducedMotionQuery.addEventListener("change", onMotionChange);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);
    resize();
    start();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", onMotionChange);
      window.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas aria-hidden="true" className="grass-bloom-field" ref={canvasRef} />;
}
