import { motion } from "motion/react";
import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "../styles/project-media-carousel.css";

export type ProjectCarouselMedia =
  | {
      alt: string;
      background?: CSSProperties["background"];
      fit?: CSSProperties["objectFit"];
      kind: "image";
      position?: CSSProperties["objectPosition"];
      src: string;
    }
  | {
      ariaLabel: string;
      background?: CSSProperties["background"];
      fit?: CSSProperties["objectFit"];
      kind: "video";
      position?: CSSProperties["objectPosition"];
      poster?: string;
      src: string;
    };

export interface ProjectMediaCarouselSize {
  aspectRatio?: CSSProperties["aspectRatio"];
  gap?: number;
  height?: CSSProperties["height"];
  peek?: number;
  width?: CSSProperties["width"];
}

export interface ProjectMediaCarouselProps {
  ariaLabel: string;
  autoAdvanceMs?: number;
  hoveredPhotoAdvanceMs?: number;
  media: readonly ProjectCarouselMedia[];
  reducedMotion?: boolean;
  size?: ProjectMediaCarouselSize;
  tileCount?: number;
  transitionMs?: number;
  videoAdvanceMs?: number;
  visibleTiles?: number;
}

const DEFAULT_SIZE: Required<Pick<ProjectMediaCarouselSize, "aspectRatio" | "gap" | "peek" | "width">> = {
  aspectRatio: "1 / 1",
  gap: 16,
  peek: 42,
  width: "100%",
};

function buildTiles(media: readonly ProjectCarouselMedia[], tileCount?: number) {
  if (media.length === 0) return [];
  const count = Math.max(1, Math.round(tileCount ?? media.length));
  return Array.from({ length: count }, (_, index) => media[index % media.length]);
}

export function ProjectMediaCarousel({
  ariaLabel,
  autoAdvanceMs = 700,
  hoveredPhotoAdvanceMs = 1800,
  media,
  reducedMotion = false,
  size,
  tileCount,
  transitionMs = 800,
  videoAdvanceMs = 1000,
  visibleTiles = 1,
}: ProjectMediaCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const resetFrameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const [resetting, setResetting] = useState(false);
  const [step, setStep] = useState(0);

  const tiles = useMemo(() => buildTiles(media, tileCount), [media, tileCount]);
  const visibleCount = Math.max(1, Math.round(visibleTiles));
  const gap = Math.max(0, size?.gap ?? DEFAULT_SIZE.gap);
  const peek = Math.max(0, size?.peek ?? DEFAULT_SIZE.peek);
  const clones = tiles.slice(0, Math.min(visibleCount, tiles.length));
  const renderedTiles = tiles.length > 1 ? [...tiles, ...clones] : tiles;
  const activeMedia = tiles.length > 0 ? tiles[activeIndex % tiles.length] : undefined;
  const logicalIndex = tiles.length > 0 ? activeIndex % tiles.length : 0;

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const measure = () => {
      const availableWidth = viewport.clientWidth - peek - gap * (visibleCount - 1);
      setStep(Math.max(0, availableWidth / visibleCount) + gap);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [gap, peek, visibleCount]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (tiles.length < 2 || reducedMotion || !inView || !pageVisible || resetting) return undefined;
    if (hovered && activeMedia?.kind === "video") return undefined;

    const delay = hovered
      ? hoveredPhotoAdvanceMs
      : activeMedia?.kind === "video"
        ? videoAdvanceMs
        : autoAdvanceMs;
    const timer = window.setTimeout(() => setActiveIndex((index) => index + 1), delay);
    return () => window.clearTimeout(timer);
  }, [activeIndex, activeMedia?.kind, autoAdvanceMs, hovered, hoveredPhotoAdvanceMs, inView, pageVisible, reducedMotion, resetting, tiles.length, videoAdvanceMs]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.querySelectorAll<HTMLVideoElement>("video[data-carousel-index]").forEach((video) => {
      const renderedIndex = Number(video.dataset.carouselIndex);
      const shouldPlay = !reducedMotion && inView && pageVisible && renderedIndex === activeIndex;
      if (shouldPlay) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      }
      else video.pause();
    });
  }, [activeIndex, inView, pageVisible, reducedMotion, tiles.length]);

  useEffect(() => () => {
    if (resetFrameRef.current !== null) window.cancelAnimationFrame(resetFrameRef.current);
  }, []);

  const onShiftComplete = () => {
    if (tiles.length < 2 || activeIndex < tiles.length) return;
    setResetting(true);
    setActiveIndex(0);
    resetFrameRef.current = window.requestAnimationFrame(() => {
      resetFrameRef.current = window.requestAnimationFrame(() => setResetting(false));
    });
  };

  const goPrevious = () => {
    if (tiles.length < 2 || resetting) return;
    setActiveIndex((index) => (index <= 0 ? tiles.length - 1 : index - 1));
  };

  const goNext = () => {
    if (tiles.length < 2 || resetting) return;
    setActiveIndex((index) => Math.min(index + 1, tiles.length));
  };

  const rootStyle: CSSProperties = {
    aspectRatio: size?.height ? undefined : size?.aspectRatio ?? DEFAULT_SIZE.aspectRatio,
    height: size?.height,
    width: size?.width ?? DEFAULT_SIZE.width,
  };
  const tileWidth = step > 0 ? Math.max(0, step - gap) : 0;

  if (tiles.length === 0) return null;

  return (
    <section
      aria-label={ariaLabel}
      className="project-media-carousel"
      data-reduced-motion={reducedMotion ? "true" : "false"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={rootStyle}
    >
      <div className="project-media-carousel__viewport" ref={viewportRef}>
        <motion.div
          animate={{ x: reducedMotion ? 0 : -(activeIndex * step) }}
          className="project-media-carousel__track"
          onAnimationComplete={onShiftComplete}
          style={{ gap }}
          transition={resetting || reducedMotion ? { duration: 0 } : {
            duration: transitionMs / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {renderedTiles.map((item, index) => {
            const active = index === activeIndex;
            return (
              <motion.figure
                animate={{ scale: reducedMotion || active ? 1 : 0.985 }}
                aria-hidden={!active}
                className="project-media-carousel__tile"
                key={`${item.src}-${index}`}
                style={{
                  background: item.background,
                  flexBasis: tileWidth || `calc(100% - ${peek}px)`,
                }}
                transition={resetting || reducedMotion ? { duration: 0 } : {
                  duration: transitionMs / 1000,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {item.kind === "image" ? (
                  <img
                    alt={item.alt}
                    draggable={false}
                    src={item.src}
                    style={{ objectFit: item.fit, objectPosition: item.position }}
                  />
                ) : (
                  <video
                    aria-label={item.ariaLabel}
                    data-carousel-index={index}
                    loop={tiles.length < 2 || !hovered}
                    muted
                    onEnded={() => {
                      if (hovered && index === activeIndex) goNext();
                    }}
                    playsInline
                    poster={item.poster}
                    preload="metadata"
                    src={item.src}
                    style={{ objectFit: item.fit, objectPosition: item.position }}
                  />
                )}
              </motion.figure>
            );
          })}
        </motion.div>
      </div>
      {tiles.length > 1 ? (
        <div aria-label="Choose project media" className="project-media-carousel__controls" data-cursor-keep role="group">
          <button aria-label="Show previous project media" data-cursor-keep onClick={goPrevious} type="button">
            <svg aria-hidden="true" fill="none" viewBox="0 0 32 32">
              <path d="M21 6 10 16l11 10" />
            </svg>
          </button>
          <span aria-label={`Artifact ${logicalIndex + 1} of ${tiles.length}`} className="project-media-carousel__count">
            {String(logicalIndex + 1).padStart(2, "0")} / {String(tiles.length).padStart(2, "0")}
          </span>
          <button aria-label="Show next project media" data-cursor-keep onClick={goNext} type="button">
            <svg aria-hidden="true" fill="none" viewBox="0 0 32 32">
              <path d="m11 6 11 10-11 10" />
            </svg>
          </button>
        </div>
      ) : null}
    </section>
  );
}
