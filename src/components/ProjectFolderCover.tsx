import { motion } from "motion/react";
import type { CSSProperties } from "react";

export interface ProjectFolderArtifact {
  label: string;
  position?: string;
  src: string;
}

interface ProjectFolderCoverProps {
  artifacts: [ProjectFolderArtifact, ProjectFolderArtifact, ProjectFolderArtifact];
  deepTint: string;
  ink: string;
  layoutId?: string;
  number?: string;
  owner?: string;
  reducedMotion?: boolean;
  subtitle: string;
  tint: string;
}

export function ProjectFolderCover({
  artifacts,
  deepTint,
  ink,
  layoutId,
  number,
  owner = "PAROSAYSHI",
  reducedMotion = false,
  subtitle,
  tint,
}: ProjectFolderCoverProps) {
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
          <span className="project-folder-cover__archive-mark">ARCHIVE {number || "01"}</span>
        </span>

        <span className="project-folder-cover__documents">
          {artifacts.map((artifact, index) => (
            <span className={`project-folder-cover__document project-folder-cover__document--${index + 1}`} key={`${artifact.src}-${index}`}>
              <span>{artifact.label}</span>
              <img
                alt=""
                draggable={false}
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
