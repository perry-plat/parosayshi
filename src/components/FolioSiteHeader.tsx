import { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon, PlusIcon } from "@phosphor-icons/react";

interface FolioSiteHeaderProps {
  currentPage?: "folio" | "play";
  onNavigate?: (hash: string) => void;
  onOpenPlay?: () => void;
}

export function FolioSiteHeader(_props: FolioSiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <header className="folio-corner-menu" data-cursor-keep ref={menu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}>
      <button className="folio-corner-menu__toggle" ref={toggle} type="button"
        aria-expanded={open} aria-controls="folio-corner-links" onClick={() => setOpen(!open)}>
        Menu <PlusIcon size={18} aria-hidden="true" style={{ transform: open ? "rotate(45deg)" : undefined }} />
      </button>
      {open && <nav className="folio-corner-menu__panel" id="folio-corner-links" aria-label="Menu">
        <a href="https://drive.google.com/file/d/1Hey3depw6La0gfbqJMN9uv8QBNtiF_qr/view?usp=drive_link" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          <ArrowUpRightIcon size={18} aria-hidden="true" /> View résumé
        </a>
      </nav>}
    </header>
  );
}
