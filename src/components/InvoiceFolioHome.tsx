import { AnimatePresence, motion, type Variants } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import Download04Icon from "@hugeicons/core-free-icons/Download04Icon";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { folioProjectOrder, folioProjects, type FolioProjectId } from "../data/folioProjects";
import { ContactBirdFlock } from "./ContactBirdFlock";
import { FolioBentoCard } from "./FolioBentoCard";
import { FolioProjectViewer } from "./FolioProjectViewer";
import { FolioSiteHeader } from "./FolioSiteHeader";
import { PaperSurface } from "./PaperSurface";
import { SunlightPatchPill } from "./SunlightPatchPill";
import { WallLightShader } from "./WallLightShader";

interface InvoiceFolioHomeProps {
  onOpenPlay: () => void;
  reducedMotion: boolean;
}

const RESUME_DOWNLOAD_URL =
  "https://drive.google.com/uc?export=download&id=1IrNNaK6H14wivxoayvdHeeY0i7_WU072";

const WALL_THEME_STORAGE_KEY = "parosayshi:wall-theme:v1";
// Temporary launch setting: retain the complete theme implementation, but do
// not expose or initialize dark mode until it is intentionally revisited.
const DARK_MODE_ENABLED = false;
const SHADOW_NOTES = [
  "Paro says hi",
  "Currently intentmaxxing",
  "Vibing is part of the process",
] as const;
const SHADOW_NOTE_HOLD_TIMES = [8200, 11300, 9400] as const;

type WallTheme = "day" | "night";

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

function getFolioProjectIdFromUrl(): FolioProjectId | null {
  if (typeof window === "undefined") return null;
  const projectId = new URL(window.location.href).searchParams.get("project");
  return folioProjectOrder.find((candidate) => candidate === projectId) ?? null;
}

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
  const [wallTheme, setWallTheme] = useState<WallTheme>(() => (
    DARK_MODE_ENABLED ? getInitialWallTheme() : "day"
  ));
  const [intentExpanded, setIntentExpanded] = useState(false);
  const [designerExpanded, setDesignerExpanded] = useState(false);
  const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>(null);
  const [emDashNoteVisible, setEmDashNoteVisible] = useState(false);
  const [experienceReceiptHeight, setExperienceReceiptHeight] = useState<number | null>(null);
  const [promptNudgeActive, setPromptNudgeActive] = useState(false);
  const [shadowNoteIndex, setShadowNoteIndex] = useState(0);
  const [activeFolioProjectId, setActiveFolioProjectId] = useState<FolioProjectId | null>(getFolioProjectIdFromUrl);
  const emDashNoteTimerRef = useRef<number | undefined>(undefined);
  const folioProjectTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lastFolioProjectIdRef = useRef<FolioProjectId | null>(activeFolioProjectId);
  const experienceReceiptContentRef = useRef<HTMLDivElement>(null);
  const heroIntroBaselineHeightRef = useRef<number | null>(null);
  const heroIntroRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const promptNudgeDelayRef = useRef(520);
  const experiencePlacementRef = useRef<HTMLDivElement>(null);

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

  const restoreProjectTriggerFocus = useCallback(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const fallbackTrigger = lastFolioProjectIdRef.current
          ? document.querySelector<HTMLButtonElement>(`[data-folio-project="${lastFolioProjectIdRef.current}"]`)
          : null;
        (folioProjectTriggerRef.current ?? fallbackTrigger)?.focus({ preventScroll: true });
      });
    });
  }, []);

  useEffect(() => {
    const syncProjectFromUrl = () => {
      const nextProjectId = getFolioProjectIdFromUrl();
      if (nextProjectId) lastFolioProjectIdRef.current = nextProjectId;
      setActiveFolioProjectId(nextProjectId);
      if (!nextProjectId) restoreProjectTriggerFocus();
    };

    window.addEventListener("popstate", syncProjectFromUrl);
    return () => window.removeEventListener("popstate", syncProjectFromUrl);
  }, [restoreProjectTriggerFocus]);

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

    const syncHeroFlow = () => {
      const introHeight = intro.getBoundingClientRect().height;
      if (heroIntroBaselineHeightRef.current === null || (!intentExpanded && !designerExpanded)) {
        heroIntroBaselineHeightRef.current = introHeight;
      }

      const baselineHeight = heroIntroBaselineHeightRef.current;
      const expansionOffset = Math.max(0, introHeight - baselineHeight);
      hero.style.setProperty("--wall-intro-anchor-shift", `${introHeight / -2}px`);
      hero.style.setProperty("--wall-hero-expansion-offset", `${expansionOffset}px`);
    };

    const observer = new ResizeObserver(syncHeroFlow);
    observer.observe(intro);
    syncHeroFlow();
    return () => observer.disconnect();
  }, [designerExpanded, intentExpanded]);

  const showEmDashNote = () => {
    window.clearTimeout(emDashNoteTimerRef.current);
    setEmDashNoteVisible(true);
    emDashNoteTimerRef.current = window.setTimeout(() => setEmDashNoteVisible(false), 1800);
  };

  const openFolioProject = (projectId: FolioProjectId, trigger: HTMLButtonElement) => {
    folioProjectTriggerRef.current = trigger;
    lastFolioProjectIdRef.current = projectId;
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("project", projectId);
    window.history.pushState(
      { ...window.history.state, folioProjectViewer: projectId },
      "",
      nextUrl,
    );
    setActiveFolioProjectId(projectId);
  };

  const closeFolioProject = () => {
    if (
      activeFolioProjectId
      && window.history.state?.folioProjectViewer === activeFolioProjectId
    ) {
      window.history.back();
      return;
    }

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete("project");
    const nextState = { ...window.history.state };
    delete nextState.folioProjectViewer;
    window.history.replaceState(nextState, "", nextUrl);
    setActiveFolioProjectId(null);
    restoreProjectTriggerFocus();
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
    <>
    <main
      aria-hidden={activeFolioProjectId ? true : undefined}
      className="invoice-folio invoice-folio--wall"
      data-prompt-nudge={promptNudgeActive ? "true" : "false"}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      data-wall-theme={wallTheme}
      inert={activeFolioProjectId ? true : undefined}
    >
      <FolioSiteHeader onOpenPlay={onOpenPlay} />
      {DARK_MODE_ENABLED ? (
        <WallThemeControl onToggle={toggleWallTheme} theme={wallTheme} />
      ) : null}
      <WallLightShader
        glowColor={wallTheme === "night" ? "#91a8d8" : "#ebc9c0"}
        glowStrength={wallTheme === "night" ? 4.6 : 1}
        lightColor={wallTheme === "night" ? "#d9e2f4" : "#ffdeda"}
        reducedMotion={reducedMotion}
        wallColor={wallTheme === "night" ? "#0b0f18" : "#fffaf7"}
      />
      <PaperSurface />

      <section
        aria-label="Parosayshi introduction"
        className="wall-folio wall-folio--hero"
        data-designer-expanded={designerExpanded ? "true" : "false"}
        data-intent-expanded={intentExpanded ? "true" : "false"}
        id="home"
        ref={heroRef}
      >
        <div className="wall-folio__hero-composition">
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
                {designerExpanded ? (
                  <span>designer</span>
                ) : (
                  <SunlightPatchPill
                    ariaControls="designer-explanation"
                    ariaExpanded={false}
                    className="wall-folio__intent-trigger"
                    label="designer"
                    onClick={() => setDesignerExpanded(true)}
                  />
                )}{" "}
                who believes{" "}
                {intentExpanded ? (
                  <span>intentmaxxing</span>
                ) : (
                  <SunlightPatchPill
                    ariaControls="intentmaxxing-explanation"
                    ariaExpanded={false}
                    className="wall-folio__intent-trigger"
                    label="intentmaxxing"
                    onClick={() => setIntentExpanded(true)}
                  />
                )}{" "}
                is the way to move forward in the coming times.
              </span>
            </p>
            <div className="wall-folio__hero-details">
              <motion.div
                animate={{ height: intentExpanded ? "auto" : 0 }}
                className="wall-folio__hero-detail-reveal"
                data-expanded={intentExpanded ? "true" : "false"}
                initial={false}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="wall-folio__hero-detail-reveal-clip">
                  <motion.p
                    animate={intentExpanded ? { filter: "blur(0px)", opacity: 1 } : { filter: "blur(12px)", opacity: 0 }}
                    aria-hidden={!intentExpanded}
                    className="wall-folio__intent-detail"
                    id="intentmaxxing-explanation"
                    initial={false}
                    transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0, 0, 0.58, 1] }}
                  >
                    I think intention matters even more now that making things is getting easier. For me, it lives in the small decisions that turn an idea into an experience
                    <span className="wall-folio__dash-wrap">
                      <button
                        aria-describedby="human-em-dash-note"
                        aria-label="Em dash"
                        className="wall-folio__dash-trigger"
                        data-note-visible={emDashNoteVisible ? "true" : "false"}
                        onClick={showEmDashNote}
                        tabIndex={intentExpanded ? 0 : -1}
                        type="button"
                      >
                        —
                      </button>
                      <span className="wall-folio__dash-note" id="human-em-dash-note" role="note">
                        human generated em dash
                      </span>
                    </span>
                    something that can delight, inspire, or just make someone feel considered.
                  </motion.p>
                </div>
              </motion.div>
              <motion.div
                animate={{ height: designerExpanded ? "auto" : 0 }}
                className="wall-folio__hero-detail-reveal"
                data-expanded={designerExpanded ? "true" : "false"}
                initial={false}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="wall-folio__hero-detail-reveal-clip">
                  <motion.div
                    animate={designerExpanded ? { filter: "blur(0px)", opacity: 1 } : { filter: "blur(12px)", opacity: 0 }}
                    aria-hidden={!designerExpanded}
                    className="wall-folio__intent-detail"
                    id="designer-explanation"
                    initial={false}
                    transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0, 0, 0.58, 1] }}
                  >
                    <p>
                      I’ve spent the last <a className="wall-folio__experience-mark wall-folio__experience-link" href="#resume" tabIndex={designerExpanded ? 0 : -1}>3 years</a> designing across <mark className="wall-folio__experience-mark wall-folio__experience-mark--green">Edtech</mark> and <mark className="wall-folio__experience-mark wall-folio__experience-mark--green">B2B SaaS</mark>, plus a small detour into <mark className="wall-folio__experience-mark wall-folio__experience-mark--green">Web3</mark>.
                    </p>
                    <p className="wall-folio__designer-recent">
                      Lately, I’ve been going pretty deep into AI-led frontend development. I keep coming back to design systems and how things scale, and I’m slowly getting more bullish on product thinking too.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
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
          {[0, 4].map((groupStart) => (
            <div
              className={`folio-bento-group${groupStart === 0 ? " folio-bento-group--featured" : ""}`}
              key={`folio-bento-${groupStart}`}
            >
              {folioProjectOrder.slice(groupStart, groupStart + 4).map((projectId) => {
                const project = folioProjects[projectId];
                return (
                  <FolioBentoCard
                    active={activeFolioProjectId === project.id}
                    key={project.id}
                    onOpen={(trigger) => openFolioProject(project.id, trigger)}
                    project={project}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="experience-receipt-title" className="folio-experience" id="resume">
        <motion.div
          className="folio-experience__receipt-placement"
          ref={experiencePlacementRef}
          style={{ rotate: -1.5 }}
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
            <HugeiconsIcon aria-hidden="true" icon={Download04Icon} size={18} strokeWidth={2.2} />
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
                    <HugeiconsIcon aria-hidden="true" className="folio-experience__chevron" icon={ArrowDown01Icon} size={18} strokeWidth={2.4} />
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
      >
        <ContactBirdFlock reducedMotion={reducedMotion} theme={wallTheme} />
      </motion.section>
    </main>
    {typeof document !== "undefined" ? createPortal(
      <AnimatePresence>
        {activeFolioProjectId ? (
          <FolioProjectViewer
            key={activeFolioProjectId}
            onClose={closeFolioProject}
            project={folioProjects[activeFolioProjectId]}
            reducedMotion={reducedMotion}
          />
        ) : null}
      </AnimatePresence>,
      document.body,
    ) : null}
    </>
  );
}
