import { AnimatePresence, motion, type Variants, useScroll, useSpring, useTransform } from "motion/react";
import { IconChevronDown, IconDownload } from "@tabler/icons-react";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
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
const WALL_COLOR = "#f7efe4";
const WALL_NIGHT_COLOR = "#0b0f18";
const WALL_NIGHT_LIGHT_COLOR = "#d9e2f4";
const WALL_NIGHT_GLOW_COLOR = "#91a8d8";
const WALL_THEME_STORAGE_KEY = "parosayshi:wall-theme:v1";
const FOLIO_ENTRANCE_SESSION_KEY = "parosayshi:folio-entrance:v1";
const FOLIO_SCROLL_REVEAL_SPRING = {
  damping: 60,
  mass: 1,
  stiffness: 600,
};
const SHADOW_NOTES = [
  "Paro says hi",
  "Currently intentmaxxing",
  "Vibing is part of the process",
] as const;
const SHADOW_NOTE_HOLD_TIMES = [8200, 11300, 9400] as const;

type WallTheme = "day" | "night";

const WALL_THEME_PALETTES = {
  day: {
    glow: WALL_GLOW_COLOR,
    light: WALL_LIGHT_COLOR,
    wall: WALL_COLOR,
  },
  night: {
    glow: WALL_NIGHT_GLOW_COLOR,
    light: WALL_NIGHT_LIGHT_COLOR,
    wall: WALL_NIGHT_COLOR,
  },
} as const;

const WALL_THEME_TIME_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

function getInitialWallTheme(): WallTheme {
  if (typeof window === "undefined") return "day";
  try {
    const storedTheme = window.localStorage.getItem(WALL_THEME_STORAGE_KEY);
    if (storedTheme === "day" || storedTheme === "night") return storedTheme;
  } catch {
    // Time-aware fallback still works when persistence is unavailable.
  }

  const hourPart = WALL_THEME_TIME_FORMATTER
    .formatToParts(new Date())
    .find(({ type }) => type === "hour")?.value;
  const hour = Number(hourPart ?? 12);
  return hour >= 19 || hour < 7 ? "night" : "day";
}

function WallThemeControl({ onToggle, theme }: { onToggle: () => void; theme: WallTheme }) {
  return (
    <button
      aria-label={`Switch to ${theme === "night" ? "day" : "night"} mode`}
      aria-pressed={theme === "night"}
      className="folio-wall-theme"
      data-theme={theme}
      onClick={onToggle}
      type="button"
    >
      <span aria-hidden="true" className="folio-wall-theme__track">
        <span className="folio-wall-theme__thumb" />
      </span>
    </button>
  );
}
const SHADOW_NOTE_VARIANTS: Variants = {
  exit: {
    filter: "blur(3.2px)",
    opacity: 0,
    transition: { duration: 1.08, ease: [0.4, 0, 0.6, 1] },
  },
  hidden: { filter: "blur(3.4px)", opacity: 0 },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    transition: { duration: 1.28, ease: [0.22, 1, 0.36, 1] },
  },
};

function shouldPlayFolioEntrance(reducedMotion: boolean) {
  if (reducedMotion || typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(FOLIO_ENTRANCE_SESSION_KEY) !== "seen";
  } catch {
    return true;
  }
}

function useFolioScrollReveal<T extends HTMLElement>(reducedMotion: boolean) {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end end"],
    target: ref,
  });
  const progress = useSpring(scrollYProgress, FOLIO_SCROLL_REVEAL_SPRING);
  const opacity = useTransform(progress, [0, 1], [0.5, 1]);
  const y = useTransform(progress, [0, 1], [56, 0]);

  return {
    ref,
    style: reducedMotion ? undefined : { opacity, y },
  };
}

function FolioScrollRevealArticle({
  children,
  className,
  reducedMotion,
}: {
  children: ReactNode;
  className: string;
  reducedMotion: boolean;
}) {
  const reveal = useFolioScrollReveal<HTMLElement>(reducedMotion);

  return (
    <motion.article className={className} ref={reveal.ref} style={reveal.style}>
      {children}
    </motion.article>
  );
}

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
  const [wallTheme, setWallTheme] = useState<WallTheme>(getInitialWallTheme);
  const [entranceActive, setEntranceActive] = useState(() => shouldPlayFolioEntrance(reducedMotion));
  const [intentExpanded, setIntentExpanded] = useState(false);
  const [designerExpanded, setDesignerExpanded] = useState(false);
  const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>(null);
  const [emDashNoteVisible, setEmDashNoteVisible] = useState(false);
  const [experienceReceiptHeight, setExperienceReceiptHeight] = useState<number | null>(null);
  const [promptNudgeActive, setPromptNudgeActive] = useState(false);
  const [shadowNoteIndex, setShadowNoteIndex] = useState(0);
  const emDashNoteTimerRef = useRef<number | undefined>(undefined);
  const experienceReceiptContentRef = useRef<HTMLDivElement>(null);
  const heroIntroBaselineHeightRef = useRef<number | null>(null);
  const heroIntroRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const promptNudgeDelayRef = useRef(entranceActive ? 1120 : 520);
  const experienceReveal = useFolioScrollReveal<HTMLDivElement>(reducedMotion);
  const contactReveal = useFolioScrollReveal<HTMLElement>(reducedMotion);
  const wallPalette = WALL_THEME_PALETTES[wallTheme];

  useEffect(() => {
    document.body.dataset.wallTheme = wallTheme;
    try {
      window.localStorage.setItem(WALL_THEME_STORAGE_KEY, wallTheme);
    } catch {
      // Theme changes remain available without persistence.
    }
    return () => {
      delete document.body.dataset.wallTheme;
    };
  }, [wallTheme]);

  useEffect(() => () => window.clearTimeout(emDashNoteTimerRef.current), []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setTimeout(
      () => setPromptNudgeActive(true),
      promptNudgeDelayRef.current,
    );
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setShadowNoteIndex(0);
      return undefined;
    }

    const timer = window.setTimeout(
      () => setShadowNoteIndex((index) => (index + 1) % SHADOW_NOTES.length),
      SHADOW_NOTE_HOLD_TIMES[shadowNoteIndex],
    );
    return () => window.clearTimeout(timer);
  }, [reducedMotion, shadowNoteIndex]);

  useLayoutEffect(() => {
    const content = experienceReceiptContentRef.current;
    if (!content) return undefined;

    const measure = () => setExperienceReceiptHeight(content.offsetHeight);
    const observer = new ResizeObserver(measure);
    measure();
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const intro = heroIntroRef.current;
    if (!hero || !intro) return undefined;

    const syncHeroExpansionSpace = () => {
      const introHeight = intro.getBoundingClientRect().height;
      if (!intentExpanded && !designerExpanded) {
        heroIntroBaselineHeightRef.current = introHeight;
        hero.style.setProperty("--wall-hero-expansion-offset", "0px");
        return;
      }

      const baselineHeight = heroIntroBaselineHeightRef.current ?? introHeight;
      const expansionOffset = Math.max(0, introHeight - baselineHeight);
      hero.style.setProperty("--wall-hero-expansion-offset", `${expansionOffset}px`);
    };

    const observer = new ResizeObserver(syncHeroExpansionSpace);
    observer.observe(intro);
    syncHeroExpansionSpace();
    return () => observer.disconnect();
  }, [designerExpanded, intentExpanded]);

  useEffect(() => {
    if (!entranceActive) return undefined;

    try {
      window.sessionStorage.setItem(FOLIO_ENTRANCE_SESSION_KEY, "seen");
    } catch {
      // The entrance can still play when session storage is unavailable.
    }

    const entranceTimer = window.setTimeout(() => setEntranceActive(false), 980);
    return () => window.clearTimeout(entranceTimer);
  }, [entranceActive]);

  const showEmDashNote = () => {
    window.clearTimeout(emDashNoteTimerRef.current);
    setEmDashNoteVisible(true);
    emDashNoteTimerRef.current = window.setTimeout(() => setEmDashNoteVisible(false), 1800);
  };

  const toggleWallTheme = () => {
    const nextTheme: WallTheme = wallTheme === "night" ? "day" : "night";
    const applyTheme = () => {
      setWallTheme(nextTheme);
    };
    if (reducedMotion || typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    document.documentElement.dataset.wallThemeTransition = "true";
    document.documentElement.dataset.wallThemeTransitionTo = nextTheme;
    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });
    const clearTransitionState = () => {
      delete document.documentElement.dataset.wallThemeTransition;
      delete document.documentElement.dataset.wallThemeTransitionTo;
    };
    void transition.finished.then(clearTransitionState, clearTransitionState);
  };

  return (
    <main
      className="invoice-folio invoice-folio--wall"
      data-entrance={entranceActive && !reducedMotion ? "true" : "false"}
      data-prompt-nudge={promptNudgeActive ? "true" : "false"}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      data-wall-theme={wallTheme}
    >
      <FolioSiteHeader onOpenPlay={onOpenPlay} />
      <WallThemeControl
        onToggle={toggleWallTheme}
        theme={wallTheme}
      />

      <section
        aria-label="Parosayshi introduction"
        className="wall-folio wall-folio--hero"
        data-designer-expanded={designerExpanded ? "true" : "false"}
        data-intent-expanded={intentExpanded ? "true" : "false"}
        id="home"
        ref={heroRef}
      >
        <div className="wall-folio__hero-composition">
          <WallLightShader
            glowColor={wallPalette.glow}
            glowStrength={wallTheme === "night" ? 4.6 : 1}
            lightColor={wallPalette.light}
            reducedMotion={reducedMotion}
            wallColor={wallPalette.wall}
          />
          <div aria-hidden="true" className="wall-folio__grain" />
          <p
            aria-label={SHADOW_NOTES.join(". ")}
            className="wall-folio__shadow-wordmark"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={SHADOW_NOTES[shadowNoteIndex]}
                aria-hidden="true"
                animate="visible"
                className="wall-folio__shadow-note-line"
                exit="exit"
                initial="hidden"
                variants={SHADOW_NOTE_VARIANTS}
              >
                {SHADOW_NOTES[shadowNoteIndex]}
              </motion.span>
            </AnimatePresence>
          </p>
          <div
            className="wall-folio__figma-intro"
            data-node-id="73:1458"
            ref={heroIntroRef}
          >
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
                      human generated em dash
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
                    I’ve spent the last <a className="wall-folio__experience-mark wall-folio__experience-link" href="#resume">3 years</a> designing across <mark className="wall-folio__experience-mark wall-folio__experience-mark--green">Edtech</mark> and <mark className="wall-folio__experience-mark wall-folio__experience-mark--green">B2B SaaS</mark>, with a small detour into <mark className="wall-folio__experience-mark wall-folio__experience-mark--green">Web3</mark>.
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
                <FolioScrollRevealArticle
                  className="folio-project-placeholder"
                  key={`${project.tone}-${projectIndex}`}
                  reducedMotion={reducedMotion}
                >
                  <div
                    aria-label={columnIndex === 0 && projectIndex === 0 ? "Superr project preview" : "Project media placeholder"}
                    className={`folio-project-placeholder__media folio-project-placeholder__media--${project.ratio} folio-project-placeholder__media--${project.tone}${columnIndex === 0 && projectIndex === 0 ? " folio-project-placeholder__media--feature" : ""}`}
                    role="img"
                  >
                    {columnIndex === 0 && projectIndex === 0 ? (
                      <img
                        alt=""
                        draggable={false}
                        src="/assets/invoice-folio/superr-project-placeholder-5.png?v=1"
                      />
                    ) : null}
                  </div>
                  <h2>Project title</h2>
                  <p>Tag</p>
                </FolioScrollRevealArticle>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="experience-receipt-title" className="folio-experience" id="resume">
        <motion.div
          className="folio-experience__receipt-placement"
          ref={experienceReveal.ref}
          style={{ ...experienceReveal.style, rotate: -1.5 }}
        >
          <motion.div
            animate={experienceReceiptHeight === null ? undefined : { height: experienceReceiptHeight }}
            className="folio-experience__receipt"
            initial={false}
            transition={reducedMotion ? { duration: 0 } : {
              height: {
                damping: 25,
                mass: 0.7,
                stiffness: 500,
                type: "spring",
              },
            }}
          >
          <div className="folio-experience__receipt-content" ref={experienceReceiptContentRef}>
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
                <motion.li
                  key={item.id}
                  layout={reducedMotion ? false : "position"}
                  transition={reducedMotion ? { duration: 0 } : {
                    layout: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                  }}
                >
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
                  <AnimatePresence initial={false} mode="popLayout">
                    {expanded ? (
                      <motion.div
                        animate={{ opacity: 1 }}
                        className="folio-experience__intro-shell"
                        exit={{ opacity: 0 }}
                        id={detailId}
                        initial={reducedMotion ? false : { opacity: 0 }}
                        transition={reducedMotion ? { duration: 0 } : {
                          duration: 0.24,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        <p className="folio-experience__intro">{item.detail}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ol>
          <motion.p
            className="folio-experience__education"
            layout={reducedMotion ? false : "position"}
            transition={reducedMotion ? { duration: 0 } : {
              layout: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <span>IIIT Nagpur</span>
            <span>B.Tech / CS major</span>
            <time>2019—23</time>
          </motion.p>
          </div>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        aria-label="Contact"
        className="folio-contact"
        id="contact"
        ref={contactReveal.ref}
        style={contactReveal.style}
      >
        <ContactBirdFlock reducedMotion={reducedMotion} theme={wallTheme} />
      </motion.section>
    </main>
  );
}
