import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import type { SlipEntryTransform, SlipState } from "../hooks/useSlip";

export type CaseStudySurface = "paper" | "frost";
export type ReaderScrollIntent = "top" | "up" | "down";

export interface CaseStudyEntryColors {
  deep: string;
  ink: string;
  tint: string;
}

type FolderTransitionPhase =
  | "opening-flap"
  | "board-opening"
  | "open"
  | "content-closing"
  | "board-closing"
  | "closing-flap";

interface CaseStudyBottomSheetProps {
  ariaLabel: string;
  children: ReactNode;
  entryColors?: CaseStudyEntryColors;
  entryShape?: "folder";
  entryTransform?: SlipEntryTransform;
  onClose: () => void;
  onCloseAnimationComplete: () => void;
  onOpenAnimationComplete?: () => void;
  progress: number;
  reducedMotion: boolean;
  scrollIntent: ReaderScrollIntent;
  slipState: SlipState;
  title: string;
}

const FOLDER_EASE = [0.22, 1, 0.36, 1] as const;
const FOLDER_EXIT_EASE = [0.4, 0, 1, 1] as const;
const FOLDER_OPEN_CUE_MS = 180;
const FOLDER_CONTENT_PREPARE_MS = 150;
const FOLDER_CONTENT_REVEAL_MS = 310;
const FOLDER_CLOSE_OVERLAP_MS = 20;
const FOLDER_RETURN_SETTLE_MS = 0;
const FOLDER_CLOSING_PHASES: FolderTransitionPhase[] = [
  "content-closing",
  "board-closing",
  "closing-flap",
];
function trapDialogFocus(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== "Tab") return;
  const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )).filter((element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true");
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/*
 * Surface switching is intentionally parked for now. The reader always opens
 * on paper, but this component is kept here so the experiment can be restored
 * without rebuilding it.
function SurfaceSwitcher({
  surface,
  onChange,
}: {
  surface: CaseStudySurface;
  onChange: (surface: CaseStudySurface) => void;
}) {
  return (
    <div className="case-study-surface-switcher" role="group" aria-label="Reader surface">
      <button
        aria-label="Use paper surface"
        aria-pressed={surface === "paper"}
        onClick={() => onChange("paper")}
        type="button"
      >
        PAPER
      </button>
      <button
        aria-label="Use frost surface"
        aria-pressed={surface === "frost"}
        onClick={() => onChange("frost")}
        type="button"
      >
        FROST
      </button>
    </div>
  );
}
*/

export const CaseStudyBottomSheet = forwardRef<HTMLElement, CaseStudyBottomSheetProps>(
  function CaseStudyBottomSheet(
    {
      ariaLabel,
      children,
      entryColors,
      entryShape,
      onClose,
      onCloseAnimationComplete,
      onOpenAnimationComplete,
      progress,
      reducedMotion,
      scrollIntent,
      slipState,
      title,
    },
    ref,
  ) {
    const surface: CaseStudySurface = "paper";
    const opensFromFolder = entryShape === "folder";
    const [folderPhase, setFolderPhase] = useState<FolderTransitionPhase>(() =>
      opensFromFolder && !reducedMotion ? "opening-flap" : "open",
    );
    const [readerVisible, setReaderVisible] = useState(
      () => !opensFromFolder || reducedMotion,
    );
    const [readerPrepared, setReaderPrepared] = useState(
      () => !opensFromFolder || reducedMotion,
    );
    const finishedClose = useRef(false);
    const finishedOpen = useRef(false);
    const controlsTimer = useRef<number | null>(null);
    const [controlsVisible, setControlsVisible] = useState(true);
    const isClosing = slipState === "closing";

    const clearControlsTimer = useCallback(() => {
      if (controlsTimer.current !== null) window.clearTimeout(controlsTimer.current);
      controlsTimer.current = null;
    }, []);

    const showControls = useCallback((autoHide = true) => {
      setControlsVisible(true);
      clearControlsTimer();
      if (!autoHide) return;
      controlsTimer.current = window.setTimeout(() => {
        setControlsVisible(false);
        controlsTimer.current = null;
      }, 5000);
    }, [clearControlsTimer]);

    const revealControls = useCallback(
      () => showControls(scrollIntent !== "top"),
      [scrollIntent, showControls],
    );

    useEffect(() => {
      showControls(false);
      return clearControlsTimer;
    }, [clearControlsTimer, showControls]);

    useEffect(() => {
      if (isClosing) finishedOpen.current = false;
      else finishedClose.current = false;
    }, [isClosing]);

    useEffect(() => {
      if (isClosing) return;
      const closeFromOutside = (event: PointerEvent) => {
        if (!(event.target instanceof Element)) return;
        if (event.target.closest(".case-study-bottom-sheet")) return;
        onClose();
      };
      document.addEventListener("pointerdown", closeFromOutside, true);
      return () => document.removeEventListener("pointerdown", closeFromOutside, true);
    }, [isClosing, onClose]);

    useEffect(() => {
      if (!opensFromFolder || !isClosing || FOLDER_CLOSING_PHASES.includes(folderPhase)) return;
      setFolderPhase(folderPhase === "opening-flap" ? "closing-flap" : "content-closing");
    }, [folderPhase, isClosing, opensFromFolder]);

    useEffect(() => {
      if (!opensFromFolder || reducedMotion) return;
      document.body.dataset.folderMotion = folderPhase;
    }, [folderPhase, opensFromFolder, reducedMotion]);

    useEffect(() => {
      if (!opensFromFolder || reducedMotion) return;
      return () => {
        delete document.body.dataset.folderMotion;
      };
    }, [opensFromFolder, reducedMotion]);

    useEffect(() => {
      if (!opensFromFolder || reducedMotion) return;
      if (folderPhase !== "opening-flap" && folderPhase !== "closing-flap") return;
      const phaseDelay = folderPhase === "opening-flap"
        ? FOLDER_OPEN_CUE_MS
        : FOLDER_RETURN_SETTLE_MS;
      const timeout = window.setTimeout(() => {
        if (folderPhase === "opening-flap") {
          setFolderPhase("board-opening");
        } else if (!finishedClose.current) {
          finishedClose.current = true;
          onCloseAnimationComplete();
        }
      }, phaseDelay);
      return () => window.clearTimeout(timeout);
    }, [folderPhase, onCloseAnimationComplete, opensFromFolder, reducedMotion]);

    useEffect(() => {
      if (!opensFromFolder || reducedMotion || folderPhase !== "content-closing") return;
      const timeout = window.setTimeout(
        () => setFolderPhase("board-closing"),
        FOLDER_CLOSE_OVERLAP_MS,
      );
      return () => window.clearTimeout(timeout);
    }, [folderPhase, opensFromFolder, reducedMotion]);

    useEffect(() => {
      if (!opensFromFolder) {
        setReaderPrepared(true);
        setReaderVisible(!isClosing);
        return;
      }
      if (reducedMotion) {
        setReaderPrepared(true);
        setReaderVisible(!isClosing);
        return;
      }
      if (isClosing || FOLDER_CLOSING_PHASES.includes(folderPhase)) {
        setReaderVisible(false);
        return;
      }
      if (folderPhase === "open") {
        setReaderPrepared(true);
        setReaderVisible(true);
        return;
      }
      if (folderPhase !== "board-opening") return;
      const prepareTimeout = window.setTimeout(
        () => setReaderPrepared(true),
        FOLDER_CONTENT_PREPARE_MS,
      );
      const revealTimeout = window.setTimeout(
        () => setReaderVisible(true),
        FOLDER_CONTENT_REVEAL_MS,
      );
      return () => {
        window.clearTimeout(prepareTimeout);
        window.clearTimeout(revealTimeout);
      };
    }, [folderPhase, isClosing, opensFromFolder, reducedMotion]);

    useEffect(() => {
      if (!reducedMotion || isClosing || finishedOpen.current) return;
      const frame = window.requestAnimationFrame(() => {
        if (finishedOpen.current) return;
        finishedOpen.current = true;
        onOpenAnimationComplete?.();
      });
      return () => window.cancelAnimationFrame(frame);
    }, [isClosing, onOpenAnimationComplete, reducedMotion]);

    useEffect(() => {
      if (!reducedMotion || !isClosing || finishedClose.current) return;
      const frame = window.requestAnimationFrame(() => {
        if (finishedClose.current) return;
        finishedClose.current = true;
        onCloseAnimationComplete();
      });
      return () => window.cancelAnimationFrame(frame);
    }, [isClosing, onCloseAnimationComplete, reducedMotion]);

    const sheetTransition = reducedMotion
      ? { duration: 0 }
      : folderPhase === "board-opening"
        ? {
          y: {
            type: "spring" as const,
            visualDuration: 0.82,
            bounce: 0.06,
          },
          opacity: { duration: 0.1, ease: FOLDER_EASE },
        }
        : folderPhase === "board-closing"
          ? {
            y: { duration: 0.34, ease: FOLDER_EXIT_EASE },
            opacity: { duration: 0 },
          }
          : opensFromFolder
            ? { duration: 0 }
            : {
              y: { type: "spring" as const, stiffness: 170, damping: 27, mass: 0.92 },
              opacity: { duration: isClosing ? 0.18 : 0.14 },
            };

    const sheetAnimation = opensFromFolder
      ? ["opening-flap", "closing-flap"].includes(folderPhase)
        ? { opacity: 0, y: "100%" }
        : folderPhase === "board-closing"
          ? { opacity: 1, y: "100%" }
          : folderPhase === "board-opening"
            ? { opacity: 1, y: "0%" }
            : { opacity: 1, y: "0%" }
      : isClosing
        ? { opacity: 0.98, y: "100%" }
        : { opacity: 1, y: "0%" };

    const sheetInitial = reducedMotion
      ? false
      : opensFromFolder
        ? { opacity: 0, y: "100%" }
        : { opacity: 0.96, y: "100%" };

    const contentVisible = readerVisible;
    const contentAnimation = {
      opacity: contentVisible ? 1 : 0,
      y: contentVisible ? 0 : 12,
    };
    const contentTransition = reducedMotion
      ? { duration: 0 }
      : contentVisible
        ? {
          opacity: { duration: 0.24, ease: FOLDER_EASE },
          y: {
            type: "spring" as const,
            visualDuration: 0.36,
            bounce: 0.14,
          },
        }
        : {
          duration: 0.08,
          ease: FOLDER_EXIT_EASE,
        };

    useEffect(() => {
      if (!contentVisible) return;
      if (scrollIntent === "top") {
        showControls(false);
      } else if (scrollIntent === "up") {
        showControls(true);
      } else {
        clearControlsTimer();
        setControlsVisible(false);
      }
    }, [clearControlsTimer, contentVisible, scrollIntent, showControls]);

    const progressPercent = Math.round(Math.max(0, Math.min(1, progress)) * 100);
    const headerControlsVisible = contentVisible && controlsVisible;
    const closeControlVisible = contentVisible;
    const titleControlTransition = reducedMotion
      ? { duration: 0 }
      : headerControlsVisible
        ? {
          type: "spring" as const,
          stiffness: 430,
          damping: 27,
          mass: 0.65,
          delay: 0.03,
        }
        : { duration: 0.26, ease: [0.4, 0, 1, 1] as const };
    const closeControlTransition = reducedMotion
      ? { duration: 0 }
      : closeControlVisible
        ? {
          type: "spring" as const,
          stiffness: 520,
          damping: 24,
          mass: 0.55,
          delay: 0.05,
        }
        : { duration: 0.22, ease: [0.4, 0, 1, 1] as const };
    const sheetStyle = {
      "--entry-folder-deep": entryColors?.deep || "#872619",
      "--entry-folder-ink": entryColors?.ink || "#fff0cf",
      "--entry-folder-tint": entryColors?.tint || "#cf482d",
      "--reader-progress": `${progressPercent}%`,
    } as CSSProperties;

    return (
      <>
        <motion.div
          animate={{
            backgroundColor: opensFromFolder ? "rgba(17, 17, 16, 0.36)" : "rgba(17, 17, 16, 0.32)",
            opacity: opensFromFolder && folderPhase === "closing-flap" ? 0 : isClosing && !opensFromFolder ? 0 : 1,
          }}
          aria-hidden="true"
          className="case-study-bottom-sheet-backdrop"
          initial={reducedMotion ? false : { opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.18 }}
        />
        <motion.aside
          animate={sheetAnimation}
          aria-label={ariaLabel}
          aria-modal="true"
          className={`project-slip case-study-bottom-sheet is-${slipState}`}
          data-entry-shape={entryShape}
          data-folder-phase={opensFromFolder ? folderPhase : undefined}
          data-reader-prepared={readerPrepared || undefined}
          data-reader-visible={contentVisible || undefined}
          data-reader-scrolled={progress > 0 || undefined}
          data-surface={surface}
          initial={sheetInitial}
          onAnimationComplete={() => {
            if (opensFromFolder && !reducedMotion) {
              if (folderPhase === "board-opening") {
                setFolderPhase("open");
                if (!finishedOpen.current) {
                  finishedOpen.current = true;
                  onOpenAnimationComplete?.();
                }
              } else if (folderPhase === "board-closing") {
                setFolderPhase("closing-flap");
              }
            } else if (!opensFromFolder && isClosing && !finishedClose.current) {
              finishedClose.current = true;
              onCloseAnimationComplete();
            } else if (!opensFromFolder && !isClosing && !finishedOpen.current) {
              finishedOpen.current = true;
              onOpenAnimationComplete?.();
            }
          }}
          onFocusCapture={revealControls}
          onKeyDown={(event) => {
            revealControls();
            trapDialogFocus(event);
          }}
          onPointerDown={revealControls}
          onPointerMove={revealControls}
          onTouchStart={revealControls}
          ref={ref}
          role="dialog"
          style={sheetStyle}
          tabIndex={-1}
          transition={sheetTransition}
        >
          <motion.div
            animate={headerControlsVisible
              ? { opacity: 1, rotate: 0, scale: 1, x: 0, y: 0 }
              : { opacity: 0, rotate: -2.5, scale: 0.96, x: -14, y: -8 }}
            className="case-study-bottom-sheet-title"
            initial={opensFromFolder && !reducedMotion
              ? { opacity: 0, rotate: -2.5, scale: 0.96, x: -14, y: -8 }
              : false}
            transition={titleControlTransition}
          >
            <strong>{title}</strong>
          </motion.div>

          <motion.button
            animate={closeControlVisible
              ? { opacity: 1, rotate: 0, scale: 1, x: 0, y: 0 }
              : { opacity: 0, rotate: 18, scale: 0.72, x: 10, y: -10 }}
            aria-label="Close case study"
            className="case-study-bottom-sheet-close"
            initial={opensFromFolder && !reducedMotion
              ? { opacity: 0, rotate: 18, scale: 0.72, x: 10, y: -10 }
              : false}
            onClick={onClose}
            style={{ pointerEvents: closeControlVisible ? "auto" : "none" }}
            tabIndex={closeControlVisible ? 0 : -1}
            transition={closeControlTransition}
            type="button"
            whileHover={reducedMotion ? undefined : { rotate: 8, scale: 1.08 }}
            whileTap={reducedMotion ? undefined : { rotate: -8, scale: 0.86 }}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20">
              <path d="M4.5 4.5 15.5 15.5M15.5 4.5 4.5 15.5" />
            </svg>
          </motion.button>

          <motion.div
            animate={contentAnimation}
            aria-label={`${progressPercent}% read`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progressPercent}
            className="case-study-bottom-sheet-progress"
            initial={opensFromFolder && !reducedMotion ? { opacity: 0, y: 14 } : false}
            role="progressbar"
            transition={contentTransition}
          >
            <span />
          </motion.div>

          <motion.div
            animate={contentAnimation}
            className="case-study-bottom-sheet-viewport"
            initial={opensFromFolder && !reducedMotion ? { opacity: 0, y: 14 } : false}
            transition={contentTransition}
          >
            {children}
          </motion.div>
        </motion.aside>
      </>
    );
  },
);
