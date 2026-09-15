import { WizpayImpact } from "./WizpayImpact";
import { WizpayCreditsDemo } from "./WizpayCreditsDemo";
import { WizpayRecurringDemo } from "./WizpayRecurringDemo";
import { WizpayInvoiceDemo } from "./WizpayInvoiceDemo";
import { WizpayPaymentBlocks } from "./WizpayPaymentBlocks";
import { WizpayProblems } from "./WizpayProblems";
import { createPortal } from "react-dom";
import { SuperrActivitySection } from "./SuperrActivitySection";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FolioProjectSketchMedia } from "./FolioProjectSketchMedia";
import { FolioProjectAsset } from "./FolioProjectAsset";
import type { FolioProject, FolioProjectMedia } from "../data/folioProjects";

interface FolioProjectViewerProps {
  onClose: () => void;
  project: FolioProject;
  reducedMotion: boolean;
}

export function FolioProjectViewer({ onClose, project, reducedMotion }: FolioProjectViewerProps) {
  const [orgSlide, setOrgSlide] = useState(0);
  const [orgDirection, setOrgDirection] = useState(1);
  const navigateOrg = (direction: number) => { setOrgDirection(direction); setOrgSlide(value => (value + direction + 3) % 3); };
  const isPaper = project.id === "wizpay" || project.id === "superr-paper";
  const heroDialogRef = useRef<HTMLDialogElement>(null);
  const heroButtonRef = useRef<HTMLButtonElement>(null);
  const expandedTriggerRef = useRef<HTMLElement | null>(null);
  const expandedImageRef = useRef<HTMLDivElement>(null);
  const [expandedMedia, setExpandedMedia] = useState<{ src: string; alt: string } | null>(null);
  const closingRef = useRef(false);

  const imageTransform = () => {
    const origin = expandedTriggerRef.current?.getBoundingClientRect();
    const target = expandedImageRef.current?.getBoundingClientRect();
    if (!origin || !target || !target.width || !target.height) return "scale(0.92)";
    return `translate(${origin.left + origin.width / 2 - target.left - target.width / 2}px, ${origin.top + origin.height / 2 - target.top - target.height / 2}px) scale(${origin.width / target.width}, ${origin.height / target.height})`;
  };

  useEffect(() => {
    if (!expandedMedia) return;
    heroDialogRef.current?.showModal();
    if (!reducedMotion) {
      expandedImageRef.current?.animate(
        [{ transform: imageTransform() }, { transform: "none" }],
        { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
      heroDialogRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
    }
  }, [expandedMedia, reducedMotion]);

  const closeHero = async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (!reducedMotion) {
      const animation = expandedImageRef.current?.animate(
        [{ transform: "none" }, { transform: imageTransform(), opacity: 0 }],
        { duration: 220, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" },
      );
      await animation?.finished.catch(() => undefined);
    }
    heroDialogRef.current?.close();
    setExpandedMedia(null);
    expandedTriggerRef.current?.focus({ preventScroll: true });
    closingRef.current = false;
  };

  const [mediaAttempt, setMediaAttempt] = useState(0);
  const isPresent = useIsPresent();
  const reelRef = useRef<HTMLDivElement>(null);
  const [showPaperTitle, setShowPaperTitle] = useState(false);
  const [mediaGate, setMediaGate] = useState<{ project: FolioProject; attempt: number; state: "ready" | "error" } | null>(null);
  const mediaState = mediaGate?.project === project && mediaGate.attempt === mediaAttempt ? mediaGate.state : "loading";

  useEffect(() => {
    const reel = reelRef.current;
    const heading = reel?.querySelector(".folio-reading-header h1");
    if (!isPaper || !reel || !heading) return;
    const update = () => {
      setShowPaperTitle(mediaState === "ready" && reel.scrollTop > 0 && heading.getBoundingClientRect().bottom <= reel.getBoundingClientRect().top);

    };
    update();
    reel.addEventListener("scroll", update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(reel);
    resize.observe(heading);
    return () => {
      reel.removeEventListener("scroll", update);
      resize.disconnect();
    };
  }, [project.id, mediaAttempt, mediaState, isPaper]);


  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;
    let active = true;
    const cleanups: (() => void)[] = [];
    const waitForMedia = (element: HTMLImageElement | HTMLVideoElement) => new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => finish(new Error("Media timed out")), 20000);
      const cleanup = () => {
        clearTimeout(timeout);
        element.removeEventListener("error", failed);
        element.removeEventListener("loadeddata", loaded);
      };
      const finish = (error?: Error) => { cleanup(); error ? reject(error) : resolve(); };
      const failed = () => finish(new Error("Media failed to load"));
      const loaded = () => finish();
      cleanups.push(cleanup);
      element.addEventListener("error", failed);
      if (element instanceof HTMLImageElement) {
        element.decode().then(() => finish(), failed);
      } else if (element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        finish();
      } else {
        element.addEventListener("loadeddata", loaded);
      }
    });
    const visuals: (HTMLImageElement | HTMLVideoElement)[] = Array.from(reel.querySelectorAll("img"));
    reel.querySelectorAll("video").forEach(video => {
      if (video.poster) {
        const poster = new Image();
        poster.src = video.poster;
        visuals.push(poster);
      } else visuals.push(video);
    });
    void Promise.all(visuals.map(waitForMedia)).then(() => {
      if (active) setMediaGate({ project, attempt: mediaAttempt, state: "ready" });
    }).catch(() => {
      if (active) setMediaGate({ project, attempt: mediaAttempt, state: "error" });
    });
    return () => { active = false; cleanups.forEach(cleanup => cleanup()); };
  }, [project, mediaAttempt]);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLElement>(null);
  const [showCompactHeader, setShowCompactHeader] = useState(false);

  useEffect(() => {
    const viewer = viewerRef.current;
    const details = detailsRef.current;
    if (!viewer || !details) return;
    const narrow = window.matchMedia("(max-width: 1320px)");
    const sync = () => setShowCompactHeader(narrow.matches && details.getBoundingClientRect().bottom <= viewer.getBoundingClientRect().top);
    const observer = new IntersectionObserver(sync, { root: viewer, threshold: [0, 1] });
    observer.observe(details);
    narrow.addEventListener("change", sync);
    sync();
    return () => { observer.disconnect(); narrow.removeEventListener("change", sync); };
  }, [project.id]);


  useLayoutEffect(() => {
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
      // Bypass the page's smooth scrolling when releasing the fixed-body lock.
      window.scrollTo({ left: 0, top: lockedScrollY, behavior: "instant" });
    };
  }, [project.id]);

  useEffect(() => {
    if (!isPaper) return;
    const viewer = viewerRef.current;
    if (!viewer) return;
    const scrollPaperFromDesk = (event: WheelEvent) => {
      const reel = reelRef.current;
      if (!reel || event.ctrlKey || heroDialogRef.current?.open) return;
      if (event.target instanceof Node && reel.contains(event.target)) return;
      if (!event.deltaY) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 26 : event.deltaMode === 2 ? reel.clientHeight : 1;
      reel.scrollTop += event.deltaY * unit;
    };
    viewer.addEventListener("wheel", scrollPaperFromDesk, { passive: false });
    return () => viewer.removeEventListener("wheel", scrollPaperFromDesk);
  }, [project.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (heroDialogRef.current?.open) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(viewerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []).filter((element) => element.getClientRects().length > 0 && !element.closest("[inert]"));
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

  const projectIdentity = (<>
        {project.logo ? (
          project.id === "superr" ? (
          <a href="https://superr.ai/" target="_blank" rel="noreferrer" aria-label="Visit Superr website" className="folio-project-viewer__logo-link">
            <img alt="Superr" className="folio-project-viewer__logo" src={project.logo} />
          </a>
        ) : <img alt="" aria-hidden="true" className="folio-project-viewer__logo" src={project.logo} />
        ) : null}
        <div className="folio-project-viewer__identity">
          <h2>{project.title}{project.id === "superr" && " — making learning fun"}</h2>
          <span>{project.id === "superr" ? "October 2025–present" : project.year}</span>
        </div>
  </>);

  const renderContact = (tooltipId: string) => (project.externalUrl ? (
          <div className="folio-project-viewer__contact-row">
          {project.id === "superr" && <span className="folio-project-viewer__nda"><span aria-hidden="true">🔒</span> NDA</span>}
          <a
            className="folio-project-viewer__external"
            aria-describedby={project.id === "superr" ? tooltipId : undefined}
            href={project.externalUrl}
            rel="noreferrer"
            target="_blank"
          >
            {project.externalLabel || "Visit project"}
            {project.id === "superr" && <span id={tooltipId} role="tooltip" className="folio-project-viewer__contact-tooltip">For the full walkthrough</span>}
            {project.id !== "superr" && <HugeiconsIcon aria-hidden="true" icon={ArrowUpRight01Icon} size={13} strokeWidth={1.8} />}
          </a>
          </div>
        ) : null);

  const renderMedia = (item: FolioProjectMedia, index: number) => {
    const isPaperMedia = isPaper;
    if (!isPaperMedia && item.presentation === "activity-section") return <SuperrActivitySection key={item.src} reducedMotion={reducedMotion} />;
    const asset = item.presentation === "activity-section" ? (
      <div className={isPaperMedia ? "folio-paper-media" : undefined} style={isPaperMedia ? undefined : { display: "contents" }}>
        <SuperrActivitySection reducedMotion={reducedMotion} />
        {isPaperMedia && <span className="folio-paper-media__border" aria-hidden="true" />}
      </div>
    ) : (
      <figure
        className={`folio-project-viewer__media folio-project-viewer__media--${item.ratio}`}
        style={{ aspectRatio: item.aspectRatio, background: item.background }}
      >
        <FolioProjectAsset media={item} reducedMotion={reducedMotion}
          onExpand={item.kind === "image" && item.expandable ? (trigger) => {
            expandedTriggerRef.current = trigger;
            setExpandedMedia({ src: item.src, alt: item.alt });
          } : undefined}
        />
        {isPaperMedia && <span className="folio-paper-media__border" aria-hidden="true" />}
      </figure>
    );
    return <Fragment key={`${item.src}-${index}`}>{asset}</Fragment>;
  };

  const heroImage = (project.heroImage && <div className="folio-project-viewer__hero-image" data-frame-shadow={project.heroImage.src.includes("hero-header-237-14572-v2") || undefined}>
          {project.heroImage.expandable ? <button
            type="button"
            className="folio-project-viewer__hero-trigger"
            aria-label={`Expand ${project.title} header image`}
            aria-haspopup="dialog"
            data-cursor-keep
            ref={heroButtonRef}
            onClick={(event) => { expandedTriggerRef.current = event.currentTarget; setExpandedMedia(project.heroImage!); }}
          >
            <img src={project.heroImage.src} alt={project.heroImage.alt} width={project.heroImage.width ?? 1569} height={project.heroImage.height ?? 2030} />
          </button> : <img src={project.heroImage.src} alt={project.heroImage.alt} width={project.heroImage.width ?? 1569} height={project.heroImage.height ?? 2030} />}
          {isPaper && project.id !== "wizpay" && <span className="folio-paper-media__border" aria-hidden="true" />}
        </div>);

  return (
    <>
    {!isPaper && <motion.div
      aria-hidden="true"
      className="folio-project-viewer-backdrop"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    />}
    <motion.section
      animate={{ opacity: 1 }}
      aria-label={`${project.title} project gallery`}
      aria-modal="true"
      className="folio-project-viewer"
      data-project={project.id}
      exit={isPaper ? { opacity: 1 } : { opacity: 0, transition: { duration: reducedMotion ? 0 : 0.18 } }}
      id="folio-project-viewer"
      initial={reducedMotion || isPaper ? false : { opacity: 0 }}
      ref={viewerRef}
      role="dialog"
      transition={reducedMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div aria-hidden="true" className="folio-project-viewer__wash" />

      <aside className="folio-project-viewer__details" ref={detailsRef}>
        {projectIdentity}
        {project.id === "superr" || (isPaper || project.id === "wiz-commerce") ? (
          <div className="folio-project-viewer__description folio-project-viewer__description--editorial">
            {project.description.split("\n\n").map((paragraph, index) => (
              <p key={index} className={index === 1 ? "folio-project-viewer__contribution-copy" : undefined}>
                {paragraph.split(/(product design|visual design|animation|AI-led frontend development)/g).map((part, partIndex) =>
                  /^(product design|visual design|animation|AI-led frontend development)$/.test(part)
                    ? project.id === "superr-paper"
                    ? <span className="folio-skill-pill" data-skill={part} key={partIndex}>{part}</span>
                    : <strong key={partIndex}>{part}</strong> : part
                )}
              </p>
            ))}
          </div>
        ) : <p className="folio-project-viewer__description">{project.description}</p>}
                {project.id === "superr" && <a className="folio-project-viewer__intro-link" href="https://x.com/superr_ai/status/2022163063542362244" target="_blank" rel="noreferrer" aria-label="Meet SuperrBook — watch the film">
                  <img className="folio-project-viewer__intro-thumbnail" src="/assets/invoice-folio/superr-case-study/intro-film-thumbnail.png" alt="Meet SuperrBook" />
                  <span className="folio-project-viewer__intro-tooltip">Meet SuperrBook</span>
                  <img className="folio-project-viewer__intro-play" src="/assets/invoice-folio/superr-case-study/intro-film-play.svg" alt="" aria-hidden="true" />
                </a>}
        {project.id !== "superr" && (!isPaper && project.id !== "wiz-commerce") ? (
          <p className="folio-project-viewer__services">{project.services.join(" / ")}</p>
        ) : null}
        {renderContact("superr-contact-tooltip")}
      </aside>

      <motion.div
        className="folio-reading-paper"
        data-present={isPresent}
        initial={isPaper && !reducedMotion ? { y: "110vh", rotate: -10 } : false}
        animate={isPaper ? { y: 0, rotate: 0 } : undefined}
        exit={isPaper && !reducedMotion ? {
          y: "110vh", rotate: -10,
          transition: { duration: 0.32, ease: [0.78, 0, 0.8, 0.22] },
        } : undefined}
        transition={{ duration: isPaper && !reducedMotion ? 0.44 : 0, ease: [0.2, 0.78, 0.22, 1] }}
        style={isPaper ? { transformOrigin: "50% 85%" } : undefined}
      >
        {isPaper && <div className="folio-reading-paper__cast-shadow" aria-hidden="true" />}
        {isPaper && <div className="folio-reading-paper__title" data-visible={showPaperTitle} aria-hidden="true">{project.title}</div>}
        {isPaper && <div className="folio-scroll-blur folio-reading-paper__fade" aria-hidden="true" />}
        {isPaper && <button className="folio-reading-paper__close" type="button" onClick={onClose} ref={closeButtonRef} aria-label="Close project" title="Close project"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>}
      <div
        aria-label={`${project.title} media gallery. Scroll to explore the project.`}
        className="folio-project-viewer__reel"
        ref={reelRef}
        key={`${project.id}-${mediaAttempt}`}
        data-media-gate={isPaper ? "ready" : mediaState}
        aria-hidden={!isPaper && mediaState !== "ready"}
        inert={!isPaper && mediaState !== "ready"}
        onErrorCapture={(event) => {
          if (event.target instanceof HTMLImageElement) {
            setMediaGate({ project, attempt: mediaAttempt, state: "error" });
          }
        }}
        role="region"
        tabIndex={0}
      >
        {(isPaper || project.id === "wiz-commerce") && <header className="folio-reading-header">
          {!isPaper && <button type="button" onClick={onClose} ref={closeButtonRef} aria-label="Back to projects" title="Back to projects"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
          {project.id === "superr-paper" && <span className="folio-bento-card__nda-stamp folio-reading-header__nda-stamp" aria-label="Non-disclosure agreement">NDA</span>}
          {isPaper ? <div className="folio-reading-header__identity">
            {project.logo && <img className="folio-reading-header__project-logo" src={project.logo} alt="" aria-hidden="true" />}
            <div><h1>{project.headline ?? project.title}</h1>{project.id !== "wizpay" && <p className="folio-reading-header__date">{project.year}</p>}</div>
          </div> : <><h1>{project.title}</h1><p className="folio-reading-header__date">{project.year}</p></>}
          {project.id === "superr-paper" ? project.description.split("\n\n").map((paragraph, index) => (
            paragraph.startsWith("My work spans ") ? (
              <Fragment key={index}>
                <p>My work spans</p>
                <ul className="folio-skill-grid" aria-label="Areas of contribution">
                  {["product design", "visual design", "animation", "AI-led frontend development"].map(skill => (
                    <li className="folio-skill-pill" key={skill}>{skill}</li>
                  ))}
                </ul>
              </Fragment>
            ) : <p key={index} className={index === 1 ? "folio-project-viewer__contribution-copy" : undefined}>{paragraph}</p>
          )) : <>
            <p>{project.overview?.context}</p>
            {project.overview?.contribution && <p>{project.overview.contribution}</p>}
          </>}

          {project.id === "superr-paper" && <a className="folio-project-viewer__intro-link" href="https://x.com/superr_ai/status/2022163063542362244" target="_blank" rel="noreferrer" aria-label="Meet SuperrBook — watch the film">
                  <img className="folio-project-viewer__intro-thumbnail" src="/assets/invoice-folio/superr-case-study/intro-film-thumbnail.png" alt="Meet SuperrBook" />
                  <span className="folio-project-viewer__intro-tooltip">Meet SuperrBook</span>
                  <img className="folio-project-viewer__intro-play" src="/assets/invoice-folio/superr-case-study/intro-film-play.svg" alt="" aria-hidden="true" />
                </a>}
        </header>}
        {heroImage}
        {project.overview?.companyIntro && <section className="folio-project-viewer__company-intro" aria-labelledby={`${project.id}-company-intro-heading`}>
          <h2 id={`${project.id}-company-intro-heading`}>{project.overview.companyIntro.heading}</h2>
          {project.overview.companyIntro.body.split("\n\n").map((paragraph, index) => <p key={index}>{project.id === "wizpay" && paragraph.startsWith("WizCommerce") ? <><a href="https://wizcommerce.com/" target="_blank" rel="noreferrer" className="wizpay-company-link wall-folio__experience-mark">WizCommerce</a>{paragraph.slice("WizCommerce".length)}</> : paragraph}</p>)}
        </section>}
        {project.id === "wizpay" && <><hr className="folio-project-viewer__section-divider" /><WizpayProblems reducedMotion={reducedMotion} /><hr className="folio-project-viewer__section-divider" /></>}
        {(!isPaper && project.id !== "wiz-commerce") && project.introMedia?.map(renderMedia)}
        {project.overview?.pullQuote && <figure className="folio-project-viewer__quote-card">
          <p>{project.overview.pullQuote}</p>
        </figure>}
        {(!isPaper && project.id !== "wiz-commerce") && project.overview && <section className="folio-project-viewer__overview" aria-label="Project overview">
          <div className="folio-project-viewer__overview-content">
            <p>{project.overview.context}</p>
            <p>{project.overview.contribution}</p>
            {project.overview.facts.length > 0 && <dl className="folio-project-viewer__overview-facts">
              {project.overview.facts.map(fact => <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>)}
            </dl>}
          </div>
        </section>}
        {(isPaper || project.id === "wiz-commerce") && project.introMedia?.map(renderMedia)}
        {project.media.map((item, index) => {

          if (item.kind === "sketch") {
            return <FolioProjectSketchMedia key={`${project.id}-sketch-${item.id}`} sketch={item} />;
          }

          if (item.kind === "note") {
            return (
              <section
                className="folio-project-viewer__note"
                data-note={item.id}
                  key={`${project.id}-note-${item.id}`}
                >
                {item.heading && <h3>{item.heading}</h3>}
                <p>{item.emphasis && item.body.includes(item.emphasis) ? <>{item.body.split(item.emphasis)[0]}<strong className="folio-project-viewer__note-emphasis">{item.emphasis}</strong>{item.body.split(item.emphasis)[1]}</> : item.body}</p>
                {item.launchPost && <a className="folio-project-viewer__launch-post" href={item.launchPost.href} target="_blank" rel="noreferrer">{item.launchPost.label} ↗</a>}
                {item.mentions && <div className="folio-project-viewer__mentions">{item.mentions.map(mention => <div className="folio-project-viewer__mention" key={mention.title}><strong>{mention.title}</strong><span>{mention.excerpt}</span></div>)}</div>}

              </section>
            );
          }

          if (item.kind === "group") {
            return (
              <section
                aria-labelledby={project.id === "wizpay" && item.id === "impact" ? undefined : `${project.id}-${item.id}-heading`}
                className="folio-project-viewer__group"
                data-layout={item.layout}
                key={`${project.id}-group-${item.id}`}
              >
                {!(project.id === "wizpay" && item.id === "impact") && <h3 id={`${project.id}-${item.id}-heading`}>{item.heading}</h3>}
                {item.description?.split("\n\n").map((paragraph, paragraphIndex) => <Fragment key={paragraphIndex}><p className="folio-project-viewer__group-description">{item.emphasis && paragraph.includes(item.emphasis) ? <>{paragraph.split(item.emphasis)[0]}<strong>{item.emphasis}</strong>{paragraph.split(item.emphasis).slice(1).join(item.emphasis)}</> : paragraph}</p>{item.paymentTimelineAfterParagraph === paragraphIndex && <div className="wizpay-order-flow-image">{renderMedia({ kind: "image", src: "/assets/invoice-folio/wizpay-case-study/order-flow-black-ink.png", alt: "Order-taking flow: sales rep reaches out to the customer, cart, quote creation, order confirmation, shipment. Quote creation and order confirmation are connected in both directions. Annotations: direct customer payment before a cart; payment against a quote or order; partial or remaining payment at shipment.", ratio: "landscape", aspectRatio: "2163 / 727", expandable: true }, paragraphIndex)}</div>}</Fragment>)}
                {item.introduction && <div className="folio-project-viewer__group-introduction"><h4>{item.introduction.heading}</h4><p>{item.introduction.body}</p></div>}
                {project.id === "wizpay" && item.id === "impact" && <WizpayImpact />}
                {project.id === "wizpay" && item.id === "payment-space" && <WizpayPaymentBlocks />}
                {project.id === "wizpay" && item.id === "invoice-payments" && <WizpayInvoiceDemo />}
                {project.id === "wizpay" && item.id === "recurring-payments" && <WizpayRecurringDemo />}
                {project.id === "wizpay" && item.id === "payment-credits" && <WizpayCreditsDemo />}
                {project.id === "wizpay" && item.id === "org-settings" && <div className="wi-stage wo-carousel" role="region" aria-roledescription="carousel" aria-label="Organisation payment settings" onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); navigateOrg(event.key === "ArrowRight" ? 1 : -1); } }}>
                  <div className="wo-stage"><AnimatePresence initial={false} custom={orgDirection}><motion.div className="wo-slide" key={orgSlide} custom={orgDirection} variants={{ enter: (direction: number) => ({ opacity: 0, x: reducedMotion ? 0 : direction * 36 }), center: { opacity: 1, x: 0 }, exit: (direction: number) => ({ opacity: 0, x: reducedMotion ? 0 : direction * -36 }) }} initial="enter" animate="center" exit="exit" transition={{ duration: reducedMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}>{renderMedia({kind: "image", src: `/assets/invoice-folio/wizpay-case-study/org-settings-${orgSlide + 1}.png?v=3`, alt: `Organisation payment settings, screen ${orgSlide + 1} of 3`, aspectRatio: orgSlide === 1 ? "1440 / 1244" : "1440 / 1024", ratio: "landscape"}, orgSlide)}</motion.div></AnimatePresence><button className="wo-hit wo-hit--previous" onMouseDown={event => event.preventDefault()} type="button" data-cursor-keep aria-label="Previous settings screen" onClick={() => navigateOrg(-1)} /><button className="wo-hit wo-hit--next" onMouseDown={event => event.preventDefault()} type="button" data-cursor-keep aria-label="Next settings screen" onClick={() => navigateOrg(1)} /></div>
                  <div className="wo-controls">
                    <div className="wo-dots">{[0,1,2].map(index => <button type="button" data-cursor-keep key={index} aria-label={`Show settings screen ${index + 1}`} aria-pressed={orgSlide === index} onClick={() => { setOrgDirection(index > orgSlide ? 1 : -1); setOrgSlide(index); }}><i /></button>)}</div>
                  </div>
                </div>}
                {project.id === "wizpay" && item.id === "org-settings" && <p className="wp-blocks-caption">Payment methods and terms, configured around each wholesaler’s needs</p>}
                {item.challenge && <section className="wizpay-challenge" aria-label="The challenge"><p>{item.challenge.heading}: {item.challenge.body.charAt(0).toLowerCase() + item.challenge.body.slice(1)}</p></section>}
                {item.sketch && <FolioProjectSketchMedia sketch={item.sketch} />}
                <div className={project.id === "wizpay" && item.id === "payment-form" ? "folio-project-viewer__group-media wi-stage wf-stage" : "folio-project-viewer__group-media"}>
                  {item.media.map((media, mediaIndex) => item.captions ? (
                    <div className="folio-project-viewer__annotated-media" key={`${item.id}-${mediaIndex}`}>
                      {renderMedia(media, mediaIndex)}
                      <p>{item.captions[mediaIndex]}</p>
                    </div>
                  ) : project.id === "wizpay" && (item.id === "collaboration" || item.id === "responsive-transactions") ? <figure className="wf-transactions-figure" key={mediaIndex}><div className="wi-stage wf-device-stage wf-transactions-stage"><div className={item.id === "collaboration" ? "wf-transactions-web" : "wf-device-shell wf-device-shell--" + (mediaIndex === 0 ? "tablet" : "mobile")}>{renderMedia(media, mediaIndex)}</div></div>{item.id === "collaboration" && <figcaption className="wp-blocks-caption">And yes, a long table—bringing collections, refunds, and credits into one place to scan and track</figcaption>}{item.id === "responsive-transactions" && <figcaption className="wp-blocks-caption">{mediaIndex === 0 ? "Expandable rows keep payment details within reach on tablet" : "Compact cards keep the essentials visible, with more details a tap away"}</figcaption>}</figure> : project.id === "wizpay" && item.id === "payment-form" ? <div className="wf-annotated" key={mediaIndex}>{renderMedia(media, mediaIndex)}<img className="wf-ink-notes" src="/assets/invoice-folio/wizpay-case-study/payment-form-notes.svg?v=4" alt="Start with the customer. Linked to the order. Choose the invoice. Surcharge is automatically added when enabled in organisation settings. Review the total, then charge." /></div> : renderMedia(media, mediaIndex))}
                </div>
                {project.id === "wizpay" && item.id === "payment-form" && <div className="wf-device-row">
                  <figure className="wf-device-slot"><div className="wi-stage wf-device-stage"><div className="wf-device-shell wf-device-shell--tablet">{renderMedia({kind: "image", src: "/assets/invoice-folio/wizpay-case-study/payment-tablet.png", alt: "Tablet payment form", aspectRatio: "1193 / 831", ratio: "portrait", expandable: true}, 0)}</div></div><figcaption className="wp-blocks-caption">The payment form adapted for tablet, with the total and charge action always in view</figcaption></figure>
                  <figure className="wf-device-slot"><div className="wi-stage wf-device-stage"><div className="wf-device-shell wf-device-shell--mobile">{renderMedia({kind: "image", src: "/assets/invoice-folio/wizpay-case-study/payment-mobile.png", alt: "Mobile payment form", aspectRatio: "360 / 838", ratio: "portrait", expandable: true}, 1)}</div></div><figcaption className="wp-blocks-caption">A single-column payment flow for smaller screens</figcaption></figure>
                </div>}
                {project.id === "wizpay" && item.id === "payment-form" && <hr className="folio-project-viewer__section-divider" />}
                {project.id === "wizpay" && item.id === "responsive-transactions" && <hr className="folio-project-viewer__section-divider wf-dashboard-divider" />}
                {project.id === "wizpay" && item.id === "org-settings" && <hr className="folio-project-viewer__section-divider wf-dashboard-divider" />}
                {item.callouts && <ol className="folio-project-viewer__callouts">{item.callouts.map(callout => <li key={callout.title}><strong>{callout.title}</strong><p>{callout.body}</p></li>)}</ol>}
              </section>
            );
          }

          return renderMedia(item, index);
        })}
      </div>

      </motion.div>

      {(!isPaper || mediaState === "error") && mediaState !== "ready" && <div className="folio-project-viewer__loading" role="status" aria-live="polite">
        <p>{mediaState === "error" ? "Some media couldn’t load." : "Preparing project…"}</p>
        {mediaState === "error" && <button type="button" onClick={() => setMediaAttempt(attempt => attempt + 1)}>Retry loading media</button>}
      </div>}

      {showCompactHeader && (
        <motion.aside
          className="folio-project-viewer__compact-header"
          aria-label="Project details and actions"
          initial={reducedMotion ? false : { y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="folio-project-viewer__compact-identity">
            {projectIdentity}
          </div>
          <div className="folio-project-viewer__compact-actions">
            {renderContact("superr-sheet-contact-tooltip")}
          </div>
        </motion.aside>
      )}
      <div aria-hidden="true" className="folio-project-viewer__scroll-blur" />

      <button
        aria-label={`Close ${project.title} project gallery`}
        className="folio-project-viewer__close"
        onClick={onClose}
        ref={(isPaper || project.id === "wiz-commerce") ? undefined : closeButtonRef}
        type="button"
      >
        Close
      </button>
    </motion.section>
    {expandedMedia && createPortal(
      <dialog
        ref={heroDialogRef}
        className="folio-hero-overlay"
        data-annotated-form={expandedMedia.src.includes("/payment-form.png") || undefined}
        aria-label="Expanded image"
        onCancel={(event) => { event.preventDefault(); closeHero(); }}
        onClick={closeHero}
      >
        <button type="button" autoFocus data-cursor-keep aria-label="Close expanded image" onClick={closeHero}>
          <div ref={expandedImageRef} className="folio-hero-overlay__image" data-payment-gradient={expandedMedia.src.includes("payment-collage-mint") || undefined} data-frame-shadow={expandedMedia.src.includes("hero-header-237-14572-v2") || undefined}>
            <img src={expandedMedia.src} alt={expandedMedia.alt} />
            {expandedMedia.src.includes("/payment-form.png") && <img className="folio-hero-overlay__annotations" src="/assets/invoice-folio/wizpay-case-study/payment-form-notes.svg?v=4" alt="Start with the customer. Linked to the order. Choose the invoice. Surcharge is automatically added when enabled in organisation settings. Review the total, then charge." />}
          </div>
          <span>Click to close · Esc</span>
        </button>
      </dialog>, document.body,
    )}
    </>
  );
}
