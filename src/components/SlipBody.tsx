import { useState, type CSSProperties, type ReactElement } from "react";
import { AsteriskIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import type {
  AssetGridBlock,
  ImageBlock,
  ImageSlotBlock,
  MediaRowBlock,
  ProjectBodyBlock,
  ScreenGridBlock,
  VideoBlock,
  VideoCarouselBlock,
} from "../types/project";

function SlipFigure({
  block,
  className = "slip-figure",
}: {
  block: ImageBlock;
  className?: string;
}) {
  return (
    <figure className={className}>
      <img src={block.src} alt={block.alt || ""} loading="eager" decoding="async" />
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  );
}

function ImageSlot({
  block,
  className = "slip-figure",
}: {
  block: ImageSlotBlock;
  className?: string;
}) {
  return (
    <figure className={`${className} slip-image-slot-figure`} data-size={block.size}>
      <div className="slip-image-slot">{block.label || "Image export"}</div>
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  );
}

function SlipVideo({ block }: { block: VideoBlock }) {
  return (
    <figure className="slip-figure slip-video-figure">
      <video
        src={block.src}
        muted={block.muted !== false}
        loop={block.loop !== false}
        playsInline
        preload="metadata"
        controls={block.controls !== false}
        autoPlay={Boolean(block.autoPlay)}
        poster={block.poster}
      />
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  );
}

function VideoCarousel({ block }: { block: VideoCarouselBlock }) {
  const items = block.items?.length ? block.items : block.src ? [{ src: block.src }] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex] || items[0];

  if (!active) return null;

  const setActiveVideo = (nextIndex: number) => {
    setActiveIndex((nextIndex + items.length) % items.length);
  };

  return (
    <section className="slip-video-carousel">
      <div className="video-carousel-stage">
        <video
          key={active.src}
          src={active.src}
          muted={block.muted !== false}
          loop={block.loop !== false}
          playsInline
          preload="metadata"
          controls={block.controls !== false}
          poster={block.poster}
        />
        <button
          className="video-carousel-arrow video-carousel-arrow-prev"
          type="button"
          aria-label="Previous video"
          onClick={() => setActiveVideo(activeIndex - 1)}
        >
          <CaretLeftIcon aria-hidden="true" size={32} weight="bold" />
        </button>
        <button
          className="video-carousel-arrow video-carousel-arrow-next"
          type="button"
          aria-label="Next video"
          onClick={() => setActiveVideo(activeIndex + 1)}
        >
          <CaretRightIcon aria-hidden="true" size={32} weight="bold" />
        </button>
        <div className="video-carousel-dots">
          {items.map((item, index) => (
            <span
              key={item.src}
              className={index === activeIndex ? "is-active" : undefined}
              role="button"
              tabIndex={0}
              aria-label={`Show video ${index + 1}`}
              onClick={() => setActiveVideo(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveVideo(index);
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ScreenGrid({ block }: { block: ScreenGridBlock }) {
  return (
    <figure className="slip-screen-grid">
      <div className="screen-grid">
        {block.screens.map((screen) => (
          <article className="screen-card" key={`${screen.label}-${screen.title}`}>
            <p className="screen-card-label">{screen.label}</p>
            <h4>{screen.title}</h4>
            <p>{screen.body}</p>
            <ul>
              {screen.notes.map((note) => (
                <li key={note}>
                  <AsteriskIcon aria-hidden="true" size={13} weight="bold" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </figure>
  );
}

function AssetGrid({ block }: { block: AssetGridBlock }) {
  return (
    <figure className="slip-asset-grid" data-variant={block.variant}>
      <div className="asset-grid">
        {block.items.map((item) => (
          <div className="asset-card" key={`${item.src}-${item.label || ""}`}>
            <img src={item.src} alt={item.alt || ""} loading="eager" decoding="async" />
            {item.label ? <span>{item.label}</span> : null}
          </div>
        ))}
      </div>
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  );
}

function RedColumns({ block }: { block: Extract<ProjectBodyBlock, { type: "red-columns" }> }) {
  return (
    <div className="slip-red-columns">
      {block.columns.map((column) => (
        <p key={`${column.strong}-${column.text || ""}`}>
          <strong>{column.strong}</strong>
          {column.text || ""}
        </p>
      ))}
    </div>
  );
}

function MediaRow({ block }: { block: MediaRowBlock }) {
  return (
    <figure
      className="slip-media-row"
      data-variant={block.variant}
      data-size={block.size}
      style={{ "--media-row-columns": block.columns || block.items.length || 2 } as CSSProperties}
    >
      <div className="media-row">
        {block.items.map((item) => (
          <img key={item.src} src={item.src} alt={item.alt || ""} loading="eager" decoding="async" />
        ))}
      </div>
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  );
}

export function LeadMedia({ block }: { block: ImageBlock | ImageSlotBlock }) {
  if (block.type === "image-slot") {
    return <ImageSlot block={block} className="slip-lead-figure" />;
  }
  return <SlipFigure block={block} className="slip-lead-figure" />;
}

function BodyBlock({ block }: { block: Exclude<ProjectBodyBlock, string> }) {
  switch (block.type) {
    case "heading":
      return <h3>{block.text}</h3>;
    case "eyebrow":
      return <p className="slip-eyebrow">{block.text}</p>;
    case "image":
      return <SlipFigure block={block} />;
    case "image-slot":
      return <ImageSlot block={block} />;
    case "video":
      return <SlipVideo block={block} />;
    case "video-carousel":
      return <VideoCarousel block={block} />;
    case "screen-grid":
      return <ScreenGrid block={block} />;
    case "asset-grid":
      return <AssetGrid block={block} />;
    case "red-columns":
      return <RedColumns block={block} />;
    case "media-row":
      return <MediaRow block={block} />;
    case "small-note":
      return <p className="slip-small-note">{block.text}</p>;
    case "divider":
      return <div className="slip-section-divider" aria-hidden="true" />;
    case "quote":
      return <blockquote>{block.text}</blockquote>;
    case "list":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>
              <AsteriskIcon aria-hidden="true" size={16} weight="bold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export function SlipBody({ blocks }: { blocks: ProjectBodyBlock[] }) {
  const nodes: ReactElement[] = [];
  let proseRun: string[] = [];
  let index = 0;

  const flushProse = () => {
    if (!proseRun.length) return;
    const prose = proseRun;
    proseRun = [];
    nodes.push(
      <div className="slip-prose" key={`prose-${index}`}>
        {prose.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>,
    );
    index += 1;
  };

  blocks.forEach((block) => {
    if (typeof block === "string") {
      proseRun.push(block);
      return;
    }
    flushProse();
    nodes.push(<BodyBlock block={block} key={`block-${index}`} />);
    index += 1;
  });
  flushProse();

  return <div className="slip-body">{nodes}</div>;
}
