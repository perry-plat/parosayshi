import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { projects } from "./data/projects";
import { workCards } from "./data/workCards";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useSlip } from "./hooks/useSlip";
import { PaperSurface } from "./components/PaperSurface";
import { NotebookSlip } from "./components/NotebookSlip";
import { ProjectSlip } from "./components/ProjectSlip";
import { Sketchbook } from "./components/Sketchbook";
import type { ProjectId } from "./types/project";

function getIssueDate() {
  const now = new Date();
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(now).toUpperCase();

  return {
    day: String(now.getDate()).padStart(2, "0"),
    label: `${month} '${String(now.getFullYear()).slice(-2)}`,
  };
}

function PaperLoader() {
  const [hasStarted, setHasStarted] = useState(false);

  const completeArrival = useCallback(() => {
    document.body.classList.remove("is-loading");
    document.body.classList.remove("is-entering");
    document.body.classList.add("is-loaded");
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      completeArrival();
      return;
    }

    const hero = new Image();
    let completionTimer = 0;
    let frame = 0;
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      frame = window.requestAnimationFrame(() => {
        document.body.classList.add("is-entering");
        setHasStarted(true);
        completionTimer = window.setTimeout(completeArrival, 3250);
      });
    };

    hero.src = "/assets/new/hero.png";
    if (hero.complete) void hero.decode().catch(() => undefined).finally(start);
    else {
      hero.addEventListener("load", start, { once: true });
      hero.addEventListener("error", start, { once: true });
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(completionTimer);
    };
  }, [completeArrival]);

  return (
    <div className={`paper-loader${hasStarted ? " is-active" : ""}`} role="status" aria-live="polite" aria-label="Loading Parosayshi newspaper">
      <strong className="loader-title">PAROSAYSHI</strong>
    </div>
  );
}

const stoneCanvasOptions = [
  { label: "Chalk", value: "#f0efeb" },
  { label: "Warm limestone", value: "#ece4d9" },
  { label: "Quiet stone", value: "#e6e3dd" },
  { label: "Weathered stone", value: "#d6d2cb" },
  { label: "Concrete", value: "#c8c5be" },
];

const defaultCanvas = stoneCanvasOptions[1].value;

function PageRails({ canvas, setCanvas }: { canvas: string; setCanvas: (canvas: string) => void }) {
  return (
    <>
      <aside className="page-rail page-rail-left" aria-label="Issue controls">
        <a className="rail-stamp" href="/" aria-label="Parosayshi home">PS</a>
        <div className="canvas-switcher" role="group" aria-label="Test page background">
          {stoneCanvasOptions.map((option) => (
            <button
              aria-label={`Set background to ${option.label}`}
              aria-pressed={canvas === option.value}
              className="canvas-swatch"
              key={option.value}
              onClick={() => setCanvas(option.value)}
              style={{ "--swatch-color": option.value } as CSSProperties}
              title={option.label}
              type="button"
            />
          ))}
        </div>
      </aside>
      <aside className="page-rail page-rail-right" aria-label="Portfolio links">
        <a className="rail-resume" href="https://drive.google.com/file/d/1t2szuLpJstQ-ktsZ5rvWYJ8svIZWmhT2/view?usp=sharing" target="_blank" rel="noopener noreferrer">Resume</a>
        <a href="mailto:hello@parosayshi.com">SAY HELLO</a>
      </aside>
      <nav className="mobile-action-bar" aria-label="Portfolio actions">
        <a href="mailto:hello@parosayshi.com">HELLO</a>
        <a href="https://drive.google.com/file/d/1t2szuLpJstQ-ktsZ5rvWYJ8svIZWmhT2/view?usp=sharing" target="_blank" rel="noopener noreferrer">Resume</a>
      </nav>
    </>
  );
}

function Masthead() {
  const issueDate = getIssueDate();

  return (
    <header className="masthead section-reveal">
      <div className="issue-date" aria-label="Issue date">
        <strong>{issueDate.day}</strong>
        <span>{issueDate.label}</span>
      </div>
      <span className="brand-mark" aria-label="Parosayshi" />
      <span className="masthead-folio">PRODUCT DESIGN FOLIO</span>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section-reveal">
      <div className="headline-block">
        <h1>“I will keep designing for fun even in this economy”</h1>
        <p>
          says Parth Jha, an AI optimist, <span className="hero-highlight">who believes <strong>intentmaxxxing</strong> is the solution</span>
        </p>
      </div>

      <figure className="hero-image">
        <img src="/assets/new/hero.png" alt="Parth smiling while petting a dog in Shangarh, Himachal Pradesh" />
        <figcaption>~ Shangarh, Himachal Pradesh, India</figcaption>
      </figure>
    </section>
  );
}

function IntroColumns() {
  return (
    <section className="intro-columns section-reveal" aria-label="Introduction">
      <p>
        A <strong>technical product designer</strong> wanting to make sense to himself goes all out on platforms like i
        ask, i explore, i tinker&mdash; designing to make technology feel more human.
        <br />
        currently at [@airtribe]
      </p>
      <p>
        Product strategy, systems thinking, slightly obsessive prototyping, and a few notes from the margins.
        <br />
        <strong>Open a dispatch</strong> to read the full story.
      </p>
    </section>
  );
}

function WorkSection({ openSlip }: { openSlip: (card: HTMLElement) => void }) {
  return (
    <section className="work-section section-reveal" aria-label="Selected work">
      <div className="work-rail" tabIndex={0} aria-label="Horizontally scrollable selected work cards">
        {workCards.map((card) => (
          <article
            className="work-card project-card"
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            aria-expanded="false"
            data-project={card.id}
            data-edition={card.edition.toLowerCase().replace(" ", "-")}
            data-slip-tilt={card.tilt}
            key={card.id}
            onClick={(event) => openSlip(event.currentTarget)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openSlip(event.currentTarget);
              }
            }}
          >
            <h3>{card.title}</h3>
            <figure className="work-card-image">
              <img src={card.image} alt={card.alt} />
            </figure>
            <div className="work-card-rule" aria-hidden="true" />
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="experience section-reveal" aria-label="Experience">
      <div className="experience-head">
        <h2>Notes from the working desk.</h2>
      </div>

      <div className="experience-stack">
        <img className="sticker-hand" src="/assets/new/logo-sticker.svg" alt="" aria-hidden="true" />
        <article className="experience-card role-card">
          <p>Superr</p>
        </article>
        <article className="experience-card">
          <p>
            A <strong>technical product designer</strong> wanting to make sense to himself goes all out on platforms
            like i ask, i explore
          </p>
        </article>
      </div>

      <img className="tilt-sticker" src="/assets/new/sticker.png" alt="" aria-hidden="true" />
    </section>
  );
}

function ExperimentsSection() {
  return (
    <>
      <div className="rule" aria-hidden="true" />

      <section className="image-placeholder section-reveal" aria-label="Experiment image placeholder">
        <div aria-hidden="true" />
      </section>
    </>
  );
}

function isProjectId(id: string | undefined): id is ProjectId {
  return Boolean(id && Object.prototype.hasOwnProperty.call(projects, id));
}

export default function App() {
  const paperRef = useRef<HTMLElement | null>(null);
  const slipRef = useRef<HTMLElement | null>(null);
  const [canvas, setCanvas] = useState(defaultCanvas);
  const reducedMotion = useReducedMotion();
  const { activeProject, closeSlip, finishClose, openSlip, slipState } = useSlip({
    paperRef,
    slipRef,
    reducedMotion,
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--page-table", canvas);
    return () => {
      document.documentElement.style.removeProperty("--page-table");
    };
  }, [canvas]);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!isProjectId(id)) return;
    const frame = window.requestAnimationFrame(() => {
      const card = document.querySelector<HTMLElement>(`[data-project="${id}"]`);
      if (card) openSlip(card, false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openSlip]);

  return (
    <>
      <PaperLoader />
      <PageRails canvas={canvas} setCanvas={setCanvas} />
      <main className="newspaper-shell">
        <article className="paper" aria-label="Parosayshi newspaper homepage" ref={paperRef}>
          <PaperSurface />
          <Masthead />
          <div className="rule" aria-hidden="true" />
          <Hero />
          <IntroColumns />
          <div className="rule" aria-hidden="true" />
          <WorkSection openSlip={openSlip} />
          <div className="rule" aria-hidden="true" />
          <Sketchbook openSlip={openSlip} />
          <div className="rule" aria-hidden="true" />
          <ExperienceSection />
          <div className="rule" aria-hidden="true" />
          <ExperimentsSection />
          <div className="rule final-rule" aria-hidden="true" />
        </article>
      </main>

      {slipState !== "closed" && activeProject ? (
        <div className="slip-overlay">
          <div className="slip-scrim" data-slip-close aria-hidden="true" onClick={() => closeSlip()} />
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
              reducedMotion={reducedMotion}
              slipState={slipState}
              onCloseAnimationComplete={finishClose}
            />
          )}
        </div>
      ) : null}
    </>
  );
}
