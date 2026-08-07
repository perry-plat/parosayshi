import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

interface TableStickerLayerProps {
  containerRef: RefObject<HTMLElement | null>;
  disabled?: boolean;
  reducedMotion?: boolean;
}

type StickerKind = "bolt" | "flower" | "heart" | "smiley" | "star";

interface StickerPlacement {
  id: string;
  kind: StickerKind;
  rotation: number;
  scale: number;
  x: number;
  y: number;
}

const MAX_STICKERS = 18;
const STICKER_EDGE_GUTTER = 30;
const STICKER_KINDS: StickerKind[] = ["smiley", "heart", "flower", "star", "bolt"];
const BLOCKED_TARGETS = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "option",
  "label",
  "summary",
  "video",
  "audio",
  "iframe",
  "[contenteditable]",
  "[role='button']",
  "[role='link']",
  "[role='dialog']",
  "[data-no-table-sticker]",
  "h1",
  "h2",
  "h3",
  "p",
  "li",
  "time",
  "code",
  "pre",
  "figcaption",
  ".sheet-kicker",
  ".sheet-colophon",
].join(", ");

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function shuffledStickerKinds() {
  const kinds = [...STICKER_KINDS];

  for (let index = kinds.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [kinds[index], kinds[swapIndex]] = [kinds[swapIndex], kinds[index]];
  }

  return kinds;
}

function StickerArtwork({ kind }: { kind: StickerKind }) {
  if (kind === "smiley") {
    return (
      <svg aria-hidden="true" viewBox="0 0 64 64">
        <circle className="table-sticker__shape" cx="32" cy="32" fill="#f3c542" r="22" />
        <circle cx="24" cy="28" fill="#352b1f" r="2.5" />
        <circle cx="40" cy="28" fill="#352b1f" r="2.5" />
        <path d="M22 37c3 6 17 6 20 0" fill="none" stroke="#352b1f" strokeLinecap="round" strokeWidth="2.8" />
      </svg>
    );
  }

  if (kind === "heart") {
    return (
      <svg aria-hidden="true" viewBox="0 0 64 64">
        <path
          className="table-sticker__shape"
          d="M32 52S10 40 10 23c0-8 5-13 13-13 5 0 8 3 9 7 2-4 5-7 10-7 8 0 13 5 13 13 0 17-23 29-23 29Z"
          fill="#dc5246"
        />
      </svg>
    );
  }

  if (kind === "flower") {
    return (
      <svg aria-hidden="true" viewBox="0 0 64 64">
        <g className="table-sticker__shape" fill="#f7f0df">
          <ellipse cx="32" cy="17" rx="9" ry="14" />
          <ellipse cx="32" cy="47" rx="9" ry="14" />
          <ellipse cx="17" cy="32" rx="14" ry="9" />
          <ellipse cx="47" cy="32" rx="14" ry="9" />
          <ellipse cx="21.5" cy="21.5" rx="9" ry="13" transform="rotate(-45 21.5 21.5)" />
          <ellipse cx="42.5" cy="42.5" rx="9" ry="13" transform="rotate(-45 42.5 42.5)" />
          <ellipse cx="42.5" cy="21.5" rx="13" ry="9" transform="rotate(-45 42.5 21.5)" />
          <ellipse cx="21.5" cy="42.5" rx="13" ry="9" transform="rotate(-45 21.5 42.5)" />
        </g>
        <circle cx="32" cy="32" fill="#e9a92f" r="10" stroke="#315aa8" strokeWidth="1.7" />
      </svg>
    );
  }

  if (kind === "star") {
    return (
      <svg aria-hidden="true" viewBox="0 0 64 64">
        <path
          className="table-sticker__shape"
          d="m32 8 6.7 15.3 16.6 1.7-12.5 11 3.6 16.3L32 43.8 17.6 52.3 21.2 36 8.7 25l16.6-1.7L32 8Z"
          fill="#3869c8"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 64 64">
      <path
        className="table-sticker__shape"
        d="M36.5 5 15 35h15l-3 24 22-32H34L36.5 5Z"
        fill="#ef7b38"
      />
    </svg>
  );
}

export function TableStickerLayer({
  containerRef,
  disabled = false,
  reducedMotion = false,
}: TableStickerLayerProps) {
  const [stickers, setStickers] = useState<StickerPlacement[]>([]);
  const stickerBagRef = useRef<StickerKind[]>([]);
  const stickerCountRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const placeSticker = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;

      const target = event.target;
      if (target instanceof Element && target.closest(BLOCKED_TARGETS)) return;

      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) return;

      const bounds = container.getBoundingClientRect();
      const count = stickerCountRef.current;

      if (stickerBagRef.current.length === 0) {
        stickerBagRef.current = shuffledStickerKinds();
      }

      const kind = stickerBagRef.current.pop() as StickerKind;

      stickerCountRef.current += 1;

      const sticker: StickerPlacement = {
        id: `${Date.now()}-${count}`,
        kind,
        rotation: Math.round((Math.random() - 0.5) * 22),
        scale: Number((0.88 + Math.random() * 0.2).toFixed(2)),
        x: clamp(
          event.clientX - bounds.left,
          STICKER_EDGE_GUTTER,
          Math.max(STICKER_EDGE_GUTTER, container.clientWidth - STICKER_EDGE_GUTTER),
        ),
        y: clamp(
          event.clientY - bounds.top,
          STICKER_EDGE_GUTTER,
          Math.max(STICKER_EDGE_GUTTER, container.clientHeight - STICKER_EDGE_GUTTER),
        ),
      };

      setStickers((current) => [...current, sticker].slice(-MAX_STICKERS));
    };

    container.addEventListener("click", placeSticker);
    return () => container.removeEventListener("click", placeSticker);
  }, [containerRef, disabled]);

  return (
    <div
      aria-hidden="true"
      className="table-sticker-layer"
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      {stickers.map((sticker) => (
        <span
          className="table-sticker-position"
          data-kind={sticker.kind}
          key={sticker.id}
          style={{
            "--table-sticker-rotation": `${sticker.rotation}deg`,
            "--table-sticker-scale": sticker.scale,
            left: sticker.x,
            top: sticker.y,
          } as CSSProperties}
        >
          <span className="table-sticker">
            <StickerArtwork kind={sticker.kind} />
          </span>
        </span>
      ))}
    </div>
  );
}
