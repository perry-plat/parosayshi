import { useEffect, useState, type CSSProperties } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { workCards } from "../data/workCards";
import type { ProjectId } from "../types/project";

interface InvoiceFolioHomeProps {
  onOpenProject: (id: ProjectId, trigger: HTMLButtonElement) => void;
  reducedMotion: boolean;
}

const greetingPlacements = [
  { row: 6, column: 5, letters: [..."HELLO"], direction: "across" },
  { row: 6, column: 5, letters: [..."HOLA"], direction: "down" },
  { row: 7, column: 3, letters: [..."ALOHA"], direction: "across" },
  { row: 3, column: 9, letters: [..."CIAO"], direction: "down" },
  { row: 4, column: 8, letters: [..."HI"], direction: "across" },
  { row: 9, column: 4, letters: [..."SALUT"], direction: "across" },
  { row: 2, column: 13, letters: ["你", "好"], direction: "down" },
  { row: 11, column: 2, letters: ["न", "म", "स्ते"], direction: "across" },
  { row: 12, column: 10, letters: ["こ", "ん", "に", "ち", "は"], direction: "across" },
  { row: 1, column: 3, letters: ["안", "녕"], direction: "across" },
] as const;

function GreetingCrossword() {
  const cells = new Map<string, string>();

  greetingPlacements.forEach(({ row, column, letters, direction }) => {
    letters.forEach((letter, index) => {
      const cellRow = row + (direction === "down" ? index : 0);
      const cellColumn = column + (direction === "across" ? index : 0);
      cells.set(`${cellRow}-${cellColumn}`, letter);
    });
  });

  return (
    <div className="greeting-crossword" aria-hidden="true">
      {Array.from({ length: 13 * 17 }, (_, index) => {
        const row = Math.floor(index / 17) + 1;
        const column = (index % 17) + 1;
        const letter = cells.get(`${row}-${column}`);
        return (
          <span className={letter ? "greeting-crossword__cell is-letter" : "greeting-crossword__cell"} key={`${row}-${column}`}>
            {letter}
          </span>
        );
      })}
    </div>
  );
}

const slipThemes: Record<ProjectId, { background: string; ink: string; accent: string }> = {
  notebook: { background: "#f1eee6", ink: "#27231f", accent: "#1f2ed3" },
  "periodic-table": { background: "#ece9df", ink: "#20201e", accent: "#1f2ed3" },
  "wiz-commerce": { background: "#173c83", ink: "#fff7df", accent: "#ff8a2a" },
  "wiz-sales-data": { background: "#1c513b", ink: "#f5eecf", accent: "#e4e765" },
  "wiz-email-flows": { background: "#4e3277", ink: "#fbf1dc", accent: "#ff9c63" },
  "uber-kids": { background: "#f1d744", ink: "#191918", accent: "#1f2ed3" },
  kriyadex: { background: "#f0eee7", ink: "#23211f", accent: "#e24b32" },
  farevv: { background: "#181818", ink: "#f8f4eb", accent: "#e783ab" },
  curo: { background: "#ddd7c9", ink: "#26231f", accent: "#315bc9" },
};

const receiptDetails: Partial<Record<ProjectId, Array<[string, string]>>> = {
  "periodic-table": [["FORMAT", "INTERACTIVE TOOL"], ["MATERIAL", "ELEMENT DATA"], ["STATE", "PROTOTYPED"]],
  "wiz-commerce": [["ROLE", "PRODUCT DESIGN"], ["SYSTEM", "PRODUCT TOUCHPOINTS"], ["IMPACT", "+$1.3M ARR"]],
  "wiz-sales-data": [["SIGNAL", "SALES-FLOOR DATA"], ["OUTPUT", "DECISION SYSTEM"], ["STATE", "SHIPPED"]],
  "wiz-email-flows": [["SERVICE", "EMAIL AUTOMATION"], ["OUTPUT", "ORG-WIDE SYSTEM"], ["STATE", "SCALED"]],
  "uber-kids": [["SERVICE", "SAFETY UX"], ["OUTPUT", "ONBOARDING FLOW"], ["AUDIENCE", "KIDS + PARENTS"]],
  kriyadex: [["SERVICE", "BRAND DESIGN"], ["OUTPUT", "IDENTITY SYSTEM"], ["MODE", "FREELANCE"]],
  farevv: [["FORMAT", "ANTI-PORTFOLIO"], ["OUTPUT", "FASHION STUDY"], ["STATE", "EXPERIMENT"]],
  curo: [["FORMAT", "LEARNING PRODUCT"], ["OUTPUT", "WORKING MVP"], ["STATE", "IN PROGRESS"]],
};

const superrProjects = [
  ["Building Superr.ai", "Shaping the product from its early foundations."],
  ["Learning journeys", "Turning open-ended discovery into guided paths."],
  ["AI tutor", "Designing useful conversational learning patterns."],
  ["Educator workspace", "Making classroom workflows easier to operate."],
  ["System foundations", "A reusable interface language for the product."],
  ["Course discovery", "Helping learners find the right place to begin."],
  ["Student onboarding", "A clearer path from curiosity to first lesson."],
  ["Progress and feedback", "Making momentum visible without adding noise."],
] as const;

const pileGeometry = [
  { x: 0, rotate: -1.8 },
  { x: 22, rotate: 1.35 },
  { x: -15, rotate: -0.8 },
  { x: 17, rotate: 1.1 },
  { x: -27, rotate: -1.45 },
  { x: 10, rotate: 0.65 },
  { x: -8, rotate: -0.55 },
  { x: 25, rotate: 1.5 },
  { x: -19, rotate: -1.05 },
  { x: 7, rotate: 0.45 },
];

function OpeningWordmark({ typedCount }: { typedCount: number }) {
  return (
    <div className="opening-wordmark">
      <img alt="" src="/assets/invoice-folio/paro-says-hi-wordmark-shape.svg" />
      <span className="opening-wordmark__leg">
        <span className={typedCount >= 8 ? "is-typed" : ""}>H</span>
        <span className={typedCount >= 9 ? "is-typed" : ""}>I</span>
      </span>
      <span className={`opening-wordmark__letter is-s-top${typedCount >= 5 ? " is-typed" : ""}`}>S</span>
      <span className={`opening-wordmark__letter is-p${typedCount >= 1 ? " is-typed" : ""}`}>P</span>
      <span className={`opening-wordmark__letter is-a${typedCount >= 2 ? " is-typed" : ""}`}>A</span>
      <span className={`opening-wordmark__letter is-r${typedCount >= 3 ? " is-typed" : ""}`}>R</span>
      <span className={`opening-wordmark__letter is-o${typedCount >= 4 ? " is-typed" : ""}`}>O</span>
      <span className={`opening-wordmark__letter is-y${typedCount >= 6 ? " is-typed" : ""}`}>Y</span>
      <span className={`opening-wordmark__letter is-s-bottom${typedCount >= 7 ? " is-typed" : ""}`}>S</span>
    </div>
  );
}

export function InvoiceFolioHome({ onOpenProject, reducedMotion }: InvoiceFolioHomeProps) {
  // Project receipts are intentionally paused until they are reintroduced one by one.
  const showProjectReceipts = false;
  const [typedCount, setTypedCount] = useState(reducedMotion ? 9 : 0);
  const [introReady, setIntroReady] = useState(false);
  const [introMorphing, setIntroMorphing] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const typingDelays = reducedMotion ? [] : [120, 250, 380, 510, 850, 980, 1110, 1450, 1580];
    const typingTimers = typingDelays.map((delay, index) => (
      window.setTimeout(() => setTypedCount(index + 1), delay)
    ));
    if (reducedMotion) setTypedCount(9);
    const readyTimer = window.setTimeout(() => setIntroReady(true), reducedMotion ? 100 : 1780);
    return () => {
      typingTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(readyTimer);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!introReady || introMorphing) return;

    if (reducedMotion) {
      setIntroMorphing(true);
      return;
    }

    const releaseLogo = () => {
      if (window.scrollY < 12) return;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      setIntroMorphing(true);
    };

    window.addEventListener("scroll", releaseLogo, { passive: true });
    releaseLogo();
    return () => window.removeEventListener("scroll", releaseLogo);
  }, [introMorphing, introReady, reducedMotion]);

  useEffect(() => {
    if (!introMorphing) return;
    const exitTimer = window.setTimeout(() => setIntroVisible(false), reducedMotion ? 240 : 900);
    return () => window.clearTimeout(exitTimer);
  }, [introMorphing, reducedMotion]);

  return (
    <LayoutGroup id="invoice-identity">
      <div className="invoice-folio" aria-labelledby="invoice-folio-title">
      <AnimatePresence>
        {introVisible ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="folio-opening"
            exit={{ opacity: 0 }}
            initial={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.24 }}
          >
            <motion.div
              animate={{ opacity: introMorphing ? 0 : 1, scale: introMorphing ? 1.015 : 1 }}
              className="folio-opening__crossword"
              transition={{ duration: reducedMotion ? 0.1 : 0.62, ease: "easeOut" }}
            >
              <GreetingCrossword />
            </motion.div>
            <motion.div
              animate={introMorphing
                ? { opacity: 0, rotate: 2.86, scale: 1, y: 12 }
                : { opacity: 1, rotate: 2.86, scale: 1 }}
              className="folio-opening__paper"
              transition={{ delay: reducedMotion ? 0 : 0.12, duration: reducedMotion ? 0.1 : 0.58, ease: "linear" }}
            />
            {!introMorphing ? (
              <motion.div
                className="folio-opening__wordmark"
                layoutId="paro-identity"
                style={{ rotate: -2.86 }}
                transition={{ layout: reducedMotion ? { duration: 0.01 } : { type: "spring", stiffness: 115, damping: 23, mass: 0.9 } }}
              >
                <OpeningWordmark typedCount={typedCount} />
              </motion.div>
            ) : null}
            <motion.span
              animate={{ opacity: introReady && !introMorphing ? 1 : 0 }}
              className="folio-opening__scroll-cue"
              initial={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.28 }}
            >
              SCROLL TO ENTER ↓
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {introMorphing ? (
        <motion.a
          aria-label="Go to homepage"
          className="invoice-canvas__mark"
          data-node-id="1:19"
          href={import.meta.env.BASE_URL}
          layoutId="paro-identity"
          transition={{ layout: reducedMotion ? { duration: 0.01 } : { type: "spring", stiffness: 115, damping: 23, mass: 0.9 } }}
        >
          <img alt="" src="/assets/invoice-folio/paro-mark.svg" />
        </motion.a>
      ) : null}

        <div
          className="home-slip-pair"
          style={{
            "--slip-stack-index": 0,
            "--slip-x": `${pileGeometry[0].x}px`,
            "--slip-rotate": `${pileGeometry[0].rotate}deg`,
          } as CSSProperties}
        >
        <article
          className="invoice-intro__builder-wrap"
          data-node-id="1:24"
        >
          <div className="invoice-intro__builder">
            <div className="invoice-intro__builder-image" data-node-id="1:25">
              <img alt="Bob the Builder" src="/assets/invoice-folio/bob-builder.png" />
            </div>
            <p className="invoice-intro__builder-copy" data-node-id="1:26">
              This mf had no idea what he was doing!
              <span>i am him (AI)</span>
            </p>
            <span className="figma-pill figma-pill--builder" data-node-id="1:27">BUILDER?</span>
            <span className="figma-pill figma-pill--bob" data-node-id="1:29">BOB?</span>
          </div>
        </article>

        <article
          className="invoice-intro__name-wrap"
          data-node-id="1:31"
        >
          <div className="invoice-intro__name-card">
            <h1 id="invoice-folio-title" data-node-id="1:32">Parth Jha</h1>
            <p data-node-id="1:33">Designing for fun, even in this economy</p>
          </div>
        </article>
        </div>

      <section
        className="superai-block"
        aria-label="superr.ai"
        data-node-id="1:34"
        style={{
          "--slip-stack-index": 1,
          "--slip-x": `${pileGeometry[1].x}px`,
          "--slip-rotate": `${pileGeometry[1].rotate}deg`,
        } as CSSProperties}
      >
          <header className="superr-sheet__header">
            <h2>superr <span>[dot].</span> ai</h2>
            <div className="superr-sheet__tags" aria-label="Project context">
              <span>COSPLAYED</span>
              <span>AI-FE</span>
              <span>NDA-ISH</span>
              <span>DESIGN+ENG</span>
            </div>
          </header>

          <div className="superr-sheet__projects" aria-label="Selected Superr.ai work">
            {superrProjects.slice(0, 5).map(([title, description]) => (
              <article className="superr-project-slip" key={title}>
                <div aria-label={`${title} image placeholder`} className="superr-project-slip__image" role="img" />
                <p>{description}</p>
              </article>
            ))}
          </div>
      </section>

      {showProjectReceipts ? (
        <section className="project-slip-ledger" aria-label="Selected work">
        {workCards.map((card, index) => {
          const theme = slipThemes[card.id];
          const geometry = pileGeometry[index + 2] ?? pileGeometry[pileGeometry.length - 1];
          return (
            <button
              className="project-ledger-slip"
              data-project={card.id}
              key={card.id}
              onClick={(event) => onOpenProject(card.id, event.currentTarget)}
              style={{
                "--ledger-accent": theme.accent,
                "--ledger-background": theme.background,
                "--ledger-ink": theme.ink,
                "--slip-stack-index": index + 2,
                "--slip-x": `${geometry.x}px`,
                "--slip-rotate": `${geometry.rotate + card.tilt * 0.12}deg`,
              } as CSSProperties}
              type="button"
            >
              <span className="project-ledger-slip__meta">
                <span>{String(index + 1).padStart(2, "0")} / {card.edition}</span>
                <span>PARTH JHA</span>
              </span>
              <span className="project-ledger-slip__title">{card.title}</span>
              <span className="project-ledger-slip__image"><img alt="" src={card.image} /></span>
              <span className="project-ledger-slip__receipt">
                <span className="project-ledger-slip__description">{card.body}</span>
                {(receiptDetails[card.id] ?? []).map(([label, value]) => (
                  <span className="project-ledger-slip__line" key={label}>
                    <b>{label}</b><em>{value}</em>
                  </span>
                ))}
                <span className="project-ledger-slip__line project-ledger-slip__total">
                  <b>TOTAL</b><em>OPEN CASE FILE</em>
                </span>
              </span>
              <ArrowUpRightIcon aria-hidden="true" className="project-ledger-slip__arrow" size={24} weight="bold" />
            </button>
          );
        })}
        </section>
      ) : null}
      </div>
    </LayoutGroup>
  );
}
