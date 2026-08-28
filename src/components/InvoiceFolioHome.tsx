import { AnimatePresence, motion } from "motion/react";
import { IconChevronDown, IconDownload } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import type { ProjectId } from "../types/project";
import { ContactBirdFlock } from "./ContactBirdFlock";
import { FolioSiteHeader } from "./FolioSiteHeader";
import { SunlightPatchPill } from "./SunlightPatchPill";
import { WallLightShader } from "./WallLightShader";

interface InvoiceFolioHomeProps {
  onOpenProject: (id: ProjectId, trigger: HTMLElement) => void;
  onOpenPlay: () => void;
  reducedMotion: boolean;
}

const RESUME_DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1IrNNaK6H14wivxoayvdHeeY0i7_WU072";

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
    detail:
      "Designing across SuperrBook and SuperrBoard—from classroom tools and search to AI-assisted book creation. Built the shared design system supporting pilots across 5+ schools and 1,000+ students.",
    id: "superr",
    logo: "/assets/invoice-folio/superr-current-mark.svg",
    role: "Product design / AI learning",
  },
  {
    company: "WizCommerce",
    date: "2023—25",
    detail:
      "Led end-to-end design for a US B2B commerce platform. Shipped WizPay and core workflows while contributing to $1.3M ARR and $2M+ in monthly transaction volume.",
    id: "wizcommerce",
    logo: "/assets/invoice-folio/wizcommerce-current-mark.svg",
    role: "Product design / B2B commerce",
  },
  {
    company: "Polygon (cope studio)",
    date: "2022",
    detail:
      "Prototyped three Web3 R&D concepts at cope studio, including product explorations with Team Liquid and Nothing.",
    id: "polygon",
    logo: "/assets/invoice-folio/polygon-current-mark.svg",
    role: "Product design intern / Web3",
  },
] as const;

const INDIA_TIME_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Kolkata",
});

function LiveIndiaWatch() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const parts = Object.fromEntries(
    INDIA_TIME_FORMATTER.formatToParts(now).map(({ type, value }) => [type, value]),
  );
  const hours = Number(parts.hour);
  const minutes = Number(parts.minute);
  const seconds = Number(parts.second);
  const hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  return (
    <div
      aria-label={`Casio MW-240 showing ${INDIA_TIME_FORMATTER.format(now)} India time`}
      className="folio-experience__watch"
      role="img"
    >
      <img alt="" aria-hidden="true" src="/assets/invoice-folio/receipt-casio-mw240-7ev-dial.png" />
      <span aria-hidden="true" className="folio-experience__watch-dial">
        <span className="folio-experience__watch-hand folio-experience__watch-hand--hour" style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />
        <span className="folio-experience__watch-hand folio-experience__watch-hand--minute" style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
        <span className="folio-experience__watch-hand folio-experience__watch-hand--second" style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }} />
        <span className="folio-experience__watch-pin" />
      </span>
    </div>
  );
}

export function InvoiceFolioHome({ onOpenPlay, reducedMotion }: InvoiceFolioHomeProps) {
  const [intentExpanded, setIntentExpanded] = useState(false);
  const [designerExpanded, setDesignerExpanded] = useState(false);
  const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>(null);
  const [emDashNoteVisible, setEmDashNoteVisible] = useState(false);
  const emDashNoteTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(emDashNoteTimerRef.current), []);

  const showEmDashNote = () => {
    window.clearTimeout(emDashNoteTimerRef.current);
    setEmDashNoteVisible(true);
    emDashNoteTimerRef.current = window.setTimeout(() => setEmDashNoteVisible(false), 1800);
  };

  return (
    <main className="invoice-folio invoice-folio--wall">
      <FolioSiteHeader onOpenPlay={onOpenPlay} />

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
                <motion.div
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
                  <p>
                    I’ve spent the last <mark className="wall-folio__experience-mark">3 years</mark> designing across Edtech and B2B SaaS, with a small detour into Web3.
                  </p>
                  <p className="wall-folio__designer-recent">
                    Lately, AI-led frontend development has become my current rabbit hole, while design systems keep me thinking about how things scale—and I’m increasingly bullish on product thinking.
                  </p>
                </motion.div>
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
          {/* <LiveIndiaWatch /> */}
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
                      <p className="folio-experience__intro">{item.detail}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="folio-experience__education">
            <span>IIIT Nagpur</span>
            <span>B.Tech / CS major</span>
            <time>2019—23</time>
          </p>
        </div>
      </section>

      <section aria-label="Contact" className="folio-contact" id="contact">
        <ContactBirdFlock reducedMotion={reducedMotion} />
      </section>

      <footer className="folio-footer">
        <time className="folio-footer__updated" dateTime="2026-08-28">
          Last updated · 28 Aug 2026
        </time>
        <p className="folio-footer__credit">
          by <a href="https://x.com/parosayshi" rel="noreferrer" target="_blank">parosayshi</a>
        </p>
      </footer>

    </main>
  );
}
