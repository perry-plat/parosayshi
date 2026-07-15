import { useEffect, useRef, type CSSProperties } from "react";
import { LayoutGroup, motion } from "motion/react";
import { BookVolumeVisual } from "./components/BookVolumeVisual";
import { NotebookSlip } from "./components/NotebookSlip";
import { ProjectSlip } from "./components/ProjectSlip";
import { NotebookCover } from "./components/Sketchbook";
import { projects } from "./data/projects";
import { workCards } from "./data/workCards";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useSlip } from "./hooks/useSlip";
import type { ProjectId } from "./types/project";

interface BookEdition {
  id: ProjectId;
  number: string;
  coverTitle: string;
  coverLine: string;
  coverArt: string;
  coverArtScale: string;
  image: string;
  x: string;
  y: string;
  width: string;
  height: string;
  rotate: string;
  cover: string;
  ink: string;
  accent: string;
  format?: "portrait" | "landscape";
  imagePosition?: string;
  z: string;
}

const cardById = new Map(workCards.map((card) => [card.id, card]));

const bookEditions: BookEdition[] = [
  {
    id: "wiz-commerce",
    number: "01",
    coverTitle: "WizCommerce",
    coverLine: "The product touchpoints edition",
    coverArt: "/assets/new/book-covers/wiz-commerce-cover.png",
    coverArtScale: "1.13",
    image: "/assets/new/wizcommerce-frame32/hero-dashboard.png",
    x: "calc(50% - min(390px, 31vw) - 330px)",
    y: "1020px",
    width: "570px",
    height: "730px",
    rotate: "-13deg",
    cover: "#772739",
    ink: "#f9ead3",
    accent: "#f3a647",
    z: "8",
  },
  {
    id: "uber-kids",
    number: "04",
    coverTitle: "Small riders, big rules",
    coverLine: "Designing a safer Uber Kids onboarding",
    coverArt: "/assets/new/book-covers/uber-kids-cover.png",
    coverArtScale: "1.13",
    image: "/assets/new/uber-kids/invite-hero.png",
    x: "calc(50% + min(390px, 31vw) - 190px)",
    y: "1310px",
    width: "485px",
    height: "649px",
    rotate: "12deg",
    cover: "#edc844",
    ink: "#1d2940",
    accent: "#f46e46",
    imagePosition: "center 38%",
    z: "7",
  },
  {
    id: "wiz-sales-data",
    number: "02",
    coverTitle: "Signals for the sales floor",
    coverLine: "Making product data useful in the moment",
    coverArt: "/assets/new/book-covers/wiz-sales-data-cover.png",
    coverArtScale: "1.12",
    image: "/assets/case-studies/f2MFjaGV3u8MAIXdzRO9fHE2wc.png",
    x: "calc(50% - min(390px, 31vw) - 230px)",
    y: "1950px",
    width: "520px",
    height: "664px",
    rotate: "11deg",
    cover: "#2459cc",
    ink: "#fff9e9",
    accent: "#d8ff3f",
    z: "12",
  },
  {
    id: "wiz-email-flows",
    number: "03",
    coverTitle: "The mailroom manual",
    coverLine: "Anything and everything about automated email",
    coverArt: "/assets/new/book-covers/wiz-email-flows-cover.png",
    coverArtScale: "1.1",
    image: "/assets/case-studies/7pNOxoU2UIQLghgLPRTMAgwU1AE.png",
    x: "calc(50% + min(390px, 31vw) - 280px)",
    y: "2200px",
    width: "460px",
    height: "600px",
    rotate: "-13deg",
    cover: "#eb623e",
    ink: "#231f1c",
    accent: "#f6d54a",
    z: "9",
  },
  {
    id: "notebook",
    number: "00",
    coverTitle: "Things that stayed in the notebook",
    coverLine: "Loose ideas, interface studies, and unfinished thoughts",
    coverArt: "/assets/new/notebook-cover-cutout-tight-v3.png",
    coverArtScale: "1",
    image: "/assets/new/notebook-cover-key-v2.png",
    x: "calc(50% - 225px)",
    y: "4900px",
    width: "450px",
    height: "675px",
    rotate: "1.5deg",
    cover: "#25211d",
    ink: "#f4ead7",
    accent: "#db4f39",
    z: "9",
  },
  {
    id: "farevv",
    number: "06",
    coverTitle: "Farevv.",
    coverLine: "An anti-portfolio, bound anyway",
    coverArt: "/assets/new/book-covers/farevv-cover.png",
    coverArtScale: "1.05",
    image: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png",
    x: "calc(50% - min(390px, 31vw) - 260px)",
    y: "2880px",
    width: "445px",
    height: "590px",
    rotate: "-11deg",
    cover: "#c8b9eb",
    ink: "#2f2350",
    accent: "#ff694f",
    z: "10",
  },
  {
    id: "kriyadex",
    number: "05",
    coverTitle: "KriyaDex",
    coverLine: "A logo walks into a system",
    coverArt: "/assets/new/book-covers/kriyadex-cover.png",
    coverArtScale: "1.11",
    image: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png",
    x: "calc(50% + min(390px, 31vw) - 155px)",
    y: "3200px",
    width: "430px",
    height: "568px",
    rotate: "15deg",
    cover: "#b8d79e",
    ink: "#20351f",
    accent: "#27744d",
    z: "11",
  },
  {
    id: "curo",
    number: "07",
    coverTitle: "Curo.",
    coverLine: "Learning in public / an MVP in progress",
    coverArt: "/assets/new/book-covers/curo-cover.png",
    coverArtScale: "1.11",
    image: "/assets/lREVKnbZDxTdgCdlTMAcEQXvxE.png",
    x: "calc(50% - min(390px, 31vw) - 285px)",
    y: "3900px",
    width: "450px",
    height: "594px",
    rotate: "-9deg",
    cover: "#a6d9e9",
    ink: "#183442",
    accent: "#f05d45",
    z: "6",
  },
];

function isProjectId(id: string | undefined): id is ProjectId {
  return Boolean(id && Object.prototype.hasOwnProperty.call(projects, id));
}

function BookObject({
  edition,
  isExpanded,
  openSlip,
}: {
  edition: BookEdition;
  isExpanded: boolean;
  openSlip: (card: HTMLElement) => void;
}) {
  const card = cardById.get(edition.id);
  const style = {
    "--book-x": edition.x,
    "--book-y": edition.y,
    "--book-w": edition.width,
    "--book-h": edition.height,
    "--book-aspect": `${Number.parseFloat(edition.width)} / ${Number.parseFloat(edition.height)}`,
    "--book-rotate": edition.rotate,
    "--book-cover": edition.cover,
    "--book-cover-art": `url(${edition.coverArt})`,
    "--book-cover-art-scale": edition.coverArtScale,
    "--book-ink": edition.ink,
    "--book-accent": edition.accent,
    "--book-z": edition.z,
    "--book-image-position": edition.imagePosition || "center",
  } as CSSProperties;

  return (
    <button
      className="book-object"
      data-format={edition.format || "portrait"}
      data-project={edition.id}
      aria-haspopup="dialog"
      aria-expanded={isExpanded}
      aria-label={`Open ${card?.title || edition.coverTitle}`}
      onClick={(event) => openSlip(event.currentTarget)}
      style={style}
      type="button"
    >
      {edition.id === "notebook" ? (
        <NotebookCover className="notebook-desk-cover" ariaHidden />
      ) : (
        <BookVolumeVisual
          cover={{
            art: edition.coverArt,
            artScale: edition.coverArtScale,
            color: edition.cover,
            ink: edition.ink,
            line: edition.coverLine,
            number: edition.number,
            title: edition.coverTitle,
          }}
          edition={card?.edition}
          layoutId={`desk-book-${edition.id}`}
        />
      )}
      <span className="book-open-label" aria-hidden="true">Open book ↗</span>
    </button>
  );
}

export default function App() {
  const paperRef = useRef<HTMLElement | null>(null);
  const slipRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { activeProject, closeSlip, finishClose, openSlip, slipState } = useSlip({
    paperRef,
    slipRef,
    reducedMotion,
  });

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!isProjectId(id)) return;
    const frame = window.requestAnimationFrame(() => {
      const book = document.querySelector<HTMLElement>(`[data-project="${id}"]`);
      if (book) openSlip(book, false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openSlip]);

  return (
    <LayoutGroup id="portfolio-books">
      <main className="folio-scene">
        <header className="studio-header">
          <a className="holo-brand-sticker" href="/" aria-label="Parosayshi home">
            <img src="/assets/new/parosayshi-wordmark.svg" alt="Parosayshi" />
          </a>
          <nav aria-label="Portfolio links">
            <a href="https://drive.google.com/file/d/1t2szuLpJstQ-ktsZ5rvWYJ8svIZWmhT2/view?usp=sharing" target="_blank" rel="noopener noreferrer">RESUME ↗</a>
            <a href="mailto:hello@parosayshi.com">SAY HELLO ↗</a>
          </nav>
        </header>

        <section className="book-table" aria-labelledby="library-title">
          <div className="folio-fold-stage">
            <span className="folio-flight-shadow" aria-hidden="true" />
            <motion.article
              animate={{
                opacity: 1,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                x: 0,
                y: 0,
              }}
              className="folio-sheet"
              initial={reducedMotion ? false : {
                opacity: 0,
                rotateX: 17,
                rotateY: -11,
                rotateZ: 4,
                scale: 0.945,
                x: 96,
                y: -168,
              }}
              ref={paperRef}
              transition={reducedMotion ? { duration: 0 } : {
                opacity: { duration: 0.38, ease: "easeOut" },
                rotateX: { type: "spring", stiffness: 54, damping: 14, mass: 1.1 },
                rotateY: { type: "spring", stiffness: 58, damping: 15, mass: 1.05 },
                rotateZ: { type: "spring", stiffness: 60, damping: 15, mass: 1 },
                scale: { type: "spring", stiffness: 62, damping: 15, mass: 1.05 },
                x: { type: "spring", stiffness: 58, damping: 14, mass: 1.05 },
                y: { type: "spring", stiffness: 54, damping: 13, mass: 1.05 },
              }}
            >
              <div className="sheet-kicker">
                <span>PARTH JHA / PRODUCT DESIGNER</span>
                <span>INDIA — 2026</span>
              </div>
              <h1 id="library-title">“I will keep designing for fun even in this economy”</h1>
              <p className="sheet-byline">
                says Parth Jha, an AI optimist who believes <strong>intentmaxxxing</strong> is the solution.
              </p>
              <div className="sheet-columns">
                <p>
                  A <strong>technical product designer</strong> wanting to make sense to himself goes all out on
                  platforms like i ask, i explore, i tinker—designing to make technology feel more human.
                </p>
                <p>
                  Product strategy, systems thinking, slightly obsessive prototyping, and a few notes from the margins.
                  Pick up a book to read the full story.
                </p>
              </div>
              <div className="sheet-colophon">
                <span>CURRENTLY AT<br />[@AIRTRIBE]</span>
                <span>SYSTEMS THINKING<br />PROTOTYPING + PLAY</span>
                <span>HELLO@PAROSAYSHI.COM</span>
              </div>
            </motion.article>
          </div>

          <div className="book-layer" aria-label="Case-study books">
            {bookEditions.filter((edition) => edition.id !== "notebook").map((edition) => (
              <BookObject
                edition={edition}
                isExpanded={activeProject === edition.id && slipState !== "closing"}
                key={edition.id}
                openSlip={openSlip}
              />
            ))}
            <div className="notebook-library-heading">
              <span>FIELD NOTES / ONGOING</span>
              <h2>Things that stayed in the notebook.</h2>
            </div>
            {bookEditions.filter((edition) => edition.id === "notebook").map((edition) => (
              <BookObject
                edition={edition}
                isExpanded={activeProject === edition.id && slipState !== "closing"}
                key={edition.id}
                openSlip={openSlip}
              />
            ))}
          </div>
        </section>

        <footer className="studio-footer">
          <span>THE LIBRARY WILL KEEP CHANGING.</span>
          <span>© 2026 PAROSAYSHI</span>
        </footer>
      </main>

      {slipState !== "closed" && activeProject ? (
        <div className="slip-overlay">
          <button className="slip-close-button" type="button" aria-label="Close book" onClick={() => closeSlip()}>
            <span aria-hidden="true">×</span>
          </button>
          {activeProject === "notebook" ? (
            <NotebookSlip
              ref={slipRef}
              reducedMotion={reducedMotion}
              slipState={slipState}
              onCloseAnimationComplete={finishClose}
            />
          ) : (
            <ProjectSlip
              ref={slipRef}
              project={projects[activeProject]}
              projectId={activeProject}
              cover={{
                color: bookEditions.find((edition) => edition.id === activeProject)?.cover || "#34302b",
                art: bookEditions.find((edition) => edition.id === activeProject)?.coverArt || "",
                artScale: bookEditions.find((edition) => edition.id === activeProject)?.coverArtScale || "1",
                ink: bookEditions.find((edition) => edition.id === activeProject)?.ink || "#f5eee3",
                line: bookEditions.find((edition) => edition.id === activeProject)?.coverLine || "A product design case study",
                number: bookEditions.find((edition) => edition.id === activeProject)?.number || "00",
                title: bookEditions.find((edition) => edition.id === activeProject)?.coverTitle || projects[activeProject].title,
              }}
              reducedMotion={reducedMotion}
              slipState={slipState}
              onCloseAnimationComplete={finishClose}
            />
          )}
        </div>
      ) : null}
    </LayoutGroup>
  );
}
