import { forwardRef, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { motion } from "motion/react";
import { BookVolumeVisual, type BookCoverVisualData } from "./BookVolumeVisual";
import { LeadMedia, SlipBody } from "./SlipBody";
import type { SlipState } from "../hooks/useSlip";
import type { ProjectBodyBlock, ProjectData, ProjectId } from "../types/project";

export type ProjectCoverData = BookCoverVisualData;

interface ProjectSlipProps {
  project: ProjectData;
  projectId: ProjectId;
  cover: ProjectCoverData;
  reducedMotion: boolean;
  slipState: SlipState;
  onCloseAnimationComplete: () => void;
}

function blockWeight(block: ProjectBodyBlock) {
  if (typeof block === "string") return 0.7;
  switch (block.type) {
    case "heading":
      return 0.5;
    case "eyebrow":
    case "small-note":
    case "quote":
    case "list":
    case "red-columns":
      return 1;
    case "image":
    case "image-slot":
    case "video":
    case "video-carousel":
    case "asset-grid":
    case "screen-grid":
    case "media-row":
      return 2.2;
    case "divider":
      return 0;
    default:
      return 1;
  }
}

function paginateBlocks(blocks: ProjectBodyBlock[]) {
  const pages: ProjectBodyBlock[][] = [];
  let current: ProjectBodyBlock[] = [];
  let weight = 0;

  const flush = () => {
    if (!current.length) return;
    pages.push(current);
    current = [];
    weight = 0;
  };

  blocks.forEach((block) => {
    if (typeof block !== "string" && block.type === "divider") {
      flush();
      return;
    }

    const nextWeight = blockWeight(block);
    const startsSection = typeof block !== "string" && block.type === "heading";
    if ((startsSection && current.length) || (current.length && weight + nextWeight > 3.1)) flush();
    current.push(block);
    weight += nextWeight;
  });

  flush();
  return pages;
}

export const ProjectSlip = forwardRef<HTMLElement, ProjectSlipProps>(function ProjectSlip(
  { project, projectId, cover, reducedMotion, slipState, onCloseAnimationComplete },
  ref,
) {
  const [isMagazineOpen, setIsMagazineOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [pendingSpreadIndex, setPendingSpreadIndex] = useState<number | null>(null);
  const [turningDirection, setTurningDirection] = useState<"next" | "previous" | null>(null);
  const [isCoverTurning, setIsCoverTurning] = useState(false);
  const turnTimer = useRef<number | null>(null);
  const coverTimer = useRef<number | null>(null);
  const firstImage = project.body.find(
    (block) => typeof block !== "string" && block.type === "image",
  );
  const leadImage = project.leadImage || firstImage || null;
  const leadBlock = leadImage
    ? {
        ...leadImage,
        caption: project.leadCaption || leadImage.caption || "",
      }
    : null;
  const fallbackIntro = project.body.filter((block): block is string => typeof block === "string").slice(0, 2);
  const introColumns = (project.introColumns?.length ? project.introColumns : fallbackIntro).slice(0, 2);
  const bodyBlocks = !project.leadImage && firstImage ? project.body.filter((block) => block !== firstImage) : project.body;
  const magazinePages = useMemo(() => paginateBlocks(bodyBlocks), [bodyBlocks]);
  const spreadCount = 1 + Math.ceil(magazinePages.length / 2);
  const isClosing = slipState === "closing";
  const airborne = {
    opacity: 0,
    rotate: -4.2,
    scale: 0.985,
    y: "-120vh",
  };
  const landed = {
    opacity: 1,
    rotate: 0,
    scale: 1,
    y: "0vh",
  };

  useEffect(() => {
    return () => {
      if (turnTimer.current !== null) window.clearTimeout(turnTimer.current);
      if (coverTimer.current !== null) window.clearTimeout(coverTimer.current);
    };
  }, []);

  const focusedCoverStyle = {
    "--book-cover": cover.color,
    "--book-cover-art": `url(${cover.art})`,
    "--book-cover-art-scale": cover.artScale,
    "--book-ink": cover.ink,
  } as CSSProperties;

  const openMagazine = () => {
    if (isMagazineOpen) return;
    setIsMagazineOpen(true);
    if (reducedMotion) return;
    setIsCoverTurning(true);
    coverTimer.current = window.setTimeout(() => {
      setIsCoverTurning(false);
      coverTimer.current = null;
    }, 780);
  };

  const turnTo = (nextSpread: number) => {
    if (turningDirection || nextSpread === spreadIndex || nextSpread < 0 || nextSpread >= spreadCount) return;
    const nextDirection = nextSpread > spreadIndex ? "next" : "previous";
    if (reducedMotion) {
      setSpreadIndex(nextSpread);
      return;
    }
    setPendingSpreadIndex(nextSpread);
    setTurningDirection(nextDirection);
    turnTimer.current = window.setTimeout(() => {
      setSpreadIndex(nextSpread);
      setPendingSpreadIndex(null);
      setTurningDirection(null);
      turnTimer.current = null;
    }, 780);
  };

  const handlePageClick = (event: MouseEvent<HTMLElement>, side: "left" | "right") => {
    const target = event.target as HTMLElement;
    if (target.closest("a, button, input, textarea, select, video, audio, [data-no-page-turn]")) return;
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) return;
    turnTo(spreadIndex + (side === "right" ? 1 : -1));
  };

  const renderPageContent = (side: "left" | "right", pageSpreadIndex: number) => {
    const bodyPageOffset = (pageSpreadIndex - 1) * 2;
    const bodyPage = pageSpreadIndex > 0
      ? magazinePages[bodyPageOffset + (side === "right" ? 1 : 0)]
      : null;
    const leftPageNumber = pageSpreadIndex === 0 ? 1 : 3 + bodyPageOffset;
    const pageNumber = side === "left" ? leftPageNumber : leftPageNumber + 1;

    return (
      <>
        <div className="case-book-page-meta">
          <span>{side === "left" ? project.edition || "CASE STUDY" : project.kicker || "PROJECT NOTES"}</span>
          <span>
            {side === "left"
              ? pageSpreadIndex === 0 ? "OPENING NOTES" : cover.title
              : `${pageSpreadIndex + 1} / ${spreadCount}`}
          </span>
        </div>

        {pageSpreadIndex === 0 && side === "left" ? (
          <div className="slip-content slip-content-left">
            <div className="slip-header">
              <div className="slip-case-masthead" aria-hidden="true" hidden={project.figmaLayout !== "frame32"}>
                <span className="slip-case-date">{project.mastheadDate || ""}</span>
                <span className="slip-case-brand">
                  {project.mastheadLogo ? <img src={project.mastheadLogo} alt="" aria-hidden="true" /> : null}
                  {project.mastheadBrand ? <span>{project.mastheadBrand}</span> : null}
                </span>
                <span className="slip-case-mark">{project.mastheadBrand || ""}</span>
              </div>
              <div className="slip-title-group">
                <h2>{project.title || cover.title}</h2>
              </div>
              {project.deck ? <p className="slip-deck">{project.deck}</p> : null}
            </div>
            {introColumns[0] ? <p className="case-book-intro">{introColumns[0]}</p> : null}
          </div>
        ) : pageSpreadIndex === 0 && side === "right" ? (
          <div className="slip-content slip-content-right">
            <div className="slip-lead">
              {leadBlock ? <LeadMedia block={leadBlock} /> : <div className="slip-lead-placeholder" />}
            </div>
            {introColumns[1] ? <p className="case-book-intro case-book-intro-right">{introColumns[1]}</p> : null}
          </div>
        ) : bodyPage ? (
          <SlipBody blocks={bodyPage} />
        ) : (
          <div className="magazine-end-note">
            <span>END NOTE</span>
            <strong>More experiments soon.</strong>
          </div>
        )}

        <span className="case-book-page-number">{String(pageNumber).padStart(2, "0")}</span>
      </>
    );
  };

  return (
    <motion.aside
      ref={ref}
      className={`project-slip case-study-book ${isMagazineOpen ? "is-magazine-open" : "is-cover-preview"} is-${slipState}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${cover.title} case study`}
      tabIndex={-1}
      data-layout={project.figmaLayout || "default"}
      data-edition={project.edition || "case-file"}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          turnTo(spreadIndex - 1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          turnTo(spreadIndex + 1);
        }
      }}
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
      <div className={`case-book-opening-shell${isMagazineOpen ? " is-open" : " is-front-cover"}${isCoverTurning ? " is-cover-turning" : ""}`}>
          <div
            className="case-book-spread"
            data-spread={spreadIndex}
            key={spreadIndex}
            aria-hidden={!isMagazineOpen || undefined}
          >
            <section
              className="case-book-page case-book-page-left"
              data-can-turn={spreadIndex > 0 || undefined}
              onClick={(event) => handlePageClick(event, "left")}
            >
              {renderPageContent("left", spreadIndex)}
            </section>

            <section
              className="case-book-page case-book-page-right"
              data-can-turn={spreadIndex < spreadCount - 1 || undefined}
              onClick={(event) => handlePageClick(event, "right")}
            >
              {renderPageContent("right", spreadIndex)}
            </section>

            <span className="case-book-gutter" aria-hidden="true" />

            {turningDirection && pendingSpreadIndex !== null ? (
              <div className={`case-book-turning-leaf is-${turningDirection}`} aria-hidden="true">
                <div
                  className={`case-book-page case-book-turn-face is-front case-book-page-${turningDirection === "next" ? "right" : "left"}`}
                >
                  {renderPageContent(turningDirection === "next" ? "right" : "left", spreadIndex)}
                </div>
                <div
                  className={`case-book-page case-book-turn-face is-back case-book-page-${turningDirection === "next" ? "left" : "right"}`}
                >
                  {renderPageContent(turningDirection === "next" ? "left" : "right", pendingSpreadIndex)}
                </div>
              </div>
            ) : null}
          </div>

          {!isMagazineOpen || isCoverTurning ? (
            <div className="case-book-cover-leaf" aria-hidden={isMagazineOpen || undefined}>
              <div className="case-book-cover-face is-front">
                <button
                  className="case-book-focused-trigger"
                  type="button"
                  disabled={isMagazineOpen}
                  onClick={openMagazine}
                  style={focusedCoverStyle}
                  aria-label={`Open the complete ${cover.title} case study`}
                >
                  <BookVolumeVisual cover={cover} edition={project.edition} layoutId={`focused-book-${projectId}`} />
                </button>
              </div>
              <section className="case-book-page case-book-cover-face is-back case-book-page-left">
                {renderPageContent("left", 0)}
              </section>
            </div>
          ) : null}
      </div>

      {isMagazineOpen && !isCoverTurning ? (
          <nav className="magazine-pagination" aria-label="Case study pages">
            <button type="button" onClick={() => turnTo(spreadIndex - 1)} disabled={spreadIndex === 0 || Boolean(turningDirection)} aria-label="Previous spread">←</button>
            <span>{String(spreadIndex + 1).padStart(2, "0")} / {String(spreadCount).padStart(2, "0")}</span>
            <button type="button" onClick={() => turnTo(spreadIndex + 1)} disabled={spreadIndex === spreadCount - 1 || Boolean(turningDirection)} aria-label="Next spread">→</button>
          </nav>
      ) : null}
    </motion.aside>
  );
});
