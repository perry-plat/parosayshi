import type { FolioProjectSketch } from "../data/folioProjects";
import "../styles/folio-project-sketch.css";

/** An accessible, resolution-independent note sketch for case-study journeys. */
export function FolioProjectSketchMedia({ sketch }: { sketch: FolioProjectSketch }) {
  return (
    <figure className="folio-project-sketch" aria-label={sketch.label}>
      <figcaption className="folio-project-sketch__caption">{sketch.label}</figcaption>
      <ol className="folio-project-sketch__steps">
        {sketch.steps.map((step, index) => (
          <li className="folio-project-sketch__step" key={`${index}-${step}`}>
            <span className="folio-project-sketch__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className="folio-project-sketch__label">{step}</span>
            {index < sketch.steps.length - 1 && (
              <svg className="folio-project-sketch__arrow" viewBox="0 0 48 28" aria-hidden="true">
                <path d="M3 17C14 9 28 11 42 12M32 4l11 8-10 9" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}
