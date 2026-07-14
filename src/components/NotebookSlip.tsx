import { forwardRef } from "react";
import { motion } from "motion/react";
import type { SlipState } from "../hooks/useSlip";
import { Sketchbook } from "./Sketchbook";

interface NotebookSlipProps {
  reducedMotion: boolean;
  slipState: SlipState;
  onCloseAnimationComplete: () => void;
}

export const NotebookSlip = forwardRef<HTMLElement, NotebookSlipProps>(function NotebookSlip(
  { reducedMotion, slipState, onCloseAnimationComplete },
  ref,
) {
  const isClosing = slipState === "closing";
  const airborne = {
    opacity: 0,
    rotate: -4.2,
    scale: 0.985,
    y: "-120vh",
  };
  const landed = {
    opacity: 1,
    rotate: 0,
    scale: 1,
    y: "0vh",
  };

  return (
    <motion.aside
      ref={ref}
      className={`project-slip notebook-slip is-${slipState}`}
      role="dialog"
      aria-modal="true"
      aria-label="Things that stayed in the notebook"
      tabIndex={-1}
      data-edition="field-note"
      initial={reducedMotion ? false : airborne}
      animate={reducedMotion ? landed : isClosing ? airborne : landed}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: isClosing ? 175 : 150,
              damping: isClosing ? 25 : 22,
              mass: isClosing ? 0.82 : 0.9,
            }
      }
      onAnimationComplete={() => {
        if (isClosing) onCloseAnimationComplete();
      }}
    >
      <Sketchbook variant="expanded" />
    </motion.aside>
  );
});
