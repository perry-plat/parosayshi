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
      <header className="folio-bento-card__caption">
        {project.id === "superr" && project.logo ? (
          <img
            alt=""
            aria-hidden="true"
            className="folio-bento-card__logo"
            src={project.logo}
          />
        ) : null}
        <span>
          <strong>{project.cardTitle}</strong>
          <small>{project.id === "superr" ? "Edtech" : project.cardMeta}</small>
        </span>
      </header>
      {project.id === "superr" ? (
        <div className="folio-bento-card__editorial-copy">
          <p>{project.description}</p>
          <span>Explore my work</span>
        </div>
      ) : null}
      {project.id !== "superr" ? (
        <span aria-hidden="true" className="folio-bento-card__open">↗</span>
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
