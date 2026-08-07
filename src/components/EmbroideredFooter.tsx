import { useCallback, useEffect, useRef, useState } from "react";
import { BeybladeBattle } from "./BeybladeBattle";
import { EmbroideryRenderer } from "./embroidery/engine";
import "../styles/embroidered-footer.css";

interface EmbroideredFooterProps {
  reducedMotion: boolean;
}

const FOOTER_VISIBILITY_EVENT = "parosayshi:footer-visibility";
const PATCH_FONT = '"Geist Mono", "Arial Black", sans-serif';
const RESUME_URL =
  "https://drive.google.com/file/d/1t2szuLpJstQ-ktsZ5rvWYJ8svIZWmhT2/view?usp=sharing";

export function EmbroideredFooter({
  reducedMotion,
}: EmbroideredFooterProps) {
  const [battleEnabled, setBattleEnabled] = useState(false);
  const inRangeRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleBattleToggle = useCallback(() => {
    setBattleEnabled((enabled) => !enabled);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const renderer = new EmbroideryRenderer(
      stage,
      PATCH_FONT,
      reducedMotion,
    );

    const updateActivity = () => {
      const shouldRun =
        inRangeRef.current &&
        document.visibilityState === "visible";
      if (shouldRun) renderer.start();
      else renderer.stop();
    };

    const reportVisibility = (visible: boolean) => {
      document.dispatchEvent(
        new CustomEvent<boolean>(FOOTER_VISIBILITY_EVENT, {
          detail: visible,
        }),
      );
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inRangeRef.current = Boolean(entry?.isIntersecting);
        stage.dataset.inView = inRangeRef.current ? "true" : "false";
        reportVisibility(inRangeRef.current);
        updateActivity();
      },
      {
        rootMargin: "700px 0px",
        threshold: 0.01,
      },
    );

    const resizeObserver = new ResizeObserver(() => renderer.resize());
    const onVisibilityChange = () => updateActivity();

    intersectionObserver.observe(stage);
    resizeObserver.observe(stage);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      reportVisibility(false);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      renderer.destroy();
      inRangeRef.current = false;
    };
  }, [reducedMotion]);

  return (
    <footer
      aria-labelledby="embroidered-footer-title"
      className="embroidered-footer"
      data-battle-enabled={battleEnabled ? "true" : "false"}
    >
      <div
        ref={stageRef}
        aria-hidden="true"
        className="embroidered-footer__stage"
      />

      {battleEnabled && (
        <BeybladeBattle
          reducedMotion={reducedMotion}
        />
      )}

      <div className="embroidered-footer__content">
        <h2
          className="embroidered-footer__sr-only"
          id="embroidered-footer-title"
        >
          Intentmaxing is the solulu
        </h2>

        <div className="embroidered-footer__closing">
          <p>THE LIBRARY WILL KEEP CHANGING.</p>

          <button
            className="embroidered-footer__battle-toggle"
            type="button"
            role="switch"
            aria-checked={battleEnabled}
            onClick={handleBattleToggle}
          >
            <span aria-hidden="true">
              <i />
            </span>
            BATTLE MODE
          </button>

          <nav aria-label="Footer links">
            <a href="mailto:hello@parosayshi.com">EMAIL</a>
            <a href={RESUME_URL} rel="noopener noreferrer" target="_blank">
              RESUME
            </a>
          </nav>

          <span>© 2026 PAROSAYSHI</span>
        </div>
      </div>
    </footer>
  );
}
