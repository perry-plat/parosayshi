import { forwardRef } from "react";
import { motion } from "motion/react";
import { CaseStudyTexture } from "./CaseStudyTexture";
import { LeadMedia, SlipBody } from "./SlipBody";
import type { SlipState } from "../hooks/useSlip";
import type { ProjectData } from "../types/project";

interface ProjectSlipProps {
  project: ProjectData;
  reducedMotion: boolean;
  slipState: SlipState;
  onCloseAnimationComplete: () => void;
}

export const ProjectSlip = forwardRef<HTMLElement, ProjectSlipProps>(function ProjectSlip(
  { project, reducedMotion, slipState, onCloseAnimationComplete },
  ref,
) {
  const firstImage = project.body.find(
    (block) => typeof block !== "string" && block.type === "image",
  );
  const leadImage = project.leadImage || firstImage || null;
  const leadBlock =
    leadImage
      ? {
          ...leadImage,
          caption: project.leadCaption || leadImage.caption || "",
        }
      : null;
  const fallbackIntro =
    project.body.filter((block): block is string => typeof block === "string").slice(0, 2);
  const introColumns = (project.introColumns?.length ? project.introColumns : fallbackIntro).slice(0, 2);
  const bodyBlocks =
    firstImage ? project.body.filter((block) => block !== firstImage) : project.body;
  const isClosing = slipState === "closing";
  const airborne = {
    rotate: -4.2,
    scale: 0.985,
    y: "-120vh",
  };
  const landed = {
    rotate: 0,
    scale: 1,
    y: "0vh",
  };

  return (
    <motion.aside
      ref={ref}
      className={`project-slip is-${slipState}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-slip-title"
      tabIndex={-1}
      data-layout={project.figmaLayout || "default"}
      data-edition={project.edition || "case-file"}
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
      <CaseStudyTexture />
      <div className="slip-content">
        <div className="slip-header">
          <div className="slip-case-masthead" aria-hidden="true" hidden={project?.figmaLayout !== "frame32"}>
            <span className="slip-case-date">{project?.mastheadDate || ""}</span>
            <span className="slip-case-brand">
              {project?.mastheadLogo ? <img src={project.mastheadLogo} alt="" aria-hidden="true" /> : null}
              {project?.mastheadBrand ? <span>{project.mastheadBrand}</span> : null}
            </span>
            <span className="slip-case-mark">{project?.mastheadBrand || ""}</span>
          </div>
          <div className="slip-title-group">
            <h2 id="project-slip-title">{project?.title || ""}</h2>
          </div>
          <div className="slip-summary-group">
            <p className="slip-deck">{project?.deck || ""}</p>
          </div>
        </div>
        <div className="slip-lead">
          {leadBlock ? <LeadMedia block={leadBlock} /> : <div className="slip-lead-placeholder" />}
        </div>
        <div className="slip-intro-columns">
          {introColumns.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <SlipBody blocks={bodyBlocks} />
      </div>
    </motion.aside>
  );
});
