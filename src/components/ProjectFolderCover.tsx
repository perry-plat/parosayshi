import { motion, type Variants } from "motion/react";
import type { CSSProperties } from "react";
import type {
  ProjectFolderAsset,
  ProjectFolderPresentation,
} from "../data/folderPresentations";

export type ProjectFolderMotionState =
  | "rest"
  | "preview"
  | "committed"
  | "returning";

interface ProjectFolderCoverProps {
  deepTint: string;
  ink: string;
  layoutId?: string;
  motionState: ProjectFolderMotionState;
  number?: string;
  presentation: ProjectFolderPresentation;
  reducedMotion?: boolean;
  tint: string;
}

interface LegacyProjectFolderCoverProps {
  artifacts: [ProjectFolderAsset, ProjectFolderAsset, ProjectFolderAsset];
  deepTint: string;
  ink: string;
  layoutId?: string;
  number?: string;
  owner?: string;
  reducedMotion?: boolean;
  subtitle: string;
  tint: string;
}

const closedTransition = {
  duration: 0.14,
  ease: [0.22, 1, 0.36, 1] as const,
};

const frontVariants: Variants = {
  rest: {
    x: "0%",
    rotateY: 0,
    transition: closedTransition,
  },
  preview: (direction: number) => ({
    x: `${direction * -4}%`,
    rotateY: direction * -7,
    transition: {
      type: "spring",
      visualDuration: 0.18,
      bounce: 0.04,
    },
  }),
  committed: {
    x: "0%",
    rotateY: 0,
    transition: { duration: 0.16, ease: [0.32, 0, 0.67, 0] },
  },
  returning: {
    x: "0%",
    rotateY: 0,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
};

const backBoardVariants: Variants = {
  rest: (direction: number) => ({
    opacity: 0.84,
    rotate: direction * 1.8,
    scale: 0.78,
    x: `${direction * 4}%`,
    y: "-5%",
    transition: closedTransition,
  }),
  preview: (direction: number) => ({
    opacity: 1,
    rotate: direction * 2.2,
    scale: 0.84,
    x: `${direction * 42}%`,
    y: "2%",
    transition: {
      type: "spring",
      visualDuration: 0.26,
      bounce: 0.04,
    },
  }),
  committed: (direction: number) => ({
    opacity: 0.42,
    rotate: direction * 1,
    scale: 0.78,
    x: `${direction * 2}%`,
    y: "-5%",
    transition: { duration: 0.17, ease: [0.32, 0, 0.67, 0], delay: 0.02 },
  }),
  returning: (direction: number) => ({
    opacity: 0.84,
    rotate: direction * 1.8,
    scale: 0.78,
    x: `${direction * 4}%`,
    y: "-5%",
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1], delay: 0.05 },
  }),
};

const frontBoardVariants: Variants = {
  rest: (direction: number) => ({
    opacity: 0.92,
    rotate: direction * -1.5,
    scale: 0.88,
    x: `${direction * 3}%`,
    y: "-1%",
    transition: closedTransition,
  }),
  preview: (direction: number) => ({
    opacity: 1,
    rotate: direction * -1.4,
    scale: 0.92,
    x: `${direction * 22}%`,
    y: "-13%",
    transition: {
      type: "spring",
      visualDuration: 0.24,
      bounce: 0.04,
    },
  }),
  committed: (direction: number) => ({
    opacity: 0.5,
    rotate: direction * -0.8,
    scale: 0.86,
    x: `${direction * 2}%`,
    y: "-1%",
    transition: { duration: 0.18, ease: [0.32, 0, 0.67, 0] },
  }),
  returning: (direction: number) => ({
    opacity: 0.92,
    rotate: direction * -1.5,
    scale: 0.88,
    x: `${direction * 3}%`,
    y: "-1%",
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  }),
};

const boardVariants = [backBoardVariants, frontBoardVariants] as const;

export function ProjectFolderCover({
  deepTint,
  ink,
  layoutId,
  motionState,
  number,
  presentation,
  reducedMotion = false,
  tint,
}: ProjectFolderCoverProps) {
  const style = {
    "--project-folder-deep": deepTint,
    "--project-folder-ink": ink,
    "--project-folder-tint": tint,
  } as CSSProperties;
  const direction = presentation.revealDirection === "right" ? 1 : -1;
  const state = reducedMotion ? "rest" : motionState;

  return (
    <motion.span
      aria-hidden="true"
      className="project-folder-cover project-folder-v2"
      data-motion-state={state}
      data-reveal-direction={presentation.revealDirection}
      layoutId={reducedMotion ? undefined : layoutId}
      style={style}
      transition={reducedMotion
        ? { duration: 0 }
        : { layout: { type: "spring", stiffness: 150, damping: 25, mass: 0.9 } }}
    >
      <span className="project-folder-v2__assembly">
        <span className="project-folder-v2__rear">
          <span className="project-folder-v2__archive-mark">
            ARCHIVE {number || "01"}
          </span>
        </span>

        {presentation.boards.map((board, boardIndex) => (
          <motion.span
            animate={state}
            className={`project-folder-v2__board project-folder-v2__board--${boardIndex + 1}`}
            custom={direction}
            initial={false}
            key={board.label}
            variants={boardVariants[boardIndex]}
          >
            <span
              className="project-folder-v2__board-mosaic"
              data-tile-count={board.assets.length}
            >
              {board.assets.map((asset, assetIndex) => (
                <span
                  className={`project-folder-v2__board-tile project-folder-v2__board-tile--${assetIndex + 1}`}
                  key={`${asset.src}-${asset.position || "center"}-${assetIndex}`}
                >
                  <img
                    alt=""
                    decoding="async"
                    draggable={false}
                    loading="lazy"
                    src={asset.src}
                    style={{ objectPosition: asset.position || "center" }}
                  />
                </span>
              ))}
            </span>
            <span className="project-folder-v2__board-caption">
              <strong>{board.label}</strong>
              <small>PROJECT BOARD / {String(boardIndex + 1).padStart(2, "0")}</small>
            </span>
          </motion.span>
        ))}

        <motion.span
          animate={state}
          className="project-folder-v2__front"
          custom={direction}
          initial={false}
          variants={frontVariants}
        >
          <span className="project-folder-v2__edge-mark" />
          <span className="project-folder-v2__metadata">
            <strong>{presentation.owner}</strong>
            <span>02 PROJECT BOARDS</span>
            <small>{presentation.subtitle}</small>
            {number ? <b>{number.padStart(2, "0")}</b> : null}
          </span>
        </motion.span>
      </span>
    </motion.span>
  );
}

export function LegacyProjectFolderCover({
  artifacts,
  deepTint,
  ink,
  layoutId,
  number,
  owner = "PAROSAYSHI",
  reducedMotion = false,
  subtitle,
  tint,
}: LegacyProjectFolderCoverProps) {
  const style = {
    "--project-folder-deep": deepTint,
    "--project-folder-ink": ink,
    "--project-folder-tint": tint,
  } as CSSProperties;

  return (
    <motion.span
      aria-hidden="true"
      className="project-folder-cover"
      layoutId={reducedMotion ? undefined : layoutId}
      style={style}
      transition={reducedMotion
        ? { duration: 0 }
        : { layout: { type: "spring", stiffness: 150, damping: 25, mass: 0.9 } }}
    >
      <span className="project-folder-cover__assembly">
        <span className="project-folder-cover__rear">
          <span className="project-folder-cover__archive-mark">
            ARCHIVE {number || "01"}
          </span>
        </span>

        <span className="project-folder-cover__documents">
          {artifacts.map((artifact, index) => (
            <span
              className={`project-folder-cover__document project-folder-cover__document--${index + 1}`}
              key={`${artifact.src}-${index}`}
            >
              <span>{artifact.label}</span>
              <img
                alt=""
                decoding="async"
                draggable={false}
                loading="lazy"
                src={artifact.src}
                style={{ objectPosition: artifact.position || "center" }}
              />
            </span>
          ))}
        </span>

        <span className="project-folder-cover__front">
          <span className="project-folder-cover__spark">✳</span>
          <span className="project-folder-cover__metadata">
            <strong>{owner}</strong>
            <span>03 ARTEFACTS</span>
            <small>{subtitle}</small>
            {number ? <b>{number.padStart(2, "0")}</b> : null}
          </span>
        </span>
      </span>
    </motion.span>
  );
}
