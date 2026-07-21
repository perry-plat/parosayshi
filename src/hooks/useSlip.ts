import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { projects } from "../data/projects";
import type { ProjectId } from "../types/project";

export type SlipState = "closed" | "prepping" | "open" | "closing";

export interface SlipEntryTransform {
  rotate: number;
  scaleX: number;
  scaleY: number;
  x: number;
  y: number;
}

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
  const [slipEntryTransform, setSlipEntryTransform] = useState<SlipEntryTransform>({
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    x: 0,
    y: 0,
  });
  const activeCard = useRef<HTMLElement | null>(null);
  const interactionLocked = useRef(false);
  const lockedScrollY = useRef(0);
  const pushedSlipState = useRef(false);

  const focusSlip = useCallback(() => {
    slipRef.current?.focus({ preventScroll: true });
  }, [slipRef]);

  const restoreLockedScroll = useCallback(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ left: 0, top: lockedScrollY.current, behavior: "auto" });
    window.requestAnimationFrame(() => {
      if (previousScrollBehavior) root.style.scrollBehavior = previousScrollBehavior;
      else root.style.removeProperty("scroll-behavior");
    });
  }, []);

  const getSlipRect = useCallback((projectId?: ProjectId) => {
    const isMobile = window.innerWidth <= 760;
    const gutter = isMobile ? 14 : 28;
    const isNotebook = projectId === "notebook";
    const isBottomSheetReader = projectId !== "notebook";
    if (isNotebook) {
      return {
        height: window.innerHeight,
        left: 0,
        top: 0,
        width: window.innerWidth,
      };
    }
    if (isBottomSheetReader) {
      const width = isMobile ? window.innerWidth : Math.round(window.innerWidth * 0.9);
      const height = Math.round(window.innerHeight * (isMobile ? 0.93 : 0.9));
      return {
        height,
        left: Math.round((window.innerWidth - width) / 2),
        top: window.innerHeight - height,
        width,
      };
    }
    const availableWidth = window.innerWidth - gutter * 2;
    const availableHeight = window.innerHeight - gutter * 2;
    const width = isMobile
      ? Math.min(877, availableWidth)
      : Math.min(1060, availableWidth, Math.round(availableHeight * 1.44));
    const height = isMobile ? availableHeight : Math.round(width / 1.44);
    return {
      height,
      left: Math.round((window.innerWidth - width) / 2),
      top: isMobile ? gutter : Math.round((window.innerHeight - height) / 2),
      width,
    };
  }, []);

  const getSlipEntryTransform = useCallback((card: HTMLElement, projectId: ProjectId): SlipEntryTransform => {
    const source = card.getBoundingClientRect();
    const target = getSlipRect(projectId);
    const computed = window.getComputedStyle(card);
    const rotationToken = computed.getPropertyValue("--book-responsive-rotate").trim()
      || computed.getPropertyValue("--book-rotate").trim();
    let rotate = Number.parseFloat(rotationToken) || 0;
    let liveScaleX = 1;
    let liveScaleY = 1;
    if (computed.transform && computed.transform !== "none") {
      const matrix = new DOMMatrixReadOnly(computed.transform);
      liveScaleX = Math.hypot(matrix.a, matrix.b) || 1;
      liveScaleY = Math.hypot(matrix.c, matrix.d) || 1;
      rotate = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
    }
    const sourceWidth = (card.offsetWidth || source.width) * liveScaleX;
    const sourceHeight = (card.offsetHeight || source.height) * liveScaleY;

    return {
      rotate,
      scaleX: Math.max(0.08, sourceWidth / target.width),
      scaleY: Math.max(0.08, sourceHeight / target.height),
      x: source.left + source.width / 2 - (target.left + target.width / 2),
      y: source.top + source.height / 2 - (target.top + target.height / 2),
    };
  }, [getSlipRect]);

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
      if (!isProjectId(projectId) || interactionLocked.current) return;
      interactionLocked.current = true;
      activeCard.current = card;
      lockedScrollY.current = window.scrollY;
      const entryTransform = getSlipEntryTransform(card, projectId);
      flushSync(() => {
        setSlipEntryTransform(entryTransform);
        setActiveProject(projectId);
        setSlipState("prepping");
      });
      setSlipGeometry(card);
      setPaperTransformOrigin();
      document.body.classList.add("slip-is-open");
      const slip = slipRef.current;
      if (slip) {
        slip.scrollTop = 0;
      }
      setSlipState("open");
      if (reducedMotion) {
        window.setTimeout(focusSlip, 0);
      }
      if (pushState) {
        window.history.pushState({ newSlip: projectId }, "", `#${projectId}`);
        pushedSlipState.current = true;
      }
    },
    [focusSlip, getSlipEntryTransform, reducedMotion, setPaperTransformOrigin, setSlipGeometry, slipRef],
  );

  const finishClose = useCallback(() => {
    document.body.classList.remove("slip-is-returning");
    const returningCard = activeCard.current;
    const returningProject = returningCard?.dataset.project;
    restoreLockedScroll();
    document.body.style.removeProperty("--slip-document-height");
    activeCard.current = null;
    interactionLocked.current = false;
    setActiveProject(null);
    setSlipState("closed");
    if (returningProject) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const focusTarget = returningCard?.isConnected
            ? returningCard
            : document.querySelector<HTMLElement>(`.book-object[data-project="${returningProject}"]`);
          focusTarget?.focus({ preventScroll: true });
        });
      });
    }
  }, [restoreLockedScroll]);

  const closeSlip = useCallback(
    (fromHistory = false) => {
      const slip = slipRef.current;
      if (!slip || slipState === "closed" || slipState === "closing") return;
      if (!fromHistory && (pushedSlipState.current || window.location.hash === `#${activeProject}`)) {
        pushedSlipState.current = false;
        clearSlipHash();
      }
      if (activeCard.current) {
        const returningProject = activeCard.current.dataset.project;
        if (isProjectId(returningProject)) {
          setSlipEntryTransform(getSlipEntryTransform(activeCard.current, returningProject));
        }
        setSlipGeometry(activeCard.current);
      }
      document.body.classList.add("slip-is-returning");
      document.body.classList.remove("slip-is-open");
      restoreLockedScroll();
      setSlipState("closing");

      if (reducedMotion) {
        finishClose();
      }
    },
    [activeProject, finishClose, getSlipEntryTransform, reducedMotion, restoreLockedScroll, setSlipGeometry, slipRef, slipState],
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
    focusSlip,
    openSlip,
    slipEntryTransform,
    slipState,
  };
}
