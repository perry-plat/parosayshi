import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { FolioSiteHeader } from "./FolioSiteHeader";
import { Sketchbook } from "./Sketchbook";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useViewportReveal } from "../hooks/useViewportReveal";

interface PlayPageProps {
  onClose: (hash?: string) => void;
}

export function PlayPage({ onClose }: PlayPageProps) {
  const reducedMotion = useReducedMotion();
  useViewportReveal(Boolean(reducedMotion));
  const [closeRequest, setCloseRequest] = useState(0);
  const [openRequest, setOpenRequest] = useState(0);
  const [centering, setCentering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragState = useRef<{
    element: HTMLDivElement;
    frameId: number;
    lastAt: number;
    lastClientX: number;
    originX: number;
    originY: number;
    pendingClientX: number;
    pendingClientY: number;
    pointerId: number;
    rect: DOMRect;
    startX: number;
    startY: number;
    tilt: number;
  } | null>(null);
  const suppressBookClick = useRef(false);
  const centerTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (centerTimer.current !== null) window.clearTimeout(centerTimer.current);
    if (dragState.current?.frameId) window.cancelAnimationFrame(dragState.current.frameId);
  }, []);

  const applyBookDragFrame = (
    drag: NonNullable<typeof dragState.current>,
    clientX: number,
    clientY: number,
  ) => {
    const deltaX = clientX - drag.startX;
    const deltaY = clientY - drag.startY;
    const visibleEdge = 110;
    const clampedX = Math.max(visibleEdge - drag.rect.right, Math.min(window.innerWidth - visibleEdge - drag.rect.left, deltaX));
    const clampedY = Math.max(visibleEdge - drag.rect.bottom, Math.min(window.innerHeight - visibleEdge - drag.rect.top, deltaY));
    const now = performance.now();
    const elapsed = Math.max(8, now - drag.lastAt);
    const horizontalVelocity = (clientX - drag.lastClientX) / elapsed;
    const targetTilt = Math.max(-1.05, Math.min(1.05, horizontalVelocity * 2.65));
    const smoothing = 1 - Math.exp(-elapsed / 68);
    drag.tilt += (targetTilt - drag.tilt) * smoothing;

    const nextPosition = {
      x: drag.originX + clampedX,
      y: drag.originY + clampedY,
    };
    drag.element.style.setProperty("--play-book-x", `${nextPosition.x}px`);
    drag.element.style.setProperty("--play-book-y", `${nextPosition.y}px`);
    drag.element.style.setProperty("--play-book-tilt", `${drag.tilt.toFixed(2)}deg`);
    drag.lastAt = now;
    drag.lastClientX = clientX;
    return nextPosition;
  };

  const openNotebook = () => {
    if (centering) return;
    const isCentered = Math.abs(position.x) < 1 && Math.abs(position.y) < 1;

    if (isCentered || reducedMotion) {
      setPosition({ x: 0, y: 0 });
      setOpenRequest((request) => request + 1);
      return;
    }

    setCentering(true);
    setPosition({ x: 0, y: 0 });
    setOpenRequest((request) => request + 1);
    centerTimer.current = window.setTimeout(() => {
      setCentering(false);
      centerTimer.current = null;
    }, 520);
  };

  const closeNotebookFromWall = (event: MouseEvent<HTMLElement>) => {
    if (!(event.target instanceof Element)) return;
    if (
      event.target.closest(
        ".css-flipbook-book, .mobile-notebook-book, .folio-site-header",
      )
    ) return;
    setCloseRequest((request) => request + 1);
  };

  const startBookDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (centering) return;
    if (event.button !== 0) return;
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest(".css-flipbook-book, .mobile-notebook-book")) return;
    const isClosed = Boolean(
      event.currentTarget.querySelector(
        ".sketchbook-realism.is-front-cover, .mobile-notebook-book .notebook-page.is-photo-cover",
      ),
    );
    if (isClosed && !event.target.closest(".notebook-page.is-photo-cover")) return;

    const visibleBook = event.currentTarget.querySelector<HTMLElement>(
      ".notebook-reader-object, .mobile-notebook-book",
    );
    const rect = (visibleBook ?? event.currentTarget).getBoundingClientRect();
    dragState.current = {
      element: event.currentTarget,
      frameId: 0,
      lastAt: performance.now(),
      lastClientX: event.clientX,
      originX: position.x,
      originY: position.y,
      pendingClientX: event.clientX,
      pendingClientY: event.clientY,
      pointerId: event.pointerId,
      rect,
      startX: event.clientX,
      startY: event.clientY,
      tilt: 0,
    };
    suppressBookClick.current = false;
    setDragging(true);
  };

  const moveBook = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const coalesced = event.nativeEvent.getCoalescedEvents?.();
    const latest = coalesced?.[coalesced.length - 1] ?? event.nativeEvent;
    const deltaX = latest.clientX - drag.startX;
    const deltaY = latest.clientY - drag.startY;
    if (!suppressBookClick.current) {
      if (Math.hypot(deltaX, deltaY) <= 12) return;
      suppressBookClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    drag.pendingClientX = latest.clientX;
    drag.pendingClientY = latest.clientY;
    if (drag.frameId) return;
    drag.frameId = window.requestAnimationFrame(() => {
      drag.frameId = 0;
      if (dragState.current !== drag) return;
      applyBookDragFrame(drag, drag.pendingClientX, drag.pendingClientY);
    });
  };

  const endBookDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    window.cancelAnimationFrame(drag.frameId);
    const nextPosition = suppressBookClick.current
      ? applyBookDragFrame(drag, event.clientX, event.clientY)
      : { x: drag.originX, y: drag.originY };
    setPosition(nextPosition);
    if (drag.element.hasPointerCapture(event.pointerId)) {
      drag.element.releasePointerCapture(event.pointerId);
    }
    drag.element
      .querySelector<HTMLElement>(".css-flipbook-book:focus, .mobile-notebook-book:focus")
      ?.blur();
    dragState.current = null;
    setDragging(false);
    window.requestAnimationFrame(() => {
      drag.element.style.setProperty("--play-book-tilt", "0deg");
    });
  };

  const stopClickAfterDrag = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressBookClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    window.setTimeout(() => {
      suppressBookClick.current = false;
    }, 0);
  };

  const notebookStyle = {
    "--play-book-x": `${position.x}px`,
    "--play-book-y": `${position.y}px`,
  } as CSSProperties;

  return (
    <main className="invoice-folio invoice-folio--wall play-page" onClick={closeNotebookFromWall}>
      <FolioSiteHeader currentPage="play" onNavigate={onClose} />
      <div
        className="inline-notebook-reader play-page__notebook"
        data-centering={centering ? "true" : "false"}
        data-dragging={dragging ? "true" : "false"}
        data-view-reveal="artifact"
        onClickCapture={stopClickAfterDrag}
        onPointerCancel={endBookDrag}
        onPointerDown={startBookDrag}
        onPointerMove={moveBook}
        onPointerUp={endBookDrag}
        style={notebookStyle}
      >
        <Sketchbook
          allowSwipe={false}
          closeRequest={closeRequest}
          onOpenRequest={openNotebook}
          openRequest={openRequest}
          variant="expanded"
        />
      </div>
    </main>
  );
}
