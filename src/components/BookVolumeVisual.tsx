import { motion } from "motion/react";
import { AnnualReportCover, type AnnualCoverConfig } from "./AnnualReportCover";

export interface BookCoverVisualData {
  annual?: AnnualCoverConfig;
  art: string;
  artScale: string;
  color: string;
  coverStyle?: "original" | "translucent-annual";
  ink: string;
  line: string;
  number: string;
  title: string;
}

interface BookVolumeVisualProps {
  cover: BookCoverVisualData;
  edition?: string;
  layoutId: string;
  projectId?: string;
}

export function BookVolumeVisual({ cover, edition, layoutId, projectId = layoutId }: BookVolumeVisualProps) {
  const useAnnualCover = cover.coverStyle === "translucent-annual" && cover.annual;

  return (
    <motion.span
      className="book-shared-shell"
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 150, damping: 24, mass: 0.9 }}
    >
      <span className="book-volume">
        <span className="book-pages" aria-hidden="true" />
        <span className="book-spine" aria-hidden="true" />
        <span className="book-fore-edge" aria-hidden="true" />
        <span className="book-bottom-edge" aria-hidden="true" />
        <span className={`book-cover${useAnnualCover ? " is-annual" : ""}`}>
          {useAnnualCover ? (
            <AnnualReportCover
              config={cover.annual!}
              descriptor={cover.line}
              mode="focused"
              number={cover.number}
              projectId={projectId}
            />
          ) : (
            <>
              <span className="book-cover-art" aria-hidden="true" />
              <span className="book-cover-topline">
                <span>PAROSAYSHI PRESS</span>
                <span>{cover.number}</span>
              </span>
              <strong>{cover.title}</strong>
              <span className="book-cover-line">{cover.line}</span>
              <span className="book-study-mark" aria-hidden="true">
                <span>{edition || "Case study"}</span>
                <strong>{cover.number}</strong>
              </span>
              <span className="book-cover-footer">
                <span>PARTH JHA</span>
                <span>PRODUCT DESIGN</span>
              </span>
            </>
          )}
        </span>
      </span>
    </motion.span>
  );
}
