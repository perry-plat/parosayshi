import { useEffect, useRef, useState } from "react";
import type { FolioProjectMedia } from "../data/folioProjects";

type AssetState = "loading" | "ready" | "error" | "blocked";

export function FolioProjectAsset({ media, reducedMotion, onExpand }: { media: FolioProjectMedia; reducedMotion: boolean; onExpand?: (trigger: HTMLButtonElement) => void }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const resumeRef = useRef<() => void>(() => undefined);
  const [hasVideoFrame, setHasVideoFrame] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<AssetState>("loading");
  const label = media.kind === "image" ? media.alt : media.ariaLabel;
  const source = attempt === 0 ? media.src : `${media.src}${media.src.includes("?") ? "&" : "?"}retry=${attempt}`;

  useEffect(() => {
    let active = true;
    setHasVideoFrame(false);
    let watchdog: ReturnType<typeof setTimeout>;
    const update = (next: AssetState) => {
      if (!active) return;
      clearTimeout(watchdog);
      setState(next);
    };
    const loading = () => {
      if (!active) return;
      setState("loading");
      clearTimeout(watchdog);
      watchdog = setTimeout(() => update("error"), 20000);
    };
    const failed = () => update("error");
    loading();

    if (media.kind === "image") {
      const image = imageRef.current!;
      const loaded = () => {
        void image.decode().then(() => update("ready")).catch(failed);
      };
      image.addEventListener("load", loaded);
      image.addEventListener("error", failed);
      if (image.complete) {
        if (image.naturalWidth > 0) loaded();
        else failed();
      }
      return () => {
        active = false;
        clearTimeout(watchdog);
        image.removeEventListener("load", loaded);
        image.removeEventListener("error", failed);
      };
    }

    const video = videoRef.current!;
    video.defaultPlaybackRate = media.playbackRate ?? 1;
    video.playbackRate = media.playbackRate ?? 1;
    let inView = false;
    let pendingPlay = false;
    const shouldPlay = () => inView && !document.hidden && !reducedMotion;
    const syncPlayback = () => {
      if (!active) return;
      if (!shouldPlay()) {
        video.pause();
        return;
      }
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || pendingPlay || !video.paused) return;
      pendingPlay = true;
      void video.play().then(() => {
        if (!active) return;
        if (!shouldPlay()) video.pause();
        else update("ready");
      }).catch((error: DOMException) => {
        if (active && shouldPlay() && error.name !== "AbortError") {
          update(error.name === "NotAllowedError" ? "blocked" : "error");
        }
      }).finally(() => { pendingPlay = false; });
    };
    const ready = () => { update("ready"); syncPlayback(); };
    const waiting = () => { if (shouldPlay()) loading(); };
    let frameCallback: number | undefined;
    const hideVideo = () => {
      setHasVideoFrame(false);
      if (frameCallback !== undefined) video.cancelVideoFrameCallback(frameCallback);
    };
    const playing = () => {
      update("ready");
      if ("requestVideoFrameCallback" in video) {
        frameCallback = video.requestVideoFrameCallback(() => {
          if (active && !video.paused && shouldPlay()) setHasVideoFrame(true);
        });
      } else setHasVideoFrame(true);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { root: video.closest(".folio-project-viewer__reel"), threshold: 0 });

    resumeRef.current = syncPlayback;
    observer.observe(video);
    video.addEventListener("loadeddata", ready);
    video.addEventListener("canplay", ready);
    video.addEventListener("playing", playing);
    // Preserve the last decoded frame during pauses and buffering.
    // Returning to the poster here causes visible jumps in looping animations.
    video.addEventListener("error", hideVideo);
    video.addEventListener("waiting", waiting);
    video.addEventListener("error", failed);
    document.addEventListener("visibilitychange", syncPlayback);
    window.addEventListener("pageshow", syncPlayback);
    if (video.error) failed();
    else if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) ready();

    return () => {
      active = false;
      clearTimeout(watchdog);
      observer.disconnect();
      resumeRef.current = () => undefined;
      video.pause();
      video.removeEventListener("loadeddata", ready);
      video.removeEventListener("canplay", ready);
      video.removeEventListener("playing", playing);

      video.removeEventListener("error", hideVideo);
      if (frameCallback !== undefined) video.cancelVideoFrameCallback(frameCallback);
      video.removeEventListener("waiting", waiting);
      video.removeEventListener("error", failed);
      document.removeEventListener("visibilitychange", syncPlayback);
      window.removeEventListener("pageshow", syncPlayback);
    };
  }, [media.kind, media.playbackRate, source, reducedMotion]);

  useEffect(() => {
    const retryOnline = () => {
      if (state === "error") setAttempt((value) => value + 1);
    };
    window.addEventListener("online", retryOnline);
    return () => window.removeEventListener("online", retryOnline);
  }, [state]);

  return (
    <div className="folio-project-asset" data-media-state={state} aria-busy={state === "loading"}>
      {media.kind === "image" ? (
        <img key={source} ref={imageRef} alt={media.alt} loading="eager" decoding="async" src={source}
          style={{ objectFit: media.fit, objectPosition: media.position, opacity: state === "ready" ? 1 : 0 }} />
      ) : (
        <>
        {media.poster && <img aria-hidden="true" alt="" src={media.poster} className="folio-project-asset__poster" style={{ objectFit: media.fit, objectPosition: media.position }} />}
        <video key={source} ref={videoRef} aria-label={media.ariaLabel} controls={false} loop muted playsInline
          poster={media.poster} preload="auto" src={source} style={{ position: "absolute", inset: 0, objectFit: media.fit, objectPosition: media.position, opacity: hasVideoFrame ? 1 : 0 }} />
        </>
      )}
      {onExpand && media.kind === "image" && state === "ready" && <button
        className="folio-project-asset__expand" type="button" data-cursor-keep
        aria-label={`Expand ${media.alt}`} aria-haspopup="dialog"
        onClick={(event) => onExpand(event.currentTarget)}
      />}
      {state !== "ready" && (
        <div className={`folio-project-asset__status folio-project-asset__status--${state}`} role="status">
          <span>{state === "loading" ? "Loading media…" : state === "blocked" ? "Tap to start video" : "This media couldn’t load."}</span>
          {state !== "loading" && (
            <button type="button" aria-label={`${state === "blocked" ? "Start" : "Retry"} ${label}`}
              onClick={() => {
                if (state === "blocked") resumeRef.current();
                else { setState("loading"); setAttempt((value) => value + 1); }
              }}>{state === "blocked" ? "Start video" : "Retry"}</button>
          )}
        </div>
      )}
    </div>
  );
}
