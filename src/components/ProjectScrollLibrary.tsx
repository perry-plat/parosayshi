import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { ProjectId } from "../types/project";

export interface ProjectBrowseItem {
  accent: string;
  id: ProjectId;
  kind: string;
  number: string;
  period: string;
  summary: string;
  tags: string[];
  title: string;
}

interface RenderBookState {
  activate: () => void;
  isActive: boolean;
  isShelf: boolean;
}

interface ProjectScrollLibraryProps {
  items: ProjectBrowseItem[];
  onOpenItem: (id: ProjectId) => void;
  reducedMotion: boolean;
  renderBook: (item: ProjectBrowseItem, state: RenderBookState) => ReactNode;
}

const INTRO_END = 0.135;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const ease = (value: number) => {
  const safe = clamp(value);
  return safe * safe * (3 - 2 * safe);
};

function ProjectBookPosition({
  count,
  index,
  isActive,
  isShelf,
  progress,
  render,
}: {
  count: number;
  index: number;
  isActive: boolean;
  isShelf: boolean;
  progress: MotionValue<number>;
  render: () => ReactNode;
}) {
  const shelfCenter = (count - 1) / 2;
  const shelfStep = count > 1 ? 68 / (count - 1) : 0;
  const shelfX = -34 + index * shelfStep;
  const shelfY = 25 + Math.abs(index - shelfCenter) * 1.4;
  const shelfScale = 0.41 + (index % 3) * 0.025;
  const shelfRotations = [-11, -5, 4, -3, 7, -7, 10];
  const shelfRotate = shelfRotations[index % shelfRotations.length];

  const x = useTransform(progress, (value) => {
    const introMix = ease(value / INTRO_END);
    const libraryProgress = clamp((value - INTRO_END) / (1 - INTRO_END));
    const position = libraryProgress * Math.max(1, count - 1);
    const distance = index - position;
    const trackX = -9 + clamp(distance, -1, 1) * (index % 2 === 0 ? -2.2 : 2.2);
    return `${shelfX + (trackX - shelfX) * introMix}vw`;
  });

  const y = useTransform(progress, (value) => {
    const introMix = ease(value / INTRO_END);
    const libraryProgress = clamp((value - INTRO_END) / (1 - INTRO_END));
    const position = libraryProgress * Math.max(1, count - 1);
    const distance = clamp(index - position, -1.6, 1.6);
    const trackY = distance * 59 + 1.5;
    return `${shelfY + (trackY - shelfY) * introMix}svh`;
  });

  const scale = useTransform(progress, (value) => {
    const introMix = ease(value / INTRO_END);
    const libraryProgress = clamp((value - INTRO_END) / (1 - INTRO_END));
    const position = libraryProgress * Math.max(1, count - 1);
    const distance = Math.abs(index - position);
    const trackScale = 0.78 - Math.min(distance, 1.35) * 0.17;
    return shelfScale + (trackScale - shelfScale) * introMix;
  });

  const rotate = useTransform(progress, (value) => {
    const introMix = ease(value / INTRO_END);
    const libraryProgress = clamp((value - INTRO_END) / (1 - INTRO_END));
    const position = libraryProgress * Math.max(1, count - 1);
    const distance = index - position;
    const trackRotate = Math.abs(distance) < 0.48
      ? -0.6
      : Math.sign(distance || 1) * (index % 2 === 0 ? -4.5 : 4.5);
    return shelfRotate + (trackRotate - shelfRotate) * introMix;
  });

  const opacity = useTransform(progress, (value) => {
    const introMix = ease(value / INTRO_END);
    const libraryProgress = clamp((value - INTRO_END) / (1 - INTRO_END));
    const position = libraryProgress * Math.max(1, count - 1);
    const distance = Math.abs(index - position);
    const trackOpacity = distance > 1.52
      ? 0
      : 1 - Math.min(distance, 1.3) * 0.38;
    return 1 + (trackOpacity - 1) * introMix;
  });

  const zIndex = useTransform(progress, (value) => {
    if (value < INTRO_END) return 70 + index;
    const libraryProgress = clamp((value - INTRO_END) / (1 - INTRO_END));
    const position = libraryProgress * Math.max(1, count - 1);
    return 180 - Math.round(Math.abs(index - position) * 24);
  });

  return (
    <motion.div
      className="project-scroll-library__book"
      data-active={isActive ? "true" : "false"}
      data-shelf={isShelf ? "true" : "false"}
      style={{ opacity, rotate, scale, x, y, zIndex }}
    >
      <div className="project-scroll-library__book-anchor">
        {render()}
      </div>
    </motion.div>
  );
}

function ProjectMetaSlip({
  item,
  onOpen,
  reducedMotion = false,
}: {
  item: ProjectBrowseItem;
  onOpen: () => void;
  reducedMotion?: boolean;
}) {
  return (
    <motion.aside
      animate={{ opacity: 1, rotate: -0.7, x: 0 }}
      className="project-meta-slip"
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 0.8, transition: { duration: 0.12 }, x: -42 }}
      initial={reducedMotion ? false : { opacity: 0, rotate: 1.5, x: -78 }}
      key={item.id}
      style={{ "--project-slip-accent": item.accent } as CSSProperties}
      transition={reducedMotion
        ? { duration: 0 }
        : {
            opacity: { duration: 0.2 },
            rotate: { type: "spring", stiffness: 150, damping: 22 },
            x: { type: "spring", stiffness: 150, damping: 22, mass: 0.82 },
          }}
    >
      <div className="project-meta-slip__topline">
        <span>{item.kind.toUpperCase()} {item.number}</span>
        <span>{item.period}</span>
      </div>

      <div className="project-meta-slip__body">
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
      </div>

      <div className="project-meta-slip__tags" aria-label="Project areas">
        {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>

      <button onClick={onOpen} type="button">
        OPEN CASE STUDY
        <span aria-hidden="true">↗</span>
      </button>
    </motion.aside>
  );
}

export function ProjectScrollLibrary({
  items,
  onOpenItem,
  reducedMotion,
  renderBook,
}: ProjectScrollLibraryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isShelf, setIsShelf] = useState(true);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothedProgress = useSpring(scrollYProgress, {
    damping: 28,
    mass: 0.34,
    stiffness: 125,
  });
  const progress = reducedMotion ? scrollYProgress : smoothedProgress;

  useMotionValueEvent(progress, "change", (value) => {
    const nextShelf = value < INTRO_END * 0.72;
    setIsShelf((current) => current === nextShelf ? current : nextShelf);
    const libraryProgress = clamp((value - INTRO_END) / (1 - INTRO_END));
    const nextIndex = Math.round(libraryProgress * Math.max(1, items.length - 1));
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  });

  const focusProject = useCallback((index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollRange = Math.max(0, section.offsetHeight - window.innerHeight);
    const itemProgress = items.length > 1 ? index / (items.length - 1) : 0;
    const targetProgress = INTRO_END + itemProgress * (1 - INTRO_END);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      behavior: reducedMotion ? "auto" : "smooth",
      top: sectionTop + targetProgress * scrollRange,
    });
  }, [items.length, reducedMotion]);

  const handleStageKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    focusProject(clamp(activeIndex + direction, 0, items.length - 1));
  };

  if (!items.length) return null;

  if (reducedMotion) {
    return (
      <section
        aria-labelledby="scroll-library-title"
        className="project-scroll-library project-scroll-library--reduced"
      >
        <header className="project-scroll-library__heading">
          <span>SELECTED WORK / ALTERNATE VIEW</span>
          <h2 id="scroll-library-title">Things that made it out of the notebook.</h2>
          <p>Seven bound case studies. Pick one up to read.</p>
        </header>

        <div className="project-scroll-library__reduced-list">
          {items.map((item) => (
            <article className="project-scroll-library__reduced-item" key={item.id}>
              {renderBook(item, {
                activate: () => onOpenItem(item.id),
                isActive: true,
                isShelf: false,
              })}
              <ProjectMetaSlip
                item={item}
                onOpen={() => onOpenItem(item.id)}
                reducedMotion
              />
            </article>
          ))}
        </div>
      </section>
    );
  }

  const activeItem = items[activeIndex] || items[0];
  const sectionHeight = `${Math.max(620, (items.length + 1) * 86)}svh`;

  return (
    <section
      aria-labelledby="scroll-library-title"
      className="project-scroll-library"
      onKeyDown={handleStageKeyDown}
      ref={sectionRef}
      style={{ height: sectionHeight }}
    >
      <div className="project-scroll-library__sticky">
        <header className="project-scroll-library__heading" data-shelf={isShelf ? "true" : "false"}>
          <span>SELECTED WORK / ALTERNATE VIEW</span>
          <h2 id="scroll-library-title">Things that made it out of the notebook.</h2>
          <p>{isShelf ? "Seven bound case studies. Scroll to pull one forward." : "Scroll to browse. Select the focused volume to read."}</p>
        </header>

        <div className="project-scroll-library__stage">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const activate = () => {
              if (isShelf || !isActive) {
                focusProject(index);
                return;
              }
              onOpenItem(item.id);
            };

            return (
              <ProjectBookPosition
                count={items.length}
                index={index}
                isActive={isActive}
                isShelf={isShelf}
                key={item.id}
                progress={progress}
                render={() => renderBook(item, { activate, isActive, isShelf })}
              />
            );
          })}
        </div>

        <div className="project-scroll-library__meta-position">
          <AnimatePresence initial={false}>
            {!isShelf ? (
              <ProjectMetaSlip
                item={activeItem}
                key={activeItem.id}
                onOpen={() => onOpenItem(activeItem.id)}
              />
            ) : null}
          </AnimatePresence>
        </div>

        <nav aria-label="Choose a project" className="project-scroll-library__index">
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <ol>
            {items.map((item, index) => (
              <li key={item.id}>
                <button
                  aria-current={!isShelf && index === activeIndex ? "true" : undefined}
                  aria-label={`Focus ${item.title}`}
                  onClick={() => focusProject(index)}
                  type="button"
                >
                  <span />
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <span className="project-scroll-library__baseline" aria-hidden="true" />
      </div>
    </section>
  );
}
