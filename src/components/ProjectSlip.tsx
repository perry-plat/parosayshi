import { forwardRef } from "react";
import { LeadMedia, SlipBody } from "./SlipBody";
import type { ProjectData } from "../types/project";

interface ProjectSlipProps {
  project: ProjectData | null;
  stateClass: string;
}

export const ProjectSlip = forwardRef<HTMLElement, ProjectSlipProps>(function ProjectSlip(
  { project, stateClass },
  ref,
) {
  const firstImage = project?.body.find(
    (block) => typeof block !== "string" && block.type === "image",
  );
  const leadImage = project?.leadImage || firstImage || null;
  const leadBlock =
    leadImage && project
      ? {
          ...leadImage,
          caption: project.leadCaption || leadImage.caption || "",
        }
      : null;
  const fallbackIntro =
    project?.body.filter((block): block is string => typeof block === "string").slice(0, 2) || [];
  const introColumns = (project?.introColumns?.length ? project.introColumns : fallbackIntro).slice(0, 2);
  const bodyBlocks =
    project && firstImage ? project.body.filter((block) => block !== firstImage) : project?.body || [];

  return (
    <aside
      ref={ref}
      className={`project-slip ${stateClass}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-slip-title"
      aria-describedby="project-slip-kicker"
      tabIndex={-1}
      data-layout={project?.figmaLayout || "default"}
    >
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
            <p className="eyebrow" id="project-slip-kicker">
              {project?.kicker || "CASE FILE"}
            </p>
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
    </aside>
  );
});
