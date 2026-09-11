import type { CSSProperties } from "react";
import type { FolioProject } from "../data/folioProjects";

interface FolioFolderCardProps {
  active: boolean;
  index: number;
  onOpen: (trigger: HTMLButtonElement) => void;
  project: FolioProject;
}

export function FolioFolderCard({ active, index, onOpen, project }: FolioFolderCardProps) {
  return (
    <article className="folio-folder-card" data-folder-index={index + 1}>
      <button
        aria-controls="folio-project-viewer"
        aria-expanded={active}
        aria-haspopup="dialog"
        aria-label={`Open ${project.title} project folder`}
        className="folio-folder-card__button"
        data-folio-project={project.id}
        onClick={(event) => onOpen(event.currentTarget)}
        type="button"
      >
        <span aria-hidden="true" className="folio-folder-card__object">
          <span className="folio-folder-card__rear" />
          <span className="folio-folder-card__papers">
            {project.folderPreviews.slice(0, 3).map((preview, previewIndex) => (
              <span
                className={`folio-folder-card__paper folio-folder-card__paper--${previewIndex + 1}`}
                key={`${project.id}-${preview.label}`}
                style={{ "--folder-paper-color": preview.color } as CSSProperties}
              >
                {preview.src ? (
                  <img
                    alt=""
                    decoding="async"
                    draggable={false}
                    loading="lazy"
                    src={preview.src}
                    style={{ objectPosition: preview.position || "center" }}
                  />
                ) : (
                  <span className="folio-folder-card__paper-lines" />
                )}
                <small>{preview.label}</small>
              </span>
            ))}
          </span>
          <span className="folio-folder-card__front">
            <svg
              aria-hidden="true"
              preserveAspectRatio="none"
              viewBox="0 0 440 322"
            >
              <path d="M16 0H104C111 0 116 2 121 7L151 32C156 36 161 37 168 37H423C434 37 440 44 440 55V306C440 316 434 322 423 322H17C6 322 0 316 0 306V17C0 6 6 0 16 0Z" />
            </svg>
            <span>{String(index + 1).padStart(2, "0")}</span>
          </span>
        </span>

        <span className="folio-folder-card__caption">
          <span>
            <strong>{project.cardTitle}</strong>
            <small>{project.cardMeta}</small>
          </span>
          <span aria-hidden="true" className="folio-folder-card__open-cue">
            Open folder <b>↗</b>
          </span>
        </span>
      </button>
    </article>
  );
}
