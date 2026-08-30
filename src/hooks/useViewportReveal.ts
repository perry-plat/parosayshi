import { useEffect } from "react";
import { animate, inView, type AnimationPlaybackControls } from "motion";

const HIDDEN_Y = "18px";
const VISIBLE_Y = "0px";
const HIDDEN_PIN_ROTATION = "0.7deg";
const VISIBLE_PIN_ROTATION = "0deg";
const VIEWPORT_SPRING = {
  damping: 24,
  mass: 0.85,
  stiffness: 115,
  type: "spring" as const,
};

function entranceDelay(element: HTMLElement) {
  if (element.dataset.viewReveal !== "project") return 0;
  return element.getBoundingClientRect().left >= window.innerWidth / 2 ? 0.055 : 0;
}

function revealRotation(element: HTMLElement, visible: boolean) {
  if (element.dataset.viewReveal !== "pinned") return VISIBLE_PIN_ROTATION;
  return visible ? VISIBLE_PIN_ROTATION : HIDDEN_PIN_ROTATION;
}

export function useViewportReveal(reducedMotion: boolean) {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-view-reveal]"),
    );

    if (reducedMotion) {
      elements.forEach((element) => {
        element.style.setProperty("--view-reveal-rotate", VISIBLE_PIN_ROTATION);
        element.style.setProperty("--view-reveal-y", VISIBLE_Y);
      });
      return undefined;
    }

    const animations = new Map<HTMLElement, AnimationPlaybackControls>();
    const moveTo = (element: HTMLElement, y: string, visible: boolean) => {
      animations.get(element)?.stop();
      animations.set(element, animate(
        element,
        {
          "--view-reveal-rotate": revealRotation(element, visible),
          "--view-reveal-y": y,
        },
        {
          ...VIEWPORT_SPRING,
          delay: visible ? entranceDelay(element) : 0,
        },
      ));
    };

    elements.forEach((element) => {
      element.style.setProperty("--view-reveal-y", HIDDEN_Y);
      element.style.setProperty("--view-reveal-rotate", revealRotation(element, false));
    });

    const stopObserving = inView(
      elements,
      (element) => {
        const htmlElement = element as HTMLElement;
        moveTo(htmlElement, VISIBLE_Y, true);
        return () => moveTo(htmlElement, HIDDEN_Y, false);
      },
      { amount: 0.16, margin: "0px 0px -5% 0px" },
    );

    return () => {
      stopObserving();
      animations.forEach((animation) => animation.stop());
    };
  }, [reducedMotion]);
}
