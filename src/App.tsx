import { useEffect, useRef } from "react";
import { projects } from "./data/projects";
import { workCards } from "./data/workCards";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useSlip } from "./hooks/useSlip";
import { useTheme } from "./hooks/useTheme";
import { ProjectSlip } from "./components/ProjectSlip";
import type { ProjectId } from "./types/project";

function PaperLoader() {
  useEffect(() => {
    const startedAt = performance.now();
    const finish = () => {
      const remaining = Math.max(0, 760 - (performance.now() - startedAt));
      window.setTimeout(() => {
        document.body.classList.remove("is-loading");
        document.body.classList.add("is-loaded");
      }, remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => window.removeEventListener("load", finish);
  }, []);

  return (
    <div className="paper-loader" role="status" aria-live="polite" aria-label="Loading Parosayshi newspaper">
      <div className="loader-sheet" aria-hidden="true">
        <div className="loader-mast">
          <span>
            05
            <br />
            JUL
          </span>
          <strong>PAROSAYSHI</strong>
          <span>'26</span>
        </div>
        <div className="loader-rule" />
        <p>
          DESIGNING
          <br />
          FOR FUN
        </p>
        <div className="loader-photo" />
      </div>
    </div>
  );
}

function Masthead() {
  const { randomizeTheme, theme } = useTheme();

  return (
    <header className="masthead section-reveal">
      <div className="issue-date" aria-label="Issue date">
        <strong>05</strong>
        <span>JUL '26</span>
      </div>
      <a className="brand-mark" href="/" aria-label="Parosayshi home" />
      <div className="masthead-actions">
        <button
          className="theme-randomizer"
          type="button"
          aria-label="Randomize theme"
          title="Randomize theme"
          data-theme={theme}
          onClick={randomizeTheme}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
            <path d="M5 12h14M14 7l5 5-5 5M9 7l-4 5 4 5" />
          </svg>
        </button>
        <a
          className="resume-link"
          href="https://drive.google.com/file/d/1t2szuLpJstQ-ktsZ5rvWYJ8svIZWmhT2/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          RESUME
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section-reveal">
      <div className="headline-block">
        <h1>“I will keep designing for fun even in this economy”</h1>
        <p>
          says Parth Jha, an AI optimist, who believes <strong>intentmaxxxing</strong> is the solution
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
        A <strong>technical product designer</strong> wanting to make sense to himself goes all out on platforms like i
        ask, i explore, i tinker&mdash; designing to make technology feel more human.
        <br />
        currently at [@airtribe]
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
        <p className="eyebrow">EXPERIENCE</p>
        <h2>“I will keep designing for fun even in this economy”</h2>
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
      <section className="experiments section-reveal" aria-label="Experiments">
        <p className="eyebrow">EXPERIMENTS</p>
      </section>

      <div className="rule" aria-hidden="true" />

      <section className="image-placeholder section-reveal" aria-label="Experiment image placeholder">
        <div aria-hidden="true" />
      </section>
    </>
  );
}

function stateClass(slipState: string) {
  if (slipState === "prepping") return "is-prepping";
  if (slipState === "open") return "is-open";
  if (slipState === "closing") return "is-closing";
  return "";
}

function isProjectId(id: string | undefined): id is ProjectId {
  return Boolean(id && Object.prototype.hasOwnProperty.call(projects, id));
}

export default function App() {
  const paperRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const slipRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { activeProject, closeSlip, openSlip, slipState } = useSlip({
    paperRef,
    overlayRef,
    slipRef,
    reducedMotion,
  });

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!isProjectId(id)) return;
    const frame = window.requestAnimationFrame(() => {
      const card = document.querySelector<HTMLElement>(`.project-card[data-project="${id}"]`);
      if (card) openSlip(card, false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openSlip]);

  return (
    <>
      <PaperLoader />
      <main className="newspaper-shell">
        <article className="paper" aria-label="Parosayshi newspaper homepage" ref={paperRef}>
          <Masthead />
          <div className="rule" aria-hidden="true" />
          <Hero />
          <IntroColumns />
          <div className="rule" aria-hidden="true" />
          <WorkSection openSlip={openSlip} />
          <div className="rule" aria-hidden="true" />
          <ExperienceSection />
          <div className="rule" aria-hidden="true" />
          <ExperimentsSection />
          <div className="rule final-rule" aria-hidden="true" />
        </article>
      </main>

      <div className="slip-overlay" hidden={slipState === "closed"} ref={overlayRef}>
        <div className="slip-scrim" data-slip-close aria-hidden="true" onClick={() => closeSlip()} />
        <ProjectSlip
          ref={slipRef}
          project={activeProject ? projects[activeProject] : null}
          stateClass={stateClass(slipState)}
        />
      </div>
    </>
  );
}
