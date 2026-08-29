import { useEffect } from "react";

const REVEAL_TRAVEL_PX = 28;
const SPRING_STIFFNESS = 170;
const SPRING_DAMPING = 24;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

interface RevealMotion {
  element: HTMLElement;
  progress: number;
  velocity: number;
}

function revealTarget(element: HTMLElement, progress: number) {
  const viewportHeight = window.innerHeight;
  const currentOffset = (1 - progress) * REVEAL_TRAVEL_PX;
  const rect = element.getBoundingClientRect();
  const top = rect.top - currentOffset;
  const bottom = rect.bottom - currentOffset;

  // Arrive gradually from the lower edge, and soften away again after the
  // complete object has left through the top. This keeps return visits alive.
  const entering = (viewportHeight * 0.94 - top) / (viewportHeight * 0.44);
  const leaving = (bottom - viewportHeight * 0.06) / (viewportHeight * 0.34);
  return clamp(Math.min(entering, leaving));
}

function paintReveal({ element, progress }: RevealMotion) {
  const shadowProgress = clamp(progress * 1.7);
  element.style.setProperty("--view-reveal-y", `${(1 - progress) * REVEAL_TRAVEL_PX}px`);
  element.style.setProperty("--view-reveal-shadow-y", `${14 * shadowProgress}px`);
  element.style.setProperty("--view-reveal-shadow-blur", `${30 * shadowProgress}px`);
  element.style.setProperty("--view-reveal-shadow-alpha", `${0.12 * shadowProgress}`);
  element.dataset.viewState = progress > 0.995 ? "visible" : "moving";
}

export function useViewportReveal(reducedMotion: boolean) {
  useEffect(() => {
    const motions: RevealMotion[] = Array.from(
      document.querySelectorAll<HTMLElement>("[data-view-reveal]"),
      (element) => ({ element, progress: reducedMotion ? 1 : 0, velocity: 0 }),
    );

    if (reducedMotion) {
      motions.forEach(paintReveal);
      return undefined;
    }

    let frame = 0;
    let previousTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 1 / 30);
      previousTime = time;
      let settled = true;

      motions.forEach((motion) => {
        const target = revealTarget(motion.element, motion.progress);
        const acceleration = (target - motion.progress) * SPRING_STIFFNESS
          - motion.velocity * SPRING_DAMPING;

        motion.velocity += acceleration * delta;
        motion.progress += motion.velocity * delta;

        if (Math.abs(target - motion.progress) < 0.001 && Math.abs(motion.velocity) < 0.001) {
          motion.progress = target;
          motion.velocity = 0;
        } else {
          settled = false;
        }

        paintReveal(motion);
      });

      frame = settled ? 0 : window.requestAnimationFrame(animate);
    };

    const wake = () => {
      if (frame) return;
      previousTime = performance.now();
      frame = window.requestAnimationFrame(animate);
    };

    motions.forEach(paintReveal);
    window.addEventListener("resize", wake, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    wake();

    return () => {
      window.removeEventListener("resize", wake);
      window.removeEventListener("scroll", wake);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);
}
