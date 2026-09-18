import type { FolioProject } from "../data/folioProjects";
import { ProjectMediaCarousel } from "./ProjectMediaCarousel";

interface FolioBentoCardProps {
  active: boolean;
  onOpen: (trigger: HTMLButtonElement) => void;
  project: FolioProject;
}

export function FolioBentoCard({
  active,
  onOpen,
  project,
}: FolioBentoCardProps) {
  const isSuperr = project.id === "superr" || project.id === "superr-paper";
  return (
    <article
      className="folio-bento-card"
      data-active={active ? "true" : undefined}
      data-project={project.id}
      data-tone={project.tone}
    >
      <div aria-hidden="true" className="folio-bento-card__media">
        <ProjectMediaCarousel
          ariaLabel={`${project.cardTitle} project preview`}
          autoAdvanceMs={2600}
          hoveredPhotoAdvanceMs={1800}
          media={project.previewMedia}
          reducedMotion
          showControls={false}
          size={{ gap: 0, height: "100%", peek: 0, width: "100%" }}
          transitionMs={520}
          videoAdvanceMs={2200}
          visibleTiles={1}
        />
      </div>
      <div aria-hidden="true" className="folio-bento-card__shade" />
      {isSuperr ? (
        <span className="folio-bento-card__nda-stamp">NDA</span>
      ) : null}
      <header className="folio-bento-card__caption">
        {isSuperr && project.logo ? (
          <img
            alt=""
            aria-hidden="true"
            className="folio-bento-card__logo"
            src={project.logo}
          />
        ) : null}
        <span>
          <strong>{project.cardTitle}</strong>
          <small>{project.id === "superr-paper" ? "Paper case study / Preview" : isSuperr ? "Edtech" : project.cardMeta}</small>
        </span>
      </header>
      {isSuperr ? (
        <div className="folio-bento-card__editorial-copy">
          <h3>Building toys that make learning fun</h3>
          <p>A little of what I’ve designed and built with the Superr team. Most is under NDA. This bit’s yours to explore.</p>
        </div>
      ) : null}
      <button
        aria-label={`Open ${project.cardTitle} project`}
        aria-pressed={active}
        className="folio-bento-card__button"
        data-folio-project={project.id}
        onClick={(event) => onOpen(event.currentTarget)}
        type="button"
      />
    </article>
  );
}
