import { FolioProjectAsset } from "./FolioProjectAsset";

const base = "/assets/invoice-folio/superr-case-study/activity-section";

export function SuperrActivitySection({ reducedMotion }: { reducedMotion: boolean }) {
  // The enclosing media group owns the heading; this block contains only the scene.
  return (
    <section className="folio-project-viewer__media superr-activity" aria-label="SuperrBook activity">
      <div className="superr-activity__scene">
        <div className="superr-activity__zoom">
        <FolioProjectAsset reducedMotion={reducedMotion} media={{ kind: "video", ariaLabel: "SuperrBook interactive crossword activity", src: "/assets/invoice-folio/superr-case-study/activity.mp4", poster: `${base}/section_2_screen_2.webp`, ratio: "landscape", fit: "cover" }} />
        <img className="superr-activity__frame" src={`${base}/feature_bg_2.webp`} alt="Blue SuperrBook held against a sky filled with clouds" />
        </div>
      </div>
    </section>
  );
}
