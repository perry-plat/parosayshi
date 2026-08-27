import { useEffect, useState, type MouseEvent } from "react";

interface FolioSiteHeaderProps {
  currentPage?: "folio" | "play";
  onNavigate?: (hash: string) => void;
  onOpenPlay?: () => void;
}

export function FolioSiteHeader({
  currentPage = "folio",
  onNavigate,
  onOpenPlay,
}: FolioSiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const openFolioSection = (event: MouseEvent<HTMLAnchorElement>, hash: string) => {
    setMenuOpen(false);
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(hash);
  };

  const openPlay = (event: MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    event.preventDefault();
    if (currentPage !== "play") onOpenPlay?.();
  };

  return (
    <header className="folio-site-header" data-open={menuOpen ? "true" : "false"}>
      <div className="folio-site-header__top">
        <div aria-label="Artwork placeholder" className="folio-site-header__artwork" role="img">
          <span>Artwork / TBD</span>
        </div>
      </div>
      <button
        aria-controls="folio-paper-menu"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        className="folio-site-header__toggle"
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        <span>{menuOpen ? "Close" : "Menu"}</span>
      </button>
      <nav aria-label="Primary navigation" className="folio-site-header__nav" id="folio-paper-menu">
        <a href="#home" onClick={(event) => openFolioSection(event, "#home")}><span>Home</span></a>
        <a href="#work" onClick={(event) => openFolioSection(event, "#work")}><span>Work</span></a>
        <a href="#resume" onClick={(event) => openFolioSection(event, "#resume")}><span>Resume</span></a>
        <a aria-current={currentPage === "play" ? "page" : undefined} href="?page=play" onClick={openPlay}><span>Play</span></a>
        <a href="https://x.com/parosayshi" onClick={() => setMenuOpen(false)} rel="noreferrer" target="_blank"><span>X / @parosayshi</span></a>
      </nav>
    </header>
  );
}
