import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
  type UIEvent,
} from "react";
import { CaseStudyBottomSheet, type CaseStudyEntryColors } from "./CaseStudyBottomSheet";
import { SlipBody } from "./SlipBody";
import type { SlipEntryTransform, SlipState } from "../hooks/useSlip";
import type { ProjectBodyBlock, ProjectData } from "../types/project";

interface CaseStudyReaderProps {
  project: ProjectData;
  caseNumber: string;
  coverImage: string;
  coverLine: string;
  bookmarks: boolean;
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

interface ReaderPage {
  id: string;
  sectionId: string;
  label: string;
  chapterIndex: number;
  pageIndex: number;
  blocks: ProjectBodyBlock[];
}

type ReaderLayout = "desktop" | "tablet" | "phone";

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

function getReaderLayout(): ReaderLayout {
  if (typeof window === "undefined") return "desktop";
  if (window.innerWidth <= 680) return "phone";
  if (window.innerWidth <= 1040) return "tablet";
  return "desktop";
}

function useReaderLayout() {
  const [layout, setLayout] = useState<ReaderLayout>(getReaderLayout);

  useEffect(() => {
    const update = () => setLayout((current) => {
      const next = getReaderLayout();
      return current === next ? current : next;
    });
    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
}

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function splitLongText(text: string, maximumLength: number) {
  if (text.length <= maximumLength) return [text];

  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = "";
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maximumLength && current) {
      chunks.push(current);
      current = word;
      return;
    }
    current = next;
  });
  if (current) chunks.push(current);
  return chunks;
}

function fragmentBlocks(blocks: ProjectBodyBlock[], layout: ReaderLayout) {
  const fragmented: ProjectBodyBlock[] = [];
  const gridSize = layout === "phone" ? 1 : layout === "tablet" ? 2 : 4;
  const pairSize = layout === "phone" ? 1 : 2;
  const listSize = layout === "phone" ? 3 : layout === "tablet" ? 4 : 6;
  const textLength = layout === "phone" ? 430 : layout === "tablet" ? 650 : 900;

  blocks.forEach((block) => {
    if (typeof block === "string") {
      fragmented.push(...splitLongText(block, textLength));
      return;
    }

    switch (block.type) {
      case "quote":
        splitLongText(block.text, layout === "phone" ? 280 : 560).forEach((text) => {
          fragmented.push({ ...block, text });
        });
        return;
      case "media-row":
        chunkItems(block.items, pairSize).forEach((items, index, chunks) => {
          fragmented.push({
            ...block,
            columns: Math.min(block.columns || items.length, items.length),
            caption: index === chunks.length - 1 ? block.caption : undefined,
            items,
          });
        });
        return;
      case "asset-grid":
        chunkItems(block.items, gridSize).forEach((items, index, chunks) => {
          fragmented.push({
            ...block,
            caption: index === chunks.length - 1 ? block.caption : undefined,
            items,
          });
        });
        return;
      case "screen-grid":
        chunkItems(block.screens, pairSize).forEach((screens) => {
          fragmented.push({ ...block, screens });
        });
        return;
      case "red-columns":
        chunkItems(block.columns, pairSize).forEach((columns) => {
          fragmented.push({ ...block, columns });
        });
        return;
      case "list":
        chunkItems(block.items, listSize).forEach((items) => {
          fragmented.push({ ...block, items });
        });
        return;
      default:
        fragmented.push(block);
    }
  });

  return fragmented;
}

function blockWeight(block: ProjectBodyBlock, layout: ReaderLayout) {
  if (typeof block === "string") {
    const divisor = layout === "phone" ? 145 : layout === "tablet" ? 220 : 300;
    return Math.max(1, block.length / divisor);
  }

  switch (block.type) {
    case "eyebrow":
    case "small-note":
      return 0.8;
    case "quote":
      return 2.5;
    case "list":
      return 1.4 + block.items.length * 0.45;
    case "red-columns":
      return 1.8 + block.columns.length * 0.8;
    case "image":
    case "image-slot":
    case "video":
    case "video-carousel":
    case "media-row":
    case "asset-grid":
    case "screen-grid":
      return 6;
    default:
      return 1;
  }
}

function pageCapacity(layout: ReaderLayout, pageIndex: number) {
  if (layout === "phone") return pageIndex === 0 ? 5.2 : 6.4;
  if (layout === "tablet") return pageIndex === 0 ? 10.5 : 12;
  return pageIndex === 0 ? 12 : 14;
}

function normalizePages(pages: ReaderPage[]) {
  const sectionCounts = new Map<string, number>();
  return pages.map((page) => {
    const pageIndex = sectionCounts.get(page.sectionId) || 0;
    sectionCounts.set(page.sectionId, pageIndex + 1);
    return {
      ...page,
      id: pageIndex === 0 ? page.sectionId : `${page.sectionId}-page-${pageIndex + 1}`,
      pageIndex,
    };
  });
}

function paginateSections(sections: ReaderSection[], layout: ReaderLayout) {
  const pages: ReaderPage[] = [];

  sections.forEach((section, chapterIndex) => {
    const blocks = fragmentBlocks(section.blocks, layout);
    let pageIndex = 0;
    let pageBlocks: ProjectBodyBlock[] = [];
    let weight = 0;

    const pushPage = () => {
      pages.push({
        id: "",
        sectionId: section.id,
        label: section.label,
        chapterIndex,
        pageIndex,
        blocks: pageBlocks,
      });
      pageIndex += 1;
      pageBlocks = [];
      weight = 0;
    };

    if (layout === "phone" && section.label.length > 34) pushPage();

    blocks.forEach((block) => {
      const nextWeight = blockWeight(block, layout);
      const capacity = pageCapacity(layout, pageIndex);

      if (pageBlocks.length && weight + nextWeight > capacity) pushPage();

      // On phones, an image or grid belongs on a clean continuation sheet
      // rather than being squeezed below the full-size chapter opener.
      if (!pageBlocks.length && pageIndex === 0 && nextWeight > capacity) pushPage();

      pageBlocks.push(block);
      weight += nextWeight;
    });

    if (pageBlocks.length || pageIndex === 0) pushPage();
  });

  return normalizePages(pages);
}

function rebalanceOverflowPage(pages: ReaderPage[], pageIndex: number) {
  const page = pages[pageIndex];
  if (!page || page.blocks.length <= 1) return pages;

  const next = pages.map((item) => ({ ...item, blocks: [...item.blocks] }));
  const currentPage = next[pageIndex];
  const movedBlock = currentPage.blocks.pop();
  if (!movedBlock) return pages;

  const followingPage = next[pageIndex + 1];
  if (followingPage?.sectionId === currentPage.sectionId) {
    followingPage.blocks.unshift(movedBlock);
  } else {
    next.splice(pageIndex + 1, 0, {
      ...currentPage,
      id: "",
      blocks: [movedBlock],
      pageIndex: currentPage.pageIndex + 1,
    });
  }

  return normalizePages(next);
}

/*
 * Chapter visibility controls are intentionally parked. The reader currently
 * opens with chapters hidden, while the navigation itself remains reusable.
function ChapterVisibilitySwitcher({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="wiz-reader-chapter-switcher" role="group" aria-label="Chapter navigation visibility">
      <span>CHAPTERS</span>
      <button
        aria-label="Show chapter navigation"
        aria-pressed={enabled}
        onClick={() => onChange(true)}
        type="button"
      >
        ON
      </button>
      <button
        aria-label="Hide chapter navigation"
        aria-pressed={!enabled}
        onClick={() => onChange(false)}
        type="button"
      >
        OFF
      </button>
    </div>
  );
}
*/

function ChapterNavigation({
  activeId,
  onJump,
  sections,
}: {
  activeId: string;
  onJump: (id: string) => void;
  sections: ReaderSection[];
}) {
  return (
    <nav className="wiz-reader-chapters" aria-label="Case study chapters">
      {sections.map((section, index) => (
        <button
          aria-current={section.id === activeId ? "location" : undefined}
          key={section.id}
          onClick={() => onJump(section.id)}
          type="button"
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{section.label}</strong>
        </button>
      ))}
    </nav>
  );
}

function PublicationCover({
  coverImage,
  coverLine,
  id,
  layout,
  project,
}: {
  coverImage: string;
  coverLine: string;
  id: string;
  layout: ReaderLayout;
  project: ProjectData;
}) {
  const heading = (
    <div className="wiz-reader-cover-heading">
      <span>{project.kicker || "PRODUCT DESIGN CASE STUDY"}</span>
      <h2>{project.title}</h2>
      <p>{project.deck || coverLine}</p>
    </div>
  );
  const media = coverImage ? (
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
  ) : null;
  const introColumns = project.introColumns || [];
  const intro = (
    <div className="wiz-reader-cover-intro">
      {introColumns.map((column, index) => (
        <p key={column}><b>0{index + 1}</b>{column}</p>
      ))}
    </div>
  );
  if (layout === "phone") {
    return (
      <>
        <section
          className="wiz-reader-page wiz-reader-cover-page wiz-reader-cover-opening"
          data-long-title={project.title.length > 22}
          id={id}
        >
          {heading}
        </section>
        {media ? (
          <section className="wiz-reader-page wiz-reader-cover-page wiz-reader-cover-image-page">
            {media}
          </section>
        ) : null}
        {introColumns.map((column, index) => (
          <section
            className="wiz-reader-page wiz-reader-cover-page wiz-reader-cover-details-page"
            key={column}
          >
            <div className="wiz-reader-cover-intro" data-single-column="true">
              <p><b>{String(index + 1).padStart(2, "0")}</b>{column}</p>
            </div>
          </section>
        ))}
      </>
    );
  }

  return (
    <>
      <section
        className="wiz-reader-page wiz-reader-cover-page wiz-reader-cover-opening"
        data-long-title={project.title.length > 22}
        id={id}
      >
        {heading}
        {media}
      </section>
      <section className="wiz-reader-page wiz-reader-cover-page wiz-reader-cover-details-page">
        {intro}
      </section>
    </>
  );
}

function ReaderPublication({
  coverImage,
  coverLine,
  layout,
  onScroll,
  project,
  scrollRef,
  sections,
}: {
  coverImage: string;
  coverLine: string;
  layout: ReaderLayout;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  project: ProjectData;
  scrollRef: RefObject<HTMLDivElement | null>;
  sections: ReaderSection[];
}) {
  const initialPages = useMemo(
    () => paginateSections(sections.slice(1), layout),
    [layout, sections],
  );
  const [pages, setPages] = useState(initialPages);
  const publicationRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setPages(initialPages);
  }, [initialPages]);

  useLayoutEffect(() => {
    const publication = publicationRef.current;
    if (!publication) return;

    let frame = 0;
    const checkOverflow = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const renderedPages = Array.from(
          publication.querySelectorAll<HTMLElement>("[data-reader-page-index]"),
        );
        const overflowing = renderedPages.find((page) => (
          page.scrollHeight - page.clientHeight > 2
          && Number(page.dataset.blockCount) > 1
        ));
        if (!overflowing) return;
        const index = Number(overflowing.dataset.readerPageIndex);
        if (!Number.isFinite(index)) return;
        setPages((current) => rebalanceOverflowPage(current, index));
      });
    };

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(publication);
    Array.from(publication.querySelectorAll<HTMLElement>(".wiz-reader-page")).forEach((page) => {
      resizeObserver.observe(page);
    });
    publication.addEventListener("load", checkOverflow, true);
    publication.addEventListener("loadedmetadata", checkOverflow, true);
    void document.fonts?.ready.then(checkOverflow);
    checkOverflow();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      publication.removeEventListener("load", checkOverflow, true);
      publication.removeEventListener("loadedmetadata", checkOverflow, true);
    };
  }, [pages]);

  return (
    <div className="wiz-reader-scroll" onScroll={onScroll} ref={scrollRef} tabIndex={0}>
      <article className="wiz-reader-publication" ref={publicationRef}>
        <PublicationCover
          coverImage={coverImage}
          coverLine={coverLine}
          id={sections[0].id}
          layout={layout}
          project={project}
        />

        {pages.map((page, index) => {
          const continuation = page.pageIndex > 0;
          return (
            <section
              className="wiz-reader-page wiz-reader-section-page"
              data-block-count={page.blocks.length}
              data-continuation={continuation}
              data-long-title={page.label.length > 34}
              data-reader-page-index={index}
              id={page.id}
              key={page.id}
            >
              {!continuation ? <h3 className="wiz-reader-chapter-title">{page.label}</h3> : null}
              <SlipBody blocks={page.blocks} />
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
      bookmarks,
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
        { id: `${prefix}-cover`, label: "Opening notes", blocks: [] },
        ...makeSections(project.body, prefix),
      ];
    }, [caseNumber, project.body, project.title]);
    const [activeId, setActiveId] = useState(sections[0].id);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const layout = useReaderLayout();
    const isClosing = slipState === "closing";

    useEffect(() => {
      if (isClosing) return;
      setActiveId(sections[0].id);
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }, [isClosing, sections]);

    const jumpTo = useCallback((id: string) => {
      const scroller = scrollRef.current;
      const target = scroller?.querySelector<HTMLElement>(`#${id}`);
      if (!scroller || !target) return;
      scroller.scrollTo({
        top: Math.max(0, target.offsetTop - 20),
        behavior: reducedMotion ? "auto" : "smooth",
      });
      setActiveId(id);
    }, [reducedMotion]);

    const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
      const scroller = event.currentTarget;
      const readingLine = scroller.scrollTop + scroller.clientHeight * 0.32;
      let nearest = sections[0].id;
      sections.forEach((section) => {
        const element = scroller.querySelector<HTMLElement>(`#${section.id}`);
        if (element && element.offsetTop <= readingLine) nearest = section.id;
      });
      setActiveId((current) => current === nearest ? current : nearest);
    }, [sections]);

    return (
      <CaseStudyBottomSheet
        ariaLabel={`${project.title} case study publication`}
        entryColors={entryColors}
        entryShape={entryShape}
        entryTransform={entryTransform}
        onClose={onClose}
        onCloseAnimationComplete={onCloseAnimationComplete}
        onOpenAnimationComplete={onOpenAnimationComplete}
        reducedMotion={reducedMotion}
        ref={ref}
        slipState={slipState}
        title={project.title}
      >
        <div className="wiz-reader-viewport" data-chapters={bookmarks} data-layout={layout}>
          {bookmarks ? <ChapterNavigation activeId={activeId} onJump={jumpTo} sections={sections} /> : null}
          <ReaderPublication
            coverImage={coverImage}
            coverLine={coverLine}
            layout={layout}
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
