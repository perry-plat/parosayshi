import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { projects } from "../data/projects";
import type { ProjectId } from "../types/project";

export type SlipState = "closed" | "prepping" | "open" | "closing";

interface UseSlipArgs {
  paperRef: RefObject<HTMLElement | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
  slipRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
}

const isProjectId = (id: string | undefined): id is ProjectId =>
  Boolean(id && Object.prototype.hasOwnProperty.call(projects, id));

export function useSlip({ paperRef, overlayRef, slipRef, reducedMotion }: UseSlipArgs) {
  const [slipState, setSlipState] = useState<SlipState>("closed");
  const [activeProject, setActiveProject] = useState<ProjectId | null>(null);
  const activeCard = useRef<HTMLElement | null>(null);
  const paperGhost = useRef<HTMLElement | null>(null);
  const pushedSlipState = useRef(false);

  const removePaperGhost = useCallback(() => {
    paperGhost.current?.remove();
    paperGhost.current = null;
  }, []);

  const getSlipRect = useCallback(() => {
    const isMobile = window.innerWidth <= 760;
    const gutter = isMobile ? 14 : 28;
    const width = Math.min(877, window.innerWidth - gutter * 2);
    const overflowTail = isMobile ? 96 : 180;
    const height = Math.max(360, window.innerHeight - gutter + overflowTail);
    return {
      height,
      left: Math.round((window.innerWidth - width) / 2),
      top: gutter,
      width,
    };
  }, []);

  const setSlipGeometry = useCallback(
    (card: HTMLElement) => {
      const slip = slipRef.current;
      if (!slip) return;
      const from = card.getBoundingClientRect();
      const to = getSlipRect();
      const scaleX = Math.max(0.96, from.width / to.width);
      const scaleY = Math.max(0.96, from.height / to.height);
      const tilt = Number.parseFloat(card.dataset.slipTilt || "0");
      const fromX = (from.left - to.left) * 0.12;
      const fromY = (from.top - to.top) * 0.08;
      slip.style.left = `${to.left}px`;
      slip.style.top = `${to.top}px`;
      slip.style.width = `${to.width}px`;
      slip.style.height = `${to.height}px`;
      slip.style.setProperty("--slip-from-x", `${fromX}px`);
      slip.style.setProperty("--slip-from-y", `${fromY}px`);
      slip.style.setProperty("--slip-from-scale-x", String(scaleX));
      slip.style.setProperty("--slip-from-scale-y", String(scaleY));
      slip.style.setProperty("--slip-from-rotate", `${tilt * 0.18}deg`);
    },
    [getSlipRect, slipRef],
  );

  const getGhostTargetRect = useCallback(() => {
    const isMobile = window.innerWidth <= 760;
    const gutter = isMobile ? 14 : 28;
    const width = Math.min(877, window.innerWidth - gutter * 2);
    const height = isMobile
      ? Math.min(900, Math.max(680, window.innerHeight + 120))
      : Math.min(1152, Math.max(980, window.innerHeight + 260));
    const centeredLeft = (window.innerWidth - width) / 2;
    return {
      height,
      left: Math.round(isMobile ? centeredLeft - width * 0.16 : centeredLeft - width * 0.42),
      top: isMobile ? 18 : -8,
      width,
    };
  }, []);

  const setPaperGhostGeometry = useCallback(() => {
    const paper = paperRef.current;
    const ghost = paperGhost.current;
    if (!paper || !ghost) return;
    const paperRect = paper.getBoundingClientRect();
    const target = getGhostTargetRect();
    ghost.style.setProperty("--ghost-start-left", `${Math.round(paperRect.left)}px`);
    ghost.style.setProperty("--ghost-start-top", `${Math.round(paperRect.top)}px`);
    ghost.style.setProperty("--ghost-start-width", `${Math.round(paperRect.width)}px`);
    ghost.style.setProperty("--ghost-start-height", `${Math.round(target.height)}px`);
    ghost.style.setProperty("--ghost-target-left", `${target.left}px`);
    ghost.style.setProperty("--ghost-target-top", `${target.top}px`);
    ghost.style.setProperty("--ghost-target-width", `${target.width}px`);
    ghost.style.setProperty("--ghost-target-height", `${target.height}px`);
  }, [getGhostTargetRect, paperRef]);

  const createPaperGhost = useCallback(() => {
    removePaperGhost();
    const paper = paperRef.current;
    const overlay = overlayRef.current;
    const slip = slipRef.current;
    if (!paper || !overlay || !slip) return;
    const ghost = paper.cloneNode(true) as HTMLElement;
    ghost.classList.add("paper-ghost", "paper-fold-ghost");
    ghost.classList.remove("section-reveal");
    ghost.setAttribute("aria-hidden", "true");
    const foldEnd = ghost.querySelector(".intro-columns");
    if (foldEnd) {
      let shouldRemove = false;
      let keptRuleAfterFold = false;
      Array.from(ghost.children).forEach((child) => {
        if (shouldRemove) {
          if (!keptRuleAfterFold && child.classList.contains("rule")) {
            keptRuleAfterFold = true;
            return;
          }
          child.remove();
        }
        if (child === foldEnd) shouldRemove = true;
      });
    }
    ghost.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    ghost.querySelectorAll("a, button, [tabindex]").forEach((element) => {
      element.setAttribute("tabindex", "-1");
    });
    ghost.setAttribute("inert", "");
    paperGhost.current = ghost;
    overlay.insertBefore(ghost, slip);
    setPaperGhostGeometry();
    window.requestAnimationFrame(() => {
      paperGhost.current?.classList.add("is-visible");
    });
  }, [overlayRef, paperRef, removePaperGhost, setPaperGhostGeometry, slipRef]);

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
      flushSync(() => {
        setActiveProject(projectId);
        setSlipState("prepping");
      });
      setSlipGeometry(card);
      createPaperGhost();
      document.querySelectorAll<HTMLElement>(".project-card").forEach((item) => {
        item.setAttribute("aria-expanded", String(item === card));
      });
      document.body.classList.add("slip-is-open");
      const slip = slipRef.current;
      if (slip) {
        slip.scrollTop = 0;
        slip.classList.remove("is-open", "is-closing");
        slip.classList.add("is-prepping");
      }
      if (reducedMotion) {
        setSlipState("open");
        slip?.classList.remove("is-prepping");
        slip?.classList.add("is-open");
      } else {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            setSlipState("open");
            slip?.classList.remove("is-prepping");
            slip?.classList.add("is-open");
          });
        });
      }
      window.setTimeout(() => slip?.focus({ preventScroll: true }), reducedMotion ? 0 : 260);
      if (pushState) {
        window.history.pushState({ newSlip: projectId }, "", `#${projectId}`);
        pushedSlipState.current = true;
      }
    },
    [createPaperGhost, reducedMotion, setSlipGeometry, slipRef],
  );

  const closeSlip = useCallback(
    (fromHistory = false) => {
      const slip = slipRef.current;
      if (!slip || slipState === "closed") return;
      if (!fromHistory && (pushedSlipState.current || window.location.hash === `#${activeProject}`)) {
        pushedSlipState.current = false;
        clearSlipHash();
      }
      if (activeCard.current) setSlipGeometry(activeCard.current);
      document.querySelectorAll<HTMLElement>(".project-card").forEach((item) => {
        item.setAttribute("aria-expanded", "false");
      });
      slip.classList.remove("is-open", "is-prepping");
      slip.classList.add("is-closing");
      paperGhost.current?.classList.remove("is-visible");
      document.body.classList.add("slip-is-returning");
      document.body.classList.remove("slip-is-open");
      setSlipState("closing");

      const finishClose = () => {
        slip.classList.remove("is-closing");
        removePaperGhost();
        document.body.classList.remove("slip-is-returning");
        activeCard.current?.focus({ preventScroll: true });
        activeCard.current = null;
        setActiveProject(null);
        setSlipState("closed");
      };

      if (reducedMotion) {
        finishClose();
      } else {
        window.setTimeout(finishClose, 560);
      }
    },
    [activeProject, reducedMotion, removePaperGhost, setSlipGeometry, slipRef, slipState],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && slipState !== "closed") closeSlip();
    };
    const onResize = () => {
      if (activeCard.current && slipState !== "closed") {
        setSlipGeometry(activeCard.current);
        setPaperGhostGeometry();
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
  }, [closeSlip, setPaperGhostGeometry, setSlipGeometry, slipState]);

  useEffect(() => {
    return () => {
      removePaperGhost();
      document.body.classList.remove("slip-is-open", "slip-is-returning");
    };
  }, [removePaperGhost]);

  return {
    activeProject,
    closeSlip,
    openSlip,
    slipState,
  };
}
