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
    originX: number;
    originY: number;
    pointerId: number;
    rect: DOMRect;
    startX: number;
    startY: number;
  } | null>(null);
  const suppressBookClick = useRef(false);
  const centerTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (centerTimer.current !== null) window.clearTimeout(centerTimer.current);
  }, []);

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
      originX: position.x,
      originY: position.y,
      pointerId: event.pointerId,
      rect,
      startX: event.clientX,
      startY: event.clientY,
    };
    suppressBookClick.current = false;
  };

  const moveBook = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!suppressBookClick.current) {
      if (Math.hypot(deltaX, deltaY) <= 12) return;
      suppressBookClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }

    const visibleEdge = 110;
    const clampedX = Math.max(visibleEdge - drag.rect.right, Math.min(window.innerWidth - visibleEdge - drag.rect.left, deltaX));
    const clampedY = Math.max(visibleEdge - drag.rect.bottom, Math.min(window.innerHeight - visibleEdge - drag.rect.top, deltaY));
    setPosition({ x: drag.originX + clampedX, y: drag.originY + clampedY });
  };

  const endBookDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    setDragging(false);
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
        data-view-reveal
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
