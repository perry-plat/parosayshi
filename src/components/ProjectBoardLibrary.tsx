import type { CSSProperties, MouseEvent } from "react";
import type { ProjectId } from "../types/project";

export interface ProjectBoardImage {
  label: string;
  position?: string;
  src: string;
}

export interface ProjectBoardItem {
  id: ProjectId;
  images: ProjectBoardImage[];
  kind: string;
  number: string;
  period: string;
  summary: string;
  title: string;
}

interface ProjectBoardLibraryProps {
  activeProject: ProjectId | null;
  items: ProjectBoardItem[];
  onOpenItem: (id: ProjectId, trigger: HTMLElement) => void;
}

const boardColors = [
  "#f4d85d",
  "#efb9d2",
  "#ee7652",
  "#8bd3c7",
  "#5f68c9",
  "#b8c18f",
  "#ddd2ba",
];

export function ProjectBoardLibrary({
  activeProject,
  items,
  onOpenItem,
}: ProjectBoardLibraryProps) {
  const openItem = (
    event: MouseEvent<HTMLButtonElement>,
    item: ProjectBoardItem,
  ) => {
    onOpenItem(item.id, event.currentTarget);
  };

  return (
    <section
      aria-labelledby="project-board-title"
      className="project-board-library"
    >
      <header className="project-board-library__heading">
        <span>SELECTED WORK / BOARD VIEW</span>
        <h2 id="project-board-title">Things that made it out of the notebook.</h2>
        <p>One project per band. Pick a strip to open the full case study.</p>
      </header>

      <div className="project-board-library__stack">
        {items.map((item, index) => (
          <button
            aria-expanded={activeProject === item.id}
            aria-haspopup="dialog"
            aria-label={`Open ${item.title}`}
            className="project-board-library__row"
            data-project={item.id}
            key={item.id}
            onClick={(event) => openItem(event, item)}
            style={{ "--board-color": boardColors[index % boardColors.length] } as CSSProperties}
            type="button"
          >
            <span className="project-board-library__copy">
              <span className="project-board-library__eyebrow">
                {item.number} / {item.period} / {item.kind}
              </span>
              <strong>{item.title}</strong>
              <span className="project-board-library__summary">{item.summary}</span>
              <span className="project-board-library__open">
                OPEN CASE STUDY <span aria-hidden="true">↗</span>
              </span>
            </span>

            <span aria-hidden="true" className="project-board-library__mosaic">
              {item.images.slice(0, 3).map((image, imageIndex) => (
                <span
                  className="project-board-library__image"
                  data-wide={imageIndex === 1 ? "true" : undefined}
                  key={`${image.src}-${imageIndex}`}
                >
                  <img
                    alt=""
                    loading={index > 2 ? "lazy" : "eager"}
                    src={image.src}
                    style={{ objectPosition: image.position || "center" }}
                  />
                  <span>{image.label}</span>
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
