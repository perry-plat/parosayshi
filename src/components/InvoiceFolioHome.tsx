import { AnimatePresence, motion } from "motion/react";
import { IconChevronDown, IconDownload } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import type { ProjectId } from "../types/project";
import { SunlightPatchPill } from "./SunlightPatchPill";
import { WallLightShader } from "./WallLightShader";

interface InvoiceFolioHomeProps {
  onOpenProject: (id: ProjectId, trigger: HTMLElement) => void;
  reducedMotion: boolean;
}

const RESUME_DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1t2szuLpJstQ-ktsZ5rvWYJ8svIZWmhT2";

const INTENT_DETAIL =
  "As making becomes easier, intention matters more than ever. It shapes the small decisions that turn an idea into an experience—one that can delight, inspire, or simply make someone feel considered.";

// Keep the accepted final light study as the permanent wall treatment.
const WALL_LIGHT_COLOR = "#fffdf5";
const WALL_GLOW_COLOR = "#ead4a6";

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

const experienceItems = [
  {
    company: "Superr.ai",
    date: "2025—26 (Present)",
    id: "superr",
    logo: "/assets/invoice-folio/superr-current-mark.svg",
    role: "Technical product design",
  },
  {
    company: "WizCommerce",
    date: "2023—25",
    id: "wizcommerce",
    logo: "/assets/invoice-folio/wizcommerce-current-mark.svg",
    role: "Product design / B2B systems",
  },
  {
    company: "Polygon (cope studio)",
    date: "2022",
    id: "polygon",
    logo: "/assets/invoice-folio/polygon-current-mark.svg",
    role: "Product design intern",
  },
] as const;

const EXPERIENCE_PLACEHOLDER =
  "A short introduction to the work, responsibilities, and outcomes from this role will go here.";

export function InvoiceFolioHome({ reducedMotion }: InvoiceFolioHomeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [intentExpanded, setIntentExpanded] = useState(false);
  const [designerExpanded, setDesignerExpanded] = useState(false);
  const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>(null);
  const [emDashNoteVisible, setEmDashNoteVisible] = useState(false);
  const emDashNoteTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(emDashNoteTimerRef.current), []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const showEmDashNote = () => {
    window.clearTimeout(emDashNoteTimerRef.current);
    setEmDashNoteVisible(true);
    emDashNoteTimerRef.current = window.setTimeout(() => setEmDashNoteVisible(false), 1800);
  };

  return (
    <main className="invoice-folio invoice-folio--wall">
      <header className="folio-site-header" data-open={menuOpen ? "true" : "false"}>
        <div className="folio-site-header__top">
          <div aria-label="Artwork placeholder" className="folio-site-header__artwork" role="img">
            <span>Artwork / TBD</span>
          </div>
        </div>
        <button
          aria-controls="folio-paper-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          className="folio-site-header__toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>
        <nav aria-label="Primary navigation" className="folio-site-header__nav" id="folio-paper-menu">
          <a href="#home" onClick={() => setMenuOpen(false)}>
            <span>Home</span>
          </a>
          <a href="#work" onClick={() => setMenuOpen(false)}>
            <span>Work</span>
          </a>
          <a href="#resume" onClick={() => setMenuOpen(false)}>
            <span>Resume</span>
          </a>
          <a href="https://x.com/parosayshi" onClick={() => setMenuOpen(false)} rel="noreferrer" target="_blank">
            <span>X / @parosayshi</span>
          </a>
        </nav>
      </header>

      <section
        aria-label="Parosayshi introduction"
        className="wall-folio wall-folio--hero"
        data-designer-expanded={designerExpanded ? "true" : "false"}
        data-intent-expanded={intentExpanded ? "true" : "false"}
        id="home"
      >
        <div className="wall-folio__hero-composition">
          <WallLightShader glowColor={WALL_GLOW_COLOR} lightColor={WALL_LIGHT_COLOR} reducedMotion={reducedMotion} />
          <div aria-hidden="true" className="wall-folio__grain" />
          <p className="wall-folio__shadow-wordmark">Paro says hi</p>
          <div className="wall-folio__figma-intro" data-node-id="73:1458">
            <p>
              <span className="wall-folio__figma-heading">
                <strong>Hi, I am Parth</strong>
                <span aria-hidden="true" className="wall-folio__figma-sticker">
                  <img alt="" src="/assets/polaroid.jpeg" />
                </span>
              </span>
              <span className="wall-folio__figma-body">
                A{" "}
                <SunlightPatchPill
                  ariaControls="designer-explanation"
                  ariaExpanded={designerExpanded}
                  className="wall-folio__intent-trigger"
                  inactive={designerExpanded}
                  label="designer"
                  onClick={() => setDesignerExpanded(true)}
                />{" "}
                who believes{" "}
                <SunlightPatchPill
                  ariaControls="intentmaxxing-explanation"
                  ariaExpanded={intentExpanded}
                  className="wall-folio__intent-trigger"
                  inactive={intentExpanded}
                  label="intentmaxxing"
                  onClick={() => setIntentExpanded(true)}
                />{" "}
                is the way to move forward in the coming times.
              </span>
            </p>
            <AnimatePresence initial={false}>
              {intentExpanded ? (
                <motion.p
                  animate={{ clipPath: "inset(0 0 0% 0)", height: "auto", marginTop: "var(--intent-detail-gap)", opacity: 1 }}
                  className="wall-folio__intent-detail"
                  exit={{ clipPath: "inset(0 0 100% 0)", height: 0, marginTop: 0, opacity: 0 }}
                  id="intentmaxxing-explanation"
                  initial={reducedMotion ? false : { clipPath: "inset(0 0 100% 0)", height: 0, marginTop: 0, opacity: 0 }}
                  transition={reducedMotion ? { duration: 0 } : {
                    clipPath: { delay: 0.12, duration: 1.5, ease: [0.22, 1, 0.36, 1] },
                    height: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
                    marginTop: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.2 },
                  }}
                >
                  As making becomes easier, intention matters more than ever. It shapes the small decisions that turn an idea into an experience
                  <span className="wall-folio__dash-wrap">
                    <button
                      aria-describedby="human-em-dash-note"
                      aria-label="Em dash"
                      className="wall-folio__dash-trigger"
                      data-note-visible={emDashNoteVisible ? "true" : "false"}
                      onClick={showEmDashNote}
                      type="button"
                    >
                      —
                    </button>
                    <span className="wall-folio__dash-note" id="human-em-dash-note" role="note">
                      human generated em-dash
                    </span>
                  </span>
                  one that can delight, inspire, or simply make someone feel considered.
                </motion.p>
              ) : null}
            </AnimatePresence>
            <AnimatePresence initial={false}>
              {designerExpanded ? (
                <motion.p
                  animate={{ clipPath: "inset(0 0 0% 0)", height: "auto", marginTop: "var(--intent-detail-gap)", opacity: 1 }}
                  className="wall-folio__intent-detail"
                  exit={{ clipPath: "inset(0 0 100% 0)", height: 0, marginTop: 0, opacity: 0 }}
                  id="designer-explanation"
                  initial={reducedMotion ? false : { clipPath: "inset(0 0 100% 0)", height: 0, marginTop: 0, opacity: 0 }}
                  transition={reducedMotion ? { duration: 0 } : {
                    clipPath: { delay: 0.18, duration: 1.5, ease: [0.22, 1, 0.36, 1] },
                    height: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
                    marginTop: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.2 },
                  }}
                >
                  {INTENT_DETAIL}
                </motion.p>
              ) : null}
            </AnimatePresence>
            <img
              alt="Parth's signature"
              className="wall-folio__signature"
              draggable={false}
              src="/assets/parth-signature.png"
            />
          </div>
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

      <section aria-labelledby="experience-receipt-title" className="folio-experience" id="resume">
        <div className="folio-experience__receipt">
          <img
            alt=""
            aria-hidden="true"
            className="folio-experience__paperweight"
            src="/assets/invoice-folio/receipt-prism-paperweight.png"
          />
          <a
            aria-label="Download résumé"
            className="folio-experience__download"
            download="Parth-resume.pdf"
            href={RESUME_DOWNLOAD_URL}
            rel="noreferrer"
            title="Download résumé"
          >
            <IconDownload aria-hidden="true" stroke={2.2} />
            <span>Resume</span>
          </a>
          <h2 id="experience-receipt-title">Experience</h2>
          <ol>
            {experienceItems.map((item) => {
              const expanded = expandedExperienceId === item.id;
              const detailId = `experience-${item.id}-detail`;

              return (
                <li key={item.id}>
                  <button
                    aria-controls={detailId}
                    aria-expanded={expanded}
                    className="folio-experience__row"
                    onClick={() => setExpandedExperienceId(expanded ? null : item.id)}
                    type="button"
                  >
                    <img alt="" aria-hidden="true" src={item.logo} />
                    <strong>{item.company}</strong>
                    <small>{item.role}</small>
                    <time>{item.date}</time>
                    <IconChevronDown aria-hidden="true" className="folio-experience__chevron" stroke={2.4} />
                  </button>
                  <div
                    aria-hidden={!expanded}
                    className="folio-experience__intro-shell"
                    data-expanded={expanded ? "true" : "false"}
                    id={detailId}
                    style={reducedMotion ? { transition: "none" } : undefined}
                  >
                    <div className="folio-experience__intro-clip">
                      <p className="folio-experience__intro">{EXPERIENCE_PLACEHOLDER}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

    </main>
  );
}
