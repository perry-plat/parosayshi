import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { XIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import type { SlipEntryTransform, SlipState } from "../hooks/useSlip";

export type CaseStudySurface = "paper" | "frost";

export interface CaseStudyEntryColors {
  deep: string;
  ink: string;
  tint: string;
}

type FolderTransitionPhase =
  | "opening-flap"
  | "sheet-opening"
  | "open"
  | "content-closing"
  | "sheet-closing"
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
  reducedMotion: boolean;
  slipState: SlipState;
  title: string;
}

const FOLDER_EASE = [0.22, 1, 0.36, 1] as const;
const FOLDER_CLOSING_PHASES: FolderTransitionPhase[] = [
  "content-closing",
  "sheet-closing",
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
      reducedMotion,
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
    const finishedClose = useRef(false);
    const finishedOpen = useRef(false);
    const isClosing = slipState === "closing";
    useEffect(() => {
      if (isClosing) finishedOpen.current = false;
      else finishedClose.current = false;
    }, [isClosing]);

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
      const timeout = window.setTimeout(() => {
        if (folderPhase === "opening-flap") {
          setFolderPhase("sheet-opening");
        } else if (!finishedClose.current) {
          finishedClose.current = true;
          onCloseAnimationComplete();
        }
      }, 220);
      return () => window.clearTimeout(timeout);
    }, [folderPhase, onCloseAnimationComplete, opensFromFolder, reducedMotion]);

    useEffect(() => {
      if (!reducedMotion || isClosing || finishedOpen.current) return;
      const frame = window.requestAnimationFrame(() => {
        if (finishedOpen.current) return;
        finishedOpen.current = true;
        onOpenAnimationComplete?.();
      });
      return () => window.cancelAnimationFrame(frame);
    }, [isClosing, onOpenAnimationComplete, reducedMotion]);

    const sheetTransition = reducedMotion
      ? { duration: 0 }
      : opensFromFolder
        ? folderPhase === "sheet-opening"
          ? {
            y: { type: "spring" as const, stiffness: 210, damping: 25, mass: 0.9 },
            opacity: { duration: 0.16 },
          }
          : folderPhase === "sheet-closing"
            ? {
              y: { duration: 0.36, ease: FOLDER_EASE },
              opacity: { duration: 0.2, ease: FOLDER_EASE },
            }
            : { duration: 0 }
        : {
          y: { type: "spring" as const, stiffness: 170, damping: 27, mass: 0.92 },
          opacity: { duration: isClosing ? 0.18 : 0.14 },
        };

    const sheetAnimation = opensFromFolder
      ? ["opening-flap", "sheet-closing", "closing-flap"].includes(folderPhase)
        ? { opacity: 0, y: "105%" }
        : { opacity: 1, y: "0%" }
      : isClosing
          ? { opacity: 0.98, y: "105%" }
          : { opacity: 1, y: "0%" };

    const sheetInitial = reducedMotion
      ? false
      : opensFromFolder
        ? { opacity: 0, y: "105%" }
        : { opacity: 0.96, y: "105%" };

    const readerContentVisible = !opensFromFolder
      ? !isClosing
      : folderPhase === "sheet-opening" || folderPhase === "open";
    const readerContentAnimation = {
      opacity: readerContentVisible ? 1 : 0,
      y: readerContentVisible ? 0 : 12,
    };
    const readerContentTransition = reducedMotion
      ? { duration: 0 }
      : {
        duration: folderPhase === "content-closing" ? 0.13 : 0.2,
        ease: FOLDER_EASE,
      };

    const sheetStyle = {
      "--entry-folder-deep": entryColors?.deep || "#872619",
      "--entry-folder-ink": entryColors?.ink || "#fff0cf",
      "--entry-folder-tint": entryColors?.tint || "#cf482d",
    } as CSSProperties;

    return (
      <>
        <motion.div
          animate={{
            backgroundColor: opensFromFolder ? "rgba(31, 14, 9, 0.09)" : "rgba(31, 14, 9, 0)",
            opacity: opensFromFolder && folderPhase === "closing-flap" ? 0 : isClosing && !opensFromFolder ? 0 : 1,
          }}
          aria-hidden="true"
          className="case-study-bottom-sheet-backdrop"
          initial={reducedMotion ? false : { opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.24 }}
        />
        <motion.aside
          animate={sheetAnimation}
          aria-label={ariaLabel}
          aria-modal="true"
          className={`project-slip case-study-bottom-sheet is-${slipState}`}
          data-entry-shape={entryShape}
          data-folder-phase={opensFromFolder ? folderPhase : undefined}
          data-surface={surface}
          initial={sheetInitial}
          onAnimationComplete={() => {
            if (opensFromFolder && !reducedMotion) {
              switch (folderPhase) {
                case "sheet-opening":
                  setFolderPhase("open");
                  if (!finishedOpen.current) {
                    finishedOpen.current = true;
                    onOpenAnimationComplete?.();
                  }
                  break;
                case "sheet-closing":
                  setFolderPhase("closing-flap");
                  break;
                default:
                  break;
              }
            } else if (!opensFromFolder && isClosing && !finishedClose.current) {
              finishedClose.current = true;
              onCloseAnimationComplete();
            } else if (!opensFromFolder && !isClosing && !finishedOpen.current) {
              finishedOpen.current = true;
              onOpenAnimationComplete?.();
            }
          }}
          onKeyDown={trapDialogFocus}
          ref={ref}
          role="dialog"
          style={sheetStyle}
          tabIndex={-1}
          transition={sheetTransition}
        >
          <motion.header
            animate={readerContentAnimation}
            className="case-study-bottom-sheet-toolbar"
            initial={opensFromFolder && !reducedMotion ? { opacity: 0, y: 12 } : false}
            transition={readerContentTransition}
          >
            <div className="case-study-bottom-sheet-title">
              <strong>{title}</strong>
            </div>

            <div className="case-study-bottom-sheet-controls">
              {/* Surface and chapter controls are intentionally parked. */}
              <button className="case-study-bottom-sheet-close" onClick={onClose} type="button" aria-label="Close case study">
                <XIcon aria-hidden="true" size={24} weight="regular" />
              </button>
            </div>
          </motion.header>

          <motion.div
            animate={readerContentAnimation}
            className="case-study-bottom-sheet-viewport"
            initial={opensFromFolder && !reducedMotion ? { opacity: 0, y: 12 } : false}
            onAnimationComplete={() => {
              if (opensFromFolder && folderPhase === "content-closing") {
                setFolderPhase("sheet-closing");
              }
            }}
            transition={reducedMotion
              ? { duration: 0 }
              : { ...readerContentTransition, delay: folderPhase === "sheet-opening" ? 0.06 : 0 }}
          >
            {children}
          </motion.div>
        </motion.aside>
      </>
    );
  },
);
