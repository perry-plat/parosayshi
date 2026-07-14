import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { projects } from "../data/projects";
import type { ProjectId } from "../types/project";

export type SlipState = "closed" | "prepping" | "open" | "closing";

interface UseSlipArgs {
  paperRef: RefObject<HTMLElement | null>;
  slipRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
}

const isProjectId = (id: string | undefined): id is ProjectId =>
  Boolean(id && Object.prototype.hasOwnProperty.call(projects, id));

export function useSlip({ paperRef, slipRef, reducedMotion }: UseSlipArgs) {
  const [slipState, setSlipState] = useState<SlipState>("closed");
  const [activeProject, setActiveProject] = useState<ProjectId | null>(null);
  const activeCard = useRef<HTMLElement | null>(null);
  const lockedScrollY = useRef(0);
  const pushedSlipState = useRef(false);

  const getSlipRect = useCallback((projectId?: ProjectId) => {
    const isMobile = window.innerWidth <= 760;
    const gutter = isMobile ? 14 : 28;
    const isNotebook = projectId === "notebook";
    if (isNotebook) {
      return {
        height: window.innerHeight,
        left: 0,
        top: 0,
        width: window.innerWidth,
      };
    }
    const availableWidth = window.innerWidth - gutter * 2;
    const availableHeight = window.innerHeight - gutter * 2;
    const width = isMobile
      ? Math.min(877, availableWidth)
      : Math.min(1120, availableWidth, Math.round(availableHeight * 1.44));
    const height = isMobile ? availableHeight : Math.round(width / 1.44);
    return {
      height,
      left: Math.round((window.innerWidth - width) / 2),
      top: isMobile ? gutter : Math.round((window.innerHeight - height) / 2),
      width,
    };
  }, []);

  const setSlipGeometry = useCallback(
    (_card: HTMLElement) => {
      const slip = slipRef.current;
      if (!slip) return;
      const projectId = _card.dataset.project;
      const to = getSlipRect(isProjectId(projectId) ? projectId : undefined);
      slip.style.left = `${to.left}px`;
      slip.style.top = `${to.top}px`;
      slip.style.width = `${to.width}px`;
      slip.style.height = `${to.height}px`;
    },
    [getSlipRect, slipRef],
  );

  const setPaperTransformOrigin = useCallback(() => {
    const paper = paperRef.current;
    if (!paper) return;
    const rect = paper.getBoundingClientRect();
    const shell = paper.parentElement;
    const originX = window.innerWidth / 2 - rect.left;
    const originY = window.innerHeight / 2 - rect.top;
    paper.style.setProperty("--sheet-transform-origin", `${originX}px ${originY}px`);
    shell?.style.setProperty("--snapshot-paper-left", `${rect.left}px`);
    shell?.style.setProperty("--snapshot-paper-top", `${rect.top}px`);
    shell?.style.setProperty("--snapshot-paper-width", `${rect.width}px`);
    document.body.style.setProperty("--slip-document-height", `${document.documentElement.scrollHeight}px`);
  }, [paperRef]);

  const clearSlipHash = () => {
    const cleanUrl = new URL(window.location.href);
    cleanUrl.hash = "";
    window.history.replaceState(null, "", cleanUrl.href);
  };

  const openSlip = useCallback(
    (card: HTMLElement, pushState = true) => {
      const projectId = card.dataset.project;
      if (!isProjectId(projectId)) return;
      activeCard.current = card;
      lockedScrollY.current = window.scrollY;
      flushSync(() => {
        setActiveProject(projectId);
        setSlipState("prepping");
      });
      setSlipGeometry(card);
      setPaperTransformOrigin();
      document.querySelectorAll<HTMLElement>("[data-project]").forEach((item) => {
        item.setAttribute("aria-expanded", String(item === card));
      });
      document.body.classList.add("slip-is-open");
      const slip = slipRef.current;
      if (slip) {
        slip.scrollTop = 0;
      }
      setSlipState("open");
      window.setTimeout(() => slip?.focus({ preventScroll: true }), reducedMotion ? 0 : 500);
      if (pushState) {
        window.history.pushState({ newSlip: projectId }, "", `#${projectId}`);
        pushedSlipState.current = true;
      }
    },
    [reducedMotion, setPaperTransformOrigin, setSlipGeometry, slipRef],
  );

  const finishClose = useCallback(() => {
    document.body.classList.remove("slip-is-returning");
    const returningProject = activeCard.current?.dataset.project;
    window.scrollTo(0, lockedScrollY.current);
    document.body.style.removeProperty("--slip-document-height");
    activeCard.current = null;
    setActiveProject(null);
    setSlipState("closed");
    if (returningProject) {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`.book-object[data-project="${returningProject}"]`)?.focus({ preventScroll: true });
      });
    }
  }, []);

  const closeSlip = useCallback(
    (fromHistory = false) => {
      const slip = slipRef.current;
      if (!slip || slipState === "closed" || slipState === "closing") return;
      if (!fromHistory && (pushedSlipState.current || window.location.hash === `#${activeProject}`)) {
        pushedSlipState.current = false;
        clearSlipHash();
      }
      if (activeCard.current) setSlipGeometry(activeCard.current);
      document.querySelectorAll<HTMLElement>("[data-project]").forEach((item) => {
        item.setAttribute("aria-expanded", "false");
      });
      document.body.classList.add("slip-is-returning");
      document.body.classList.remove("slip-is-open");
      setSlipState("closing");

      if (reducedMotion) {
        finishClose();
      }
    },
    [activeProject, finishClose, reducedMotion, setSlipGeometry, slipRef, slipState],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && slipState !== "closed") closeSlip();
    };
    const onResize = () => {
      if (activeCard.current && slipState !== "closed") {
        setSlipGeometry(activeCard.current);
      }
    };
    const onPopState = () => {
      if (slipState !== "closed") {
        pushedSlipState.current = false;
        closeSlip(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("popstate", onPopState);
    };
  }, [closeSlip, setSlipGeometry, slipState]);

  useEffect(() => {
    return () => {
      document.body.classList.remove("slip-is-open", "slip-is-returning");
      document.body.style.removeProperty("--slip-document-height");
    };
  }, []);

  return {
    activeProject,
    closeSlip,
    finishClose,
    openSlip,
    slipState,
  };
}
