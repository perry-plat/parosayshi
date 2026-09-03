import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import PauseIcon from "@hugeicons/core-free-icons/PauseIcon";
import PlayIcon from "@hugeicons/core-free-icons/PlayIcon";
import { useEffect, useRef, useState } from "react";
import type { FolioProject, FolioProjectMedia } from "../data/folioProjects";

interface FolioProjectViewerProps {
  onClose: () => void;
  project: FolioProject;
  reducedMotion: boolean;
}

function FolioProjectVideo({ media, reducedMotion }: { media: Extract<FolioProjectMedia, { kind: "video" }>; reducedMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(!reducedMotion);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  };

  return (
    <>
      <video
        aria-label={media.ariaLabel}
        autoPlay={!reducedMotion}
        loop
        muted
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        playsInline
        poster={media.poster}
        preload="metadata"
        ref={videoRef}
        src={media.src}
        style={{ objectFit: media.fit, objectPosition: media.position }}
      />
      <button
        aria-label={`${playing ? "Pause" : "Play"} ${media.ariaLabel}`}
        className="folio-project-viewer__media-control"
        onClick={togglePlayback}
        type="button"
      >
        <HugeiconsIcon
          aria-hidden="true"
          icon={playing ? PauseIcon : PlayIcon}
          size={16}
          strokeWidth={2}
        />
      </button>
    </>
  );
}

export function FolioProjectViewer({ onClose, project, reducedMotion }: FolioProjectViewerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const body = document.body;
    const lockedScrollY = window.scrollY;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousBodyOverflow = body.style.overflow;

    body.classList.add("folio-project-viewer-open");
    body.style.position = "fixed";
    body.style.top = `-${lockedScrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus({ preventScroll: true }));

    return () => {
      body.classList.remove("folio-project-viewer-open");
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      body.style.overflow = previousBodyOverflow;
      window.scrollTo({ left: 0, top: lockedScrollY, behavior: "auto" });
    };
  }, [project.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = viewerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
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
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.section
      animate={{ opacity: 1 }}
      aria-label={`${project.title} project gallery`}
      aria-modal="true"
      className="folio-project-viewer"
      data-project={project.id}
      exit={{ opacity: 0 }}
      id="folio-project-viewer"
      initial={reducedMotion ? false : { opacity: 0 }}
      ref={viewerRef}
      role="dialog"
      transition={reducedMotion ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <div aria-hidden="true" className="folio-project-viewer__wash" />

      <aside className="folio-project-viewer__details">
        {project.logo ? (
          <img alt="" aria-hidden="true" className="folio-project-viewer__logo" src={project.logo} />
        ) : null}
        <div className="folio-project-viewer__identity">
          <h2>{project.title}</h2>
          {project.id !== "superr" ? <span>{project.year}</span> : null}
        </div>
        <p className="folio-project-viewer__description">{project.description}</p>
        {project.id !== "superr" ? (
          <p className="folio-project-viewer__services">{project.services.join(" / ")}</p>
        ) : null}
        {project.externalUrl ? (
          <a
            className="folio-project-viewer__external"
            href={project.externalUrl}
            rel="noreferrer"
            target="_blank"
          >
            {project.externalLabel || "Visit project"}
            <HugeiconsIcon aria-hidden="true" icon={ArrowUpRight01Icon} size={13} strokeWidth={1.8} />
          </a>
        ) : null}
      </aside>

      <div
        aria-label={`${project.title} media gallery. Scroll to explore the project.`}
        className="folio-project-viewer__reel"
        role="region"
        tabIndex={0}
      >
        {project.media.map((media, index) => (
          <motion.figure
            animate={{ opacity: 1, y: 0 }}
            className={`folio-project-viewer__media folio-project-viewer__media--${media.ratio}`}
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            key={`${media.src}-${index}`}
            style={{ background: media.background }}
            transition={reducedMotion ? { duration: 0 } : { delay: Math.min(index * 0.045, 0.18), duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {media.kind === "image" ? (
              <img
                alt={media.alt}
                loading={index > 1 ? "lazy" : "eager"}
                src={media.src}
                style={{ objectFit: media.fit, objectPosition: media.position }}
              />
            ) : <FolioProjectVideo media={media} reducedMotion={reducedMotion} />}
          </motion.figure>
        ))}
      </div>

      <button
        aria-label={`Close ${project.title} project gallery`}
        className="folio-project-viewer__close"
        onClick={onClose}
        ref={closeButtonRef}
        type="button"
      >
        Close
      </button>
    </motion.section>
  );
}
