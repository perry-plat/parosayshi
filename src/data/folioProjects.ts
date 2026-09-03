import type { CSSProperties } from "react";
import type { ProjectCarouselMedia } from "../components/ProjectMediaCarousel";

export type FolioProjectId =
  | "superr"
  | "wiz-commerce"
  | "journal-desk"
  | "uber-kids"
  | "periodic-table"
  | "kriyadex"
  | "curo"
  | "farevv";

export type FolioProjectMedia = ProjectCarouselMedia & {
  ratio: "landscape" | "portrait" | "square";
};

export interface FolioFolderPreview {
  color: CSSProperties["backgroundColor"];
  label: string;
  position?: CSSProperties["objectPosition"];
  src?: string;
}

export interface FolioProject {
  cardMeta: string;
  cardTitle: string;
  description: string;
  externalLabel?: string;
  externalUrl?: string;
  folderPreviews: readonly FolioFolderPreview[];
  id: FolioProjectId;
  logo?: string;
  media: readonly FolioProjectMedia[];
  previewMedia: readonly ProjectCarouselMedia[];
  services: readonly string[];
  title: string;
  tone: "charcoal" | "cobalt";
  year: string;
}

const superrMedia = [
  { alt: "Open Superr library book", background: "#fff9f7", fit: "contain", kind: "image", ratio: "square", src: "/assets/invoice-folio/superr-book-yohoo.png" },
  { ariaLabel: "Superr green interaction demonstration", background: "#a8e971", fit: "cover", kind: "video", poster: "/assets/invoice-folio/superr-green-poster.jpg", ratio: "square", src: "/assets/invoice-folio/superr-green-square.mp4" },
  { ariaLabel: "Superr search interaction demonstration", background: "#f6f3ed", fit: "contain", kind: "video", ratio: "portrait", src: "/assets/invoice-folio/superr-search-scene.mp4" },
  { alt: "Superr stretching canvas interface", background: "#efeae2", fit: "cover", kind: "image", ratio: "landscape", src: "/assets/invoice-folio/superr-stretching.png" },
  { alt: "Profile icons designed for kids", background: "#faf4ec", fit: "contain", kind: "image", ratio: "square", src: "/assets/invoice-folio/superr-profile-icons.png" },
  { alt: "Superr science crossword activity", background: "#e6eef0", fit: "cover", kind: "image", ratio: "landscape", src: "/assets/invoice-folio/superr-crossword.png" },
] as const satisfies readonly FolioProjectMedia[];

const journalMedia = [
  { ariaLabel: "Journal Desk writing interaction", background: "#11191b", fit: "contain", kind: "video", ratio: "landscape", src: "/assets/invoice-folio/project-two-preview.mp4" },
  { alt: "Closed black field notebook on a warm paper surface", background: "#e8dfd1", fit: "cover", kind: "image", ratio: "portrait", src: "/assets/new/notebook-closed-realistic.png" },
  { alt: "Black field notebook cover", background: "#d9d0c3", fit: "contain", kind: "image", ratio: "portrait", src: "/assets/new/notebook-cover-cutout-v2.png" },
] as const satisfies readonly FolioProjectMedia[];

const wizCommerceMedia = [
  { alt: "WizCommerce dashboard and product surfaces", background: "#f3eee6", fit: "cover", kind: "image", ratio: "landscape", src: "/assets/new/wizcommerce-frame32/hero-dashboard.png" },
  { alt: "WizCommerce visual system overview", background: "#e9e1d7", fit: "cover", kind: "image", ratio: "landscape", src: "/assets/new/wizcommerce-frame32/visuals-grid-111.png" },
  { alt: "WizPay transaction table", background: "#edf2eb", fit: "contain", kind: "image", ratio: "portrait", src: "/assets/new/wizcommerce-frame32/wizpay-table.png" },
  { alt: "WizAI assistant panel", background: "#f5efe8", fit: "contain", kind: "image", ratio: "portrait", src: "/assets/new/wizcommerce-frame32/wizai-panel.png" },
] as const satisfies readonly FolioProjectMedia[];

const uberKidsMedia = [
  { alt: "Uber Kids onboarding invitation illustration", background: "#f0e8ff", fit: "cover", kind: "image", ratio: "landscape", src: "/assets/new/uber-kids/invite-hero.png" },
  { alt: "Bengaluru approved places map", background: "#ebe4fb", fit: "cover", kind: "image", ratio: "square", src: "/assets/new/uber-kids/map-bengaluru.png" },
  { alt: "Uber Kids home place illustration", background: "#f3effb", fit: "contain", kind: "image", ratio: "square", src: "/assets/new/uber-kids/place-home.png" },
  { alt: "Uber Kids swimming place illustration", background: "#eee8f8", fit: "contain", kind: "image", ratio: "square", src: "/assets/new/uber-kids/place-swimming.png" },
] as const satisfies readonly FolioProjectMedia[];

const periodicTableMedia = [
  { alt: "Interactive periodic table reference interface", background: "#dfddd2", fit: "contain", kind: "image", ratio: "portrait", src: "/assets/periodic-table-specimen.svg" },
] as const satisfies readonly FolioProjectMedia[];

const kriyadexMedia = [
  { alt: "KriyaDEX identity mark and wordmark", background: "#171717", fit: "contain", kind: "image", ratio: "landscape", src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png" },
] as const satisfies readonly FolioProjectMedia[];

const curoMedia = [
  { alt: "Curo learning resources interface", background: "#eff1ea", fit: "cover", kind: "image", ratio: "landscape", src: "/assets/lREVKnbZDxTdgCdlTMAcEQXvxE.png" },
  { alt: "Curo generated learning path", background: "#f1efe7", fit: "cover", kind: "image", ratio: "landscape", src: "/assets/QZDLAFRGxs00xycurq0DyWxc.png" },
] as const satisfies readonly FolioProjectMedia[];

const farevvMedia = [
  { alt: "Farevv fashion product exploration", background: "#1f1e1d", fit: "cover", kind: "image", position: "center top", ratio: "portrait", src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png" },
] as const satisfies readonly FolioProjectMedia[];

export const folioProjects: Record<FolioProjectId, FolioProject> = {
  superr: {
    cardMeta: "AI / EdTech / Product systems", cardTitle: "Superr",
    description: "Designing learning tools and AI-assisted creation workflows while building the shared system that helps them ship clearly.",
    externalLabel: "Visit Superr", externalUrl: "https://superr.ai",
    folderPreviews: [
      { color: "#f4efe6", label: "Library", position: "center 24%", src: "/assets/invoice-folio/superr-project-placeholder-5.png?v=1" },
      { color: "#a8e971", label: "Make", src: "/assets/invoice-folio/superr-green-poster.jpg" },
      { color: "#f7f1e8", label: "Activities", src: "/assets/invoice-folio/superr-crossword.png" },
    ],
    id: "superr", logo: "/assets/invoice-folio/superr-current-mark.svg", media: superrMedia, previewMedia: superrMedia,
    services: ["Product design", "Design systems", "Frontend workflows"], title: "Superr", tone: "cobalt", year: "2025—26",
  },
  "wiz-commerce": {
    cardMeta: "B2B commerce / Product systems", cardTitle: "WizCommerce",
    description: "Two years designing across payments, field sales, customer communication, AI, and the systems connecting them.",
    folderPreviews: [
      { color: "#f2eee8", label: "Product", src: "/assets/new/wizcommerce-frame32/hero-dashboard.png" },
      { color: "#dce9dc", label: "WizPay", src: "/assets/new/wizcommerce-frame32/wizpay-table.png" },
      { color: "#ebe4dd", label: "System", src: "/assets/new/wizcommerce-frame32/visuals-grid-111.png" },
    ],
    id: "wiz-commerce", logo: "/assets/invoice-folio/wizcommerce-current-mark.svg", media: wizCommerceMedia, previewMedia: wizCommerceMedia,
    services: ["Product design", "Commerce", "Design systems"], title: "WizCommerce", tone: "charcoal", year: "2023—25",
  },
  "journal-desk": {
    cardMeta: "Personal tool / Local-first", cardTitle: "Journal Desk",
    description: "A local-first writing desk exploring how digital notes, paper movement, and highlighting can still feel physical.",
    folderPreviews: [
      { color: "#171918", label: "Notebook", src: "/assets/new/notebook-closed-realistic.png" },
      { color: "#d2ff4d", label: "Highlight" }, { color: "#f5f0e6", label: "Field notes" },
    ],
    id: "journal-desk", logo: "/assets/invoice-folio/paro-mark.svg", media: journalMedia, previewMedia: journalMedia.slice(0, 1),
    services: ["Product design", "Interaction", "Frontend"], title: "Journal Desk", tone: "charcoal", year: "2026",
  },
  "uber-kids": {
    cardMeta: "Product concept / Safety", cardTitle: "Uber Kids",
    description: "A child-facing onboarding concept built around parent approvals, trusted places, safety codes, and fast help.",
    folderPreviews: [
      { color: "#eee7fb", label: "Invite", src: "/assets/new/uber-kids/invite-hero.png" },
      { color: "#e8e1f4", label: "Places", src: "/assets/new/uber-kids/map-bengaluru.png" },
      { color: "#f4effa", label: "Safety", src: "/assets/new/uber-kids/place-home.png" },
    ],
    id: "uber-kids", media: uberKidsMedia, previewMedia: uberKidsMedia,
    services: ["Product concept", "Mobile onboarding", "Safety"], title: "Uber Kids", tone: "cobalt", year: "2025",
  },
  "periodic-table": {
    cardMeta: "Prototype / Reference tool", cardTitle: "Periodic Table",
    description: "A compact interface for wandering through chemistry one element at a time.",
    folderPreviews: [
      { color: "#dddacf", label: "Elements", position: "center 18%", src: "/assets/periodic-table-specimen.svg" },
      { color: "#c95a4e", label: "Details" }, { color: "#5e826d", label: "Reference" },
    ],
    id: "periodic-table", media: periodicTableMedia, previewMedia: periodicTableMedia,
    services: ["Interaction prototype", "Reference design", "Android UI"], title: "Periodic Table", tone: "charcoal", year: "2024",
  },
  kriyadex: {
    cardMeta: "Identity / Product language", cardTitle: "KriyaDEX",
    description: "A compact freelance build spanning brand direction, logo language, and the first product shell.",
    folderPreviews: [
      { color: "#191919", label: "Identity", src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png" },
      { color: "#eee9df", label: "Logo system" }, { color: "#c8e5d4", label: "V0 MVP" },
    ],
    id: "kriyadex", media: kriyadexMedia, previewMedia: kriyadexMedia,
    services: ["Identity", "Branding", "Product shell"], title: "KriyaDEX", tone: "charcoal", year: "2023",
  },
  curo: {
    cardMeta: "AI learning / MVP", cardTitle: "Curo",
    description: "A learning-product MVP exploring paths, useful resources, and AI-guided understanding.",
    folderPreviews: [
      { color: "#eff1ea", label: "Resources", src: "/assets/lREVKnbZDxTdgCdlTMAcEQXvxE.png" },
      { color: "#f0ede5", label: "Learning path", src: "/assets/QZDLAFRGxs00xycurq0DyWxc.png" },
      { color: "#c9d8ad", label: "AI companion" },
    ],
    id: "curo", media: curoMedia, previewMedia: curoMedia,
    services: ["Product concept", "AI learning", "MVP"], title: "Curo", tone: "charcoal", year: "Ongoing",
  },
  farevv: {
    cardMeta: "Anti-portfolio / Fashion", cardTitle: "Farevv",
    description: "A deliberately unfinished fashion-product direction held as a visual fragment instead of a polished case study.",
    folderPreviews: [
      { color: "#211f1d", label: "Product fragment", position: "center top", src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png" },
      { color: "#e7d8cb", label: "Fashion" }, { color: "#bd4c39", label: "Direction" },
    ],
    id: "farevv", media: farevvMedia, previewMedia: farevvMedia,
    services: ["Product concept", "Fashion", "Visual direction"], title: "Farevv", tone: "charcoal", year: "Ongoing",
  },
};

export const folioProjectOrder: readonly FolioProjectId[] = [
  "superr", "wiz-commerce", "journal-desk", "uber-kids",
  "periodic-table", "kriyadex", "curo", "farevv",
];
