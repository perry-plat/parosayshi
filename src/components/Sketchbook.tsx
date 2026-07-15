import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";

type NotebookPage = {
  alt: string;
  caption: string;
  image?: string;
  kind: "cover" | "image";
  label: string;
};

type NotebookSheet = {
  back: NotebookPage;
  backIndex: number;
  front: NotebookPage;
  frontIndex: number;
};

const notebookCoverImage = "/assets/new/notebook-cover-cutout-tight-v3.png";

const pages: NotebookPage[] = [
  {
    alt: "Front cover of Parth's field notebook",
    caption: "Field notes, volume one",
    kind: "cover",
    label: "Field notes",
  },
  {
    alt: "Parth working beside a dog",
    caption: "A working afternoon",
    image: "/assets/polaroid.jpeg",
    kind: "image",
    label: "People and places",
  },
  {
    alt: "Product design system board",
    caption: "Systems, annotated",
    image: "/assets/new/wizcommerce-frame32/modifiers-board.png",
    kind: "image",
    label: "Process fragment",
  },
  {
    alt: "Collection of product interface studies",
    caption: "Things worth keeping",
    image: "/assets/new/wizcommerce-frame32/visuals-grid-666.png",
    kind: "image",
    label: "Interface studies",
  },
  {
    alt: "Illustrated map of Bengaluru",
    caption: "A field note from Bengaluru",
    image: "/assets/new/uber-kids/map-bengaluru.png",
    kind: "image",
    label: "Around the city",
  },
  {
    alt: "Back cover of Parth's field notebook",
    caption: "More loose pages soon",
    kind: "cover",
    label: "End note",
  },
];

function pairPages(allPages: NotebookPage[]): NotebookSheet[] {
  const sheets: NotebookSheet[] = [];
  for (let index = 0; index < allPages.length; index += 2) {
    const backIndex = Math.min(index + 1, allPages.length - 1);
    sheets.push({
      front: allPages[index],
      frontIndex: index,
      back: allPages[backIndex],
      backIndex,
    });
  }
  return sheets;
}

export function NotebookCover({ className = "", ariaLabel, ariaHidden = false }: { className?: string; ariaLabel?: string; ariaHidden?: boolean }) {
  return (
    <article
      className={`notebook-page is-cover is-photo-cover${className ? ` ${className}` : ""}`}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden || undefined}
    >
      <img className="notebook-cover-art" src={notebookCoverImage} alt="" draggable={false} />
      <div className="notebook-cover-band" aria-hidden="true">
        <span>PAROSAYSHI</span>
        <strong>FIELD NOTES</strong>
        <span>VOL. 01 / ONGOING</span>
      </div>
    </article>
  );
}

function NotebookPageFace({ page, pageIndex }: { page: NotebookPage; pageIndex: number }) {
  const isFrontCover = page.kind === "cover" && pageIndex === 0;

  if (isFrontCover) return <NotebookCover ariaLabel={page.alt} />;

  return (
    <article className={`notebook-page is-${page.kind}`} aria-label={page.alt}>
      <p className="notebook-page-running-head">PAROSAYSHI / {String(pageIndex + 1).padStart(2, "0")}</p>

      {page.image ? (
        <figure className="notebook-page-figure">
          <img src={page.image} alt={page.alt} draggable={false} />
        </figure>
      ) : (
        <strong className="notebook-cover-title">More{"\n"}soon</strong>
      )}

      <div className="notebook-page-footer">
        <span>{page.label}</span>
        <span>{String(pageIndex + 1).padStart(2, "0")}</span>
      </div>
    </article>
  );
}

interface SketchbookProps {
  openSlip?: (card: HTMLElement) => void;
  variant?: "preview" | "expanded";
}

export function Sketchbook({ openSlip, variant = "preview" }: SketchbookProps) {
  const reducedMotion = useReducedMotion();
  const sheets = useMemo(() => pairPages(pages), []);
  const [currentLeaf, setCurrentLeaf] = useState(0);
  const [currentMobilePage, setCurrentMobilePage] = useState(0);
  const [mobileDirection, setMobileDirection] = useState(1);
  const [mobileHasTurned, setMobileHasTurned] = useState(false);
  const [isMobileReader, setIsMobileReader] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches,
  );
  const [turningIndex, setTurningIndex] = useState<number | null>(null);
  const pointerStart = useRef<{ pointerId: number; x: number } | null>(null);
  const didSwipe = useRef(false);

  useEffect(() => {
    if (variant !== "expanded") return;
    pages.forEach((page) => {
      if (!page.image) return;
      const image = new Image();
      image.src = page.image;
    });
  }, [variant]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const updateReaderMode = () => setIsMobileReader(mobileQuery.matches);
    updateReaderMode();
    mobileQuery.addEventListener("change", updateReaderMode);
    return () => mobileQuery.removeEventListener("change", updateReaderMode);
  }, []);

  const turnTo = (nextLeaf: number, sheetIndex: number) => {
    if (turningIndex !== null || nextLeaf < 0 || nextLeaf > sheets.length) return;
    setCurrentLeaf(nextLeaf);
    if (!reducedMotion) setTurningIndex(sheetIndex);
  };

  const previousPage = () => {
    if (currentLeaf <= 0) return;
    turnTo(currentLeaf - 1, currentLeaf - 1);
  };

  const nextPage = () => {
    if (currentLeaf >= sheets.length) return;
    turnTo(currentLeaf + 1, currentLeaf);
  };

  const previousMobilePage = () => {
    if (currentMobilePage <= 0) return;
    setMobileDirection(-1);
    setMobileHasTurned(true);
    setCurrentMobilePage((page) => page - 1);
  };

  const nextMobilePage = () => {
    if (currentMobilePage >= pages.length - 1) return;
    setMobileDirection(1);
    setMobileHasTurned(true);
    setCurrentMobilePage((page) => page + 1);
  };

  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (isMobileReader) previousMobilePage();
      else previousPage();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (isMobileReader) nextMobilePage();
      else nextPage();
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (turningIndex !== null) return;
    pointerStart.current = { pointerId: event.pointerId, x: event.clientX };
    didSwipe.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.pointerId !== event.pointerId) return;
    const distance = event.clientX - start.x;
    if (Math.abs(distance) < 38) return;
    didSwipe.current = true;
    if (distance < 0) {
      if (isMobileReader) nextMobilePage();
      else nextPage();
    } else if (isMobileReader) previousMobilePage();
    else previousPage();
  };

  const handleBookClick = (event: MouseEvent<HTMLDivElement>) => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left + bounds.width / 2) {
      if (isMobileReader) previousMobilePage();
      else previousPage();
    } else if (isMobileReader) nextMobilePage();
    else nextPage();
  };

  if (variant === "preview") {
    return (
      <section className="sketchbook-section is-preview section-reveal" aria-labelledby="sketchbook-title">
        <div className="sketchbook-heading">
          <p>Loose pages / 01&ndash;06</p>
          <h2 id="sketchbook-title">Things that stayed in the notebook.</h2>
        </div>

        <button
          className="sketchbook-preview"
          type="button"
          aria-label="Open the field notebook"
          aria-haspopup="dialog"
          aria-expanded="false"
          data-project="notebook"
          onClick={(event) => openSlip?.(event.currentTarget)}
        >
          <NotebookCover className="notebook-preview-cover" ariaHidden />
        </button>

        <div className="sketchbook-footer">
          <p>Click the notebook to open it</p>
          <p>01 / {String(pages.length).padStart(2, "0")}</p>
        </div>
      </section>
    );
  }

  const isFrontCover = currentLeaf === 0;
  const isBackCover = currentLeaf === sheets.length;
  const visiblePageIndex = isBackCover ? pages.length - 1 : Math.min(currentLeaf * 2, pages.length - 1);
  const shownPage = pages[visiblePageIndex];
  const pageStatus = isFrontCover
    ? `Cover 01 / ${String(pages.length).padStart(2, "0")}`
    : isBackCover
      ? `Back cover ${String(pages.length).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`
      : `Pages ${String(currentLeaf * 2).padStart(2, "0")}–${String(currentLeaf * 2 + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`;
  const coverPosition = isFrontCover ? " is-front-cover" : isBackCover ? " is-back-cover" : "";

  if (isMobileReader) {
    const mobilePage = pages[currentMobilePage];

    return (
      <section className="sketchbook-section is-expanded" aria-labelledby="expanded-sketchbook-title">
        <div className="sketchbook-heading">
          <p>Loose pages / 01&ndash;06</p>
          <h2 id="expanded-sketchbook-title">Things that stayed in the notebook.</h2>
        </div>

        <div className="sketchbook-realism is-mobile-single" onKeyDown={handleKeys}>
          <div className="sketchbook-stage is-mobile-single-stage">
            <div
              className="mobile-notebook-book"
              role="group"
              aria-label="Interactive field notebook"
              aria-live="polite"
              tabIndex={0}
              onClick={handleBookClick}
              onPointerCancel={() => {
                pointerStart.current = null;
              }}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
            >
              <motion.div
                className="mobile-notebook-page-shell"
                key={currentMobilePage}
                initial={
                  reducedMotion || !mobileHasTurned
                    ? false
                    : { opacity: 0.9, rotate: mobileDirection > 0 ? 0.7 : -0.7, x: mobileDirection * 20 }
                }
                animate={{ opacity: 1, rotate: 0, x: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                <NotebookPageFace page={mobilePage} pageIndex={currentMobilePage} />
              </motion.div>
            </div>
          </div>

        </div>

        <div className="sketchbook-footer">
          <p>{mobilePage.caption}</p>
          <p>
            {String(currentMobilePage + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="sketchbook-section is-expanded" aria-labelledby="expanded-sketchbook-title">
      <div className="sketchbook-heading">
        <p>Loose pages / 01&ndash;06</p>
        <h2 id="expanded-sketchbook-title">Things that stayed in the notebook.</h2>
      </div>

      <div className={`sketchbook-realism${coverPosition}`} onKeyDown={handleKeys}>
        <div className="sketchbook-stage">
          <div
            className="css-flipbook-book"
            role="group"
            aria-label="Interactive field notebook"
            aria-live="polite"
            tabIndex={0}
            onClick={handleBookClick}
            onPointerCancel={() => {
              pointerStart.current = null;
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {sheets.map((sheet, index) => {
              const isFlipped = index < currentLeaf;
              const isTurning = index === turningIndex;
              const depth = (isFlipped ? index + 1 : sheets.length - index) * 0.35;
              const style = {
                "--sheet-depth": `${depth}px`,
                "--sheet-rotation": isFlipped ? "-180deg" : "0deg",
                "--turn-duration": reducedMotion ? "0ms" : "760ms",
                zIndex: isTurning ? sheets.length + 10 : isFlipped ? index + 1 : sheets.length - index,
              } as CSSProperties;

              return (
                <div
                  className={`css-flipbook-sheet${isFlipped ? " is-flipped" : ""}${isTurning ? " is-turning" : ""}`}
                  key={`${sheet.frontIndex}-${sheet.backIndex}`}
                  style={style}
                  onTransitionEnd={(event) => {
                    if (event.propertyName === "transform" && isTurning) setTurningIndex(null);
                  }}
                >
                  <div className="css-flipbook-face is-front" aria-hidden={index !== currentLeaf}>
                    <NotebookPageFace page={sheet.front} pageIndex={sheet.frontIndex} />
                  </div>
                  <div className="css-flipbook-face is-back" aria-hidden={index !== currentLeaf - 1}>
                    <NotebookPageFace page={sheet.back} pageIndex={sheet.backIndex} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="sketchbook-footer">
        <p>{shownPage.caption}</p>
        <p>{pageStatus}</p>
      </div>
    </section>
  );
}
