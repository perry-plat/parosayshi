export type ProjectId =
  | "notebook"
  | "wiz-commerce"
  | "wiz-sales-data"
  | "wiz-email-flows"
  | "uber-kids"
  | "kriyadex"
  | "farevv"
  | "curo";

export interface ImageBlock {
  type: "image";
  src: string;
  alt?: string;
  caption?: string;
}

export interface ImageSlotBlock {
  type: "image-slot";
  label?: string;
  caption?: string;
  size?: string;
}

export interface VideoBlock {
  type: "video";
  src: string;
  caption?: string;
  poster?: string;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
}

export interface VideoCarouselBlock {
  type: "video-carousel";
  src?: string;
  items?: Array<{ src: string }>;
  poster?: string;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export interface MediaRowBlock {
  type: "media-row";
  variant?: string;
  size?: string;
  columns?: number;
  caption?: string;
  items: Array<{
    src: string;
    alt?: string;
  }>;
}

export interface AssetGridBlock {
  type: "asset-grid";
  variant?: string;
  caption?: string;
  items: Array<{
    src: string;
    alt?: string;
    label?: string;
  }>;
}

export interface ScreenGridBlock {
  type: "screen-grid";
  screens: Array<{
    label: string;
    title: string;
    body: string;
    notes: string[];
  }>;
}

export interface RedColumnsBlock {
  type: "red-columns";
  columns: Array<{
    strong: string;
    text?: string;
  }>;
}

export interface HeadingBlock {
  type: "heading";
  text: string;
}

export interface EyebrowBlock {
  type: "eyebrow";
  text: string;
}

export interface QuoteBlock {
  type: "quote";
  text: string;
}

export interface ListBlock {
  type: "list";
  items: string[];
}

export interface DividerBlock {
  type: "divider";
}

export interface SmallNoteBlock {
  type: "small-note";
  text: string;
}

export type ProjectBodyBlock =
  | ImageBlock
  | ImageSlotBlock
  | VideoBlock
  | VideoCarouselBlock
  | MediaRowBlock
  | AssetGridBlock
  | ScreenGridBlock
  | RedColumnsBlock
  | HeadingBlock
  | EyebrowBlock
  | QuoteBlock
  | ListBlock
  | DividerBlock
  | SmallNoteBlock
  | string;

export interface ProjectData {
  edition?: "case-file" | "field-note" | "dispatch" | "prototype" | "margin-note";
  figmaLayout?: "frame32" | string;
  mastheadDate?: string;
  mastheadBrand?: string;
  mastheadLogo?: string;
  kicker: string;
  title: string;
  deck: string;
  meta?: string[];
  leadImage?: ImageBlock | ImageSlotBlock;
  leadCaption?: string;
  introColumns?: string[];
  body: ProjectBodyBlock[];
}

export type ProjectsMap = Record<ProjectId, ProjectData>;
