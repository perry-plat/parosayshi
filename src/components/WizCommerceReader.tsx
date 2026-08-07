import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
  type UIEvent,
} from "react";
import {
  CaseStudyBottomSheet,
  type CaseStudyEntryColors,
  type ReaderScrollIntent,
} from "./CaseStudyBottomSheet";
import { SlipBody } from "./SlipBody";
import type { SlipEntryTransform, SlipState } from "../hooks/useSlip";
import type { ProjectBodyBlock, ProjectData } from "../types/project";

interface CaseStudyReaderProps {
  project: ProjectData;
  caseNumber: string;
  coverImage: string;
  coverLine: string;
  entryColors?: CaseStudyEntryColors;
  entryShape?: "folder";
  entryTransform?: SlipEntryTransform;
  onClose: () => void;
  reducedMotion: boolean;
  slipState: SlipState;
  onCloseAnimationComplete: () => void;
  onOpenAnimationComplete?: () => void;
}

interface ReaderSection {
  id: string;
  label: string;
  blocks: ProjectBodyBlock[];
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function makeSections(blocks: ProjectBodyBlock[], prefix: string): ReaderSection[] {
  const sections: ReaderSection[] = [];
  let label = "Opening notes";
  let current: ProjectBodyBlock[] = [];

  const flush = () => {
    if (!current.length) return;
    sections.push({ id: `${prefix}-${slug(label)}-${sections.length + 1}`, label, blocks: current });
    current = [];
  };

  blocks.forEach((block) => {
    if (typeof block !== "string" && block.type === "divider") {
      flush();
      return;
    }
    if (typeof block !== "string" && block.type === "heading") {
      flush();
      label = block.text;
      return;
    }
    current.push(block);
  });
  flush();
  return sections;
}

function chapterNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function PublicationCover({
  coverImage,
  coverLine,
  id,
  onJump,
  project,
  sections,
}: {
  coverImage: string;
  coverLine: string;
  id: string;
  onJump: (id: string) => void;
  project: ProjectData;
  sections: ReaderSection[];
}) {
  const introColumns = project.introColumns || [];
  const firstChapter = sections[1];

  return (
    <section className="wiz-reader-overview" data-reader-section id={id} tabIndex={-1}>
      <div className="wiz-reader-cover-heading">
        <span>{project.kicker || "PRODUCT DESIGN CASE STUDY"}</span>
        <h2>{project.title}</h2>
        <p>{project.deck || coverLine}</p>
      </div>

      {coverImage ? (
        <figure className="wiz-reader-cover-media">
          <img
            src={coverImage}
            alt={`${project.title} case study preview`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <figcaption>{project.kicker || coverLine}</figcaption>
        </figure>
      ) : null}

      {introColumns.length ? (
        <div className="wiz-reader-cover-intro" aria-label="Project overview">
          {introColumns.map((column, index) => (
            <p key={column}><b>{chapterNumber(index)}</b>{column}</p>
          ))}
        </div>
      ) : null}

      <div className="wiz-reader-overview-index">
        <div className="wiz-reader-overview-index-heading">
          <span>{project.edition === "prototype" ? "IN THIS PROTOTYPE" : "IN THIS CASE STUDY"}</span>
          <b>{sections.length - 1} READING SECTIONS</b>
        </div>
        <ol>
          {sections.slice(1).map((section, index) => (
            <li key={section.id}>
              <button onClick={() => onJump(section.id)} type="button">
                <span>{chapterNumber(index + 1)}</span>
                <strong>{section.label}</strong>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {firstChapter ? (
        <button className="wiz-reader-start" onClick={() => onJump(firstChapter.id)} type="button">
          <span>START READING</span>
          <strong>{chapterNumber(1)} — {firstChapter.label}</strong>
        </button>
      ) : null}
    </section>
  );
}

function ChapterContinuity({
  index,
  onClose,
  onJump,
  sections,
}: {
  index: number;
  onClose: () => void;
  onJump: (id: string) => void;
  sections: ReaderSection[];
}) {
  const previous = sections[index - 1];
  const next = sections[index + 1];

  return (
    <nav className="wiz-reader-continuity" aria-label="Continue reading">
      {previous ? (
        <button onClick={() => onJump(previous.id)} type="button">
          <span>PREVIOUS</span>
          <strong>{chapterNumber(index - 1)} — {previous.label}</strong>
        </button>
      ) : null}
      {next ? (
        <button className="is-next" onClick={() => onJump(next.id)} type="button">
          <span>NEXT</span>
          <strong>{chapterNumber(index + 1)} — {next.label}</strong>
        </button>
      ) : (
        <button className="is-next" onClick={onClose} type="button">
          <span>END OF CASE STUDY</span>
          <strong>RETURN TO THE WORK TABLE</strong>
        </button>
      )}
    </nav>
  );
}

function ReaderPublication({
  coverImage,
  coverLine,
  onClose,
  onJump,
  onScroll,
  project,
  scrollRef,
  sections,
}: {
  coverImage: string;
  coverLine: string;
  onClose: () => void;
  onJump: (id: string) => void;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  project: ProjectData;
  scrollRef: RefObject<HTMLDivElement | null>;
  sections: ReaderSection[];
}) {
  return (
    <div
      aria-label={`${project.title} reading area`}
      className="wiz-reader-scroll"
      onScroll={onScroll}
      ref={scrollRef}
      tabIndex={0}
    >
      <article className="wiz-reader-publication">
        <PublicationCover
          coverImage={coverImage}
          coverLine={coverLine}
          id={sections[0].id}
          onJump={onJump}
          project={project}
          sections={sections}
        />

        {sections.slice(1).map((section, sectionOffset) => {
          const index = sectionOffset + 1;
          return (
            <section
              className="wiz-reader-section"
              data-long-title={section.label.length > 34}
              data-reader-section
              id={section.id}
              key={section.id}
              tabIndex={-1}
            >
              <header className="wiz-reader-chapter-heading">
                <span>SECTION {chapterNumber(index)} / {chapterNumber(sections.length - 1)}</span>
                <h3>{section.label}</h3>
              </header>
              <SlipBody blocks={section.blocks} />
              <ChapterContinuity index={index} onClose={onClose} onJump={onJump} sections={sections} />
            </section>
          );
        })}
      </article>
    </div>
  );
}

export const CaseStudyReader = forwardRef<HTMLElement, CaseStudyReaderProps>(
  function CaseStudyReader(
    {
      project,
      caseNumber,
      coverImage,
      coverLine,
      entryColors,
      entryShape,
      entryTransform,
      onClose,
      reducedMotion,
      slipState,
      onCloseAnimationComplete,
      onOpenAnimationComplete,
    },
    ref,
  ) {
    const sections = useMemo<ReaderSection[]>(() => {
      const prefix = `case-study-${caseNumber}-${slug(project.title)}`;
      return [
        { id: `${prefix}-cover`, label: "Overview", blocks: [] },
        ...makeSections(project.body, prefix),
      ];
    }, [caseNumber, project.body, project.title]);
    const [progress, setProgress] = useState(0);
    const [scrollIntent, setScrollIntent] = useState<ReaderScrollIntent>("top");
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const previousScrollTop = useRef(0);
    const isClosing = slipState === "closing";

    useEffect(() => {
      if (isClosing) return;
      setProgress(0);
      setScrollIntent("top");
      previousScrollTop.current = 0;
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }, [isClosing, sections]);

    const jumpTo = useCallback((id: string) => {
      const scroller = scrollRef.current;
      const target = scroller?.querySelector<HTMLElement>(`#${id}`);
      if (!scroller || !target) return;
      const targetTop = Math.max(0, target.offsetTop - 16);
      const distance = Math.abs(targetTop - scroller.scrollTop);
      const nearby = distance <= scroller.clientHeight * 2;
      const behavior: ScrollBehavior = reducedMotion || !nearby ? "auto" : "smooth";
      scroller.scrollTo({ top: targetTop, behavior });
    }, [reducedMotion]);

    const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
      const scroller = event.currentTarget;
      const maximum = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      const scrollTop = Math.max(0, scroller.scrollTop);
      const delta = scrollTop - previousScrollTop.current;
      setProgress(maximum > 0 ? Math.min(1, scrollTop / maximum) : 1);
      if (scrollTop <= 12) {
        setScrollIntent("top");
      } else if (delta > 4) {
        setScrollIntent("down");
      } else if (delta < -4) {
        setScrollIntent("up");
      }
      previousScrollTop.current = scrollTop;
    }, []);

    return (
      <CaseStudyBottomSheet
        ariaLabel={`${project.title} case study publication`}
        entryColors={entryColors}
        entryShape={entryShape}
        entryTransform={entryTransform}
        onClose={onClose}
        onCloseAnimationComplete={onCloseAnimationComplete}
        onOpenAnimationComplete={onOpenAnimationComplete}
        progress={progress}
        reducedMotion={reducedMotion}
        ref={ref}
        scrollIntent={scrollIntent}
        slipState={slipState}
        title={project.title}
      >
        <div
          className="wiz-reader-viewport"
          data-chapters-open="false"
        >
          <ReaderPublication
            coverImage={coverImage}
            coverLine={coverLine}
            onClose={onClose}
            onJump={jumpTo}
            onScroll={handleScroll}
            project={project}
            scrollRef={scrollRef}
            sections={sections}
          />
        </div>
      </CaseStudyBottomSheet>
    );
  },
);
