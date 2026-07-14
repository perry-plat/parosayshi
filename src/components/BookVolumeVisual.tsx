import { motion } from "motion/react";

export interface BookCoverVisualData {
  art: string;
  artScale: string;
  color: string;
  ink: string;
  line: string;
  number: string;
  title: string;
}

interface BookVolumeVisualProps {
  cover: BookCoverVisualData;
  edition?: string;
  layoutId: string;
}

export function BookVolumeVisual({ cover, edition, layoutId }: BookVolumeVisualProps) {
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
        <span className="book-cover">
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
        </span>
      </span>
    </motion.span>
  );
}
