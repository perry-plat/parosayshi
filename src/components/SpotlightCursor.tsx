import { useEffect, useRef } from "react";

interface SpotlightCursorProps {
  reducedMotion: boolean;
}

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "[draggable='true']",
  "[data-cursor-interactive]",
].join(",");

const NATIVE_CURSOR_SELECTOR = [
  "input",
  "textarea",
  "select",
  "[contenteditable='true']",
  "[data-cursor-native]",
].join(",");

export function SpotlightCursor({ reducedMotion }: SpotlightCursorProps) {
  const haloRef = useRef<HTMLDivElement>(null);
  const pointRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const halo = haloRef.current;
    const point = pointRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!halo || !point || reducedMotion || !finePointer.matches) return;

    document.body.classList.add("spotlight-cursor-enabled");

    const setVisible = (visible: boolean) => {
      halo.dataset.visible = visible ? "true" : "false";
      point.dataset.visible = visible ? "true" : "false";
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      const transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      halo.style.transform = transform;
      point.style.transform = transform;

      const target = event.target instanceof Element ? event.target : null;
      const usesNativeCursor = Boolean(target?.closest(NATIVE_CURSOR_SELECTOR));
      const keepsCustomCursor = Boolean(target?.closest("[data-cursor-keep]"));
      const interactiveTarget = target?.closest(INTERACTIVE_SELECTOR);
      const isInactive = interactiveTarget instanceof HTMLButtonElement
        ? interactiveTarget.disabled || interactiveTarget.dataset.inactive === "true"
        : interactiveTarget?.getAttribute("aria-disabled") === "true"
          || interactiveTarget?.getAttribute("data-inactive") === "true";
      const isInteractive = !usesNativeCursor
        && !keepsCustomCursor
        && Boolean(interactiveTarget)
        && !isInactive;

      halo.dataset.interactive = isInteractive ? "true" : "false";
      point.dataset.interactive = isInteractive ? "true" : "false";
      halo.dataset.native = usesNativeCursor ? "true" : "false";
      point.dataset.native = usesNativeCursor ? "true" : "false";
      document.body.dataset.spotlightCursorNative = usesNativeCursor ? "true" : "false";
      setVisible(true);
    };

    const handlePointerDown = () => {
      halo.dataset.pressed = "true";
      point.dataset.pressed = "true";
    };
    const handlePointerUp = () => {
      halo.dataset.pressed = "false";
      point.dataset.pressed = "false";
    };
    const handlePointerLeave = () => {
      setVisible(false);
    };
    const handlePointerEnter = () => setVisible(true);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    document.documentElement.addEventListener("pointerenter", handlePointerEnter);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      document.documentElement.removeEventListener("pointerenter", handlePointerEnter);
      document.body.classList.remove("spotlight-cursor-enabled");
      delete document.body.dataset.spotlightCursorNative;
    };
  }, [reducedMotion]);

  return (
    <>
      <div aria-hidden="true" className="spotlight-cursor__halo" data-visible="false" ref={haloRef}>
        <span className="spotlight-cursor__grain" />
        <svg className="spotlight-cursor__link" viewBox="0 0 40 40">
          <g className="spotlight-cursor__click-lines">
            <path pathLength="1" d="M4.4 -3V-9.5" />
            <path pathLength="1" d="M9.3 -0.8 13.9 -5.4" />
            <path pathLength="1" d="M12.5 4H19" />
            <path pathLength="1" d="M9.3 8.8 13.9 13.4" />
            <path pathLength="1" d="M4.4 11V17.5" />
            <path pathLength="1" d="M-0.5 8.8 -5.1 13.4" />
            <path pathLength="1" d="M-3.7 4H-10.2" />
            <path pathLength="1" d="M-0.5 -0.8 -5.1 -5.4" />
          </g>
          <path
            className="spotlight-cursor__arrow"
            d="M4.5 3.7 20.1 9c0.88 0.3 0.95 1.52 0.1 1.86l-5.05 1.95 5.23 5.22c0.43 0.43 0.43 1.12 0 1.55l-1.18 1.18c-0.43 0.43-1.12 0.43-1.55 0l-5.2-5.2-1.95 5.08c-0.34 0.88-1.58 0.8-1.87-0.1L3.22 4.98c-0.3-0.9 0.38-1.58 1.28-1.28Z"
          />
        </svg>
      </div>
      <div aria-hidden="true" className="spotlight-cursor__point" data-visible="false" ref={pointRef} />
    </>
  );
}
