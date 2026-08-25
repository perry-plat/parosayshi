import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ProjectId } from "../types/project";
import { WallLightShader } from "./WallLightShader";

interface InvoiceFolioHomeProps {
  onOpenProject: (id: ProjectId, trigger: HTMLElement) => void;
  reducedMotion: boolean;
}

const RESUME_URL =
  "https://drive.google.com/file/d/1t2szuLpJstQ-ktsZ5rvWYJ8svIZWmhT2/view?usp=sharing";

// Keep the accepted final light study as the permanent wall treatment.
const WALL_LIGHT_COLOR = "#fffdf5";
const WALL_GLOW_COLOR = "#ead4a6";

const chapters = [
  { id: "home", label: "Hi, I am Parth" },
  { id: "work", label: "Selected work" },
  { id: "about", label: "About / contact" },
];

const projectPlaceholderColumns = [
  [
    { ratio: "landscape", tone: "warm" },
    { ratio: "square", tone: "charcoal" },
    { ratio: "landscape", tone: "sage" },
  ],
  [
    { ratio: "square", tone: "cobalt" },
    { ratio: "landscape", tone: "paper" },
    { ratio: "square", tone: "clay" },
  ],
] as const;

export function InvoiceFolioHome({ reducedMotion }: InvoiceFolioHomeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const firstLink = menuRef.current?.querySelector<HTMLElement>("a, button");
    document.body.style.overflow = "hidden";
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="invoice-folio invoice-folio--wall">
      <button
        aria-expanded={menuOpen}
        aria-controls="folio-index-menu"
        className="folio-index-tab"
        onClick={() => setMenuOpen((open) => !open)}
        ref={menuButtonRef}
        type="button"
      >
        <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        <span>{menuOpen ? "Close" : "Index"}</span>
      </button>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              aria-label="Close index"
              className="folio-index-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              type="button"
            />
            <motion.nav
              aria-label="Portfolio index"
              className="folio-index-menu"
              id="folio-index-menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.76, 0, 0.24, 1] }}
              ref={menuRef}
            >
              <p className="folio-index-menu__kicker">Parosayshi / Index</p>
              <ol>
                {chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <a href={`#${chapter.id}`} onClick={closeMenu}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {chapter.label}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="folio-index-menu__footer">
                <a href={RESUME_URL} rel="noreferrer" target="_blank">Resume ↗</a>
                <a href="https://x.com/parosayshi" rel="noreferrer" target="_blank">X / @parosayshi ↗</a>
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>

      <section aria-label="Parosayshi introduction" className="wall-folio wall-folio--hero" id="home">
        <WallLightShader glowColor={WALL_GLOW_COLOR} lightColor={WALL_LIGHT_COLOR} reducedMotion={reducedMotion} />
        <div aria-hidden="true" className="wall-folio__grain" />
        <p className="wall-folio__shadow-wordmark">Paro says hi</p>
        <div className="wall-folio__figma-intro" data-node-id="73:1458">
          <p>
            <span className="wall-folio__figma-heading">
              <strong>Hi, I am Parth</strong>
              <span aria-hidden="true" className="wall-folio__figma-sticker" />
            </span>
            <span className="wall-folio__figma-body">
              A product designer from Bangalore, India. Someone obsessed
            </span>
          </p>
          <p><em>with how things feel</em></p>
        </div>
      </section>

      <section aria-label="Selected work" className="folio-projects-placeholder" id="work">
        <div className="folio-projects-placeholder__grid">
          {projectPlaceholderColumns.map((column, columnIndex) => (
            <div className="folio-projects-placeholder__column" key={`project-column-${columnIndex}`}>
              {column.map((project, projectIndex) => (
                <article className="folio-project-placeholder" key={`${project.tone}-${projectIndex}`}>
                  <div
                    aria-label="Project media placeholder"
                    className={`folio-project-placeholder__media folio-project-placeholder__media--${project.ratio} folio-project-placeholder__media--${project.tone}`}
                    role="img"
                  />
                  <h2>Project title</h2>
                  <p>Tag</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="folio-about" id="about">
        <div className="folio-section-label">
          <span>04</span>
          <span>About / if you kept scrolling</span>
        </div>
        <div className="folio-about__layout">
          <h2>I design products,<br />systems, and the occasional proof that a silly idea could work.</h2>
          <div>
            <p>
              I care about software that feels considered without feeling precious. Most of my work lives somewhere between product design, systems thinking, and building enough of the thing to learn what the mock-up could not tell us.
            </p>
            <p>
              Previously at WizCommerce. Currently based in Bengaluru and open to thoughtful collaborations, unreasonable prototypes, and good conversations.
            </p>
            <nav aria-label="Contact links" className="folio-about__links">
              <a href="mailto:parthjha.work@gmail.com">Email me ↗</a>
              <a href={RESUME_URL} rel="noreferrer" target="_blank">Resume ↗</a>
              <a href="https://x.com/parosayshi" rel="noreferrer" target="_blank">X / Twitter ↗</a>
            </nav>
          </div>
        </div>
      </section>

      <footer className="folio-home-footer">
        <p>Paro says hi.</p>
        <p>Made by Parth Jha / Bengaluru / 2026</p>
        <a href="#home">Back to the light ↑</a>
      </footer>
    </main>
  );
}
