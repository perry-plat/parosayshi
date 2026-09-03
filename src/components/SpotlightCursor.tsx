import { useEffect } from "react";

interface SpotlightCursorProps {
  reducedMotion: boolean;
}

/** Browser-native cursor positioning avoids the latency of a DOM follower on
 * top of the animated WebGL wall and the project viewer's backdrop blur. */
export function SpotlightCursor({ reducedMotion }: SpotlightCursorProps) {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reducedMotion || !finePointer.matches) return undefined;

    document.body.classList.add("spotlight-cursor-enabled");
    return () => {
      document.body.classList.remove("spotlight-cursor-enabled");
    };
  }, [reducedMotion]);

  return null;
}
