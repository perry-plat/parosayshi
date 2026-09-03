import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRightIcon, PaintBrushBroadIcon } from "@phosphor-icons/react";
import { LayoutGroup, motion } from "motion/react";
import {
  AnnualReportCover,
  type AnnualCoverConfig,
  type AnnualCoverPalette,
  type AnnualCoverStructure,
} from "./components/AnnualReportCover";
import {
  LegacyProjectFolderCover,
  ProjectFolderCover,
  type ProjectFolderMotionState,
} from "./components/ProjectFolderCover";
import { NotebookCover, Sketchbook } from "./components/Sketchbook";
import {
  ProjectBoardLibrary,
  type ProjectBoardItem,
} from "./components/ProjectBoardLibrary";
import {
  ProjectScrollLibrary,
  type ProjectBrowseItem,
} from "./components/ProjectScrollLibrary";
import { InvoiceFolioHome } from "./components/InvoiceFolioHome";
import { PlayPage } from "./components/PlayPage";
import { SunlightShader } from "./components/SunlightShader";
import { SpotlightCursor } from "./components/SpotlightCursor";
import { TableStickerLayer } from "./components/TableStickerLayer";
import { EmbroideredFooter } from "./components/EmbroideredFooter";
import { CaseStudyReader } from "./components/WizCommerceReader";
import { projectFolderPresentations } from "./data/folderPresentations";
import { projects } from "./data/projects";
import { workCards } from "./data/workCards";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useSlip } from "./hooks/useSlip";
import type { ProjectId } from "./types/project";

interface BookEdition {
  annualCover?: AnnualCoverStructure;
  coverStyle?: "translucent-annual";
  id: ProjectId;
  number: string;
  coverTitle: string;
  coverLine: string;
  coverArt: string;
  coverArtScale: string;
  image: string;
  x: string;
  y: string;
  width: string;
  height: string;
  rotate: string;
  cover: string;
  ink: string;
  accent: string;
  format?: "portrait" | "landscape";
  imagePosition?: string;
  z: string;
}

type CoverComparisonMode = "annual" | "original";
type AnnualPaletteMode = "current" | "vivid";
type WizObjectMode = "file" | "folder" | "notebook";
type FolderCoverVersion = "stamp" | "legacy";
type ProjectViewMode = "archive" | "current" | "scroll" | "board";

function getInitialProjectViewMode(): ProjectViewMode {
  if (typeof window === "undefined") return "archive";
  const requestedMode = new URLSearchParams(window.location.search).get("project-view");
  return requestedMode === "current" || requestedMode === "scroll" || requestedMode === "board"
    ? requestedMode
    : "archive";
}

function getInitialCoverComparisonMode(): CoverComparisonMode {
  if (typeof window === "undefined") return "annual";
  return new URLSearchParams(window.location.search).get("cover-style") === "original" ? "original" : "annual";
}

function getInitialAnnualPaletteMode(): AnnualPaletteMode {
  if (typeof window === "undefined") return "vivid";
  return new URLSearchParams(window.location.search).get("cover-palette") === "current" ? "current" : "vivid";
}

function getInitialAnnualEmbossEnabled() {
  if (typeof window === "undefined") return true;
  return new URLSearchParams(window.location.search).get("cover-emboss") !== "off";
}

function getInitialAnnualHoverPreview(): ProjectId | null {
  if (typeof window === "undefined") return null;
  const projectId = window.location.search
    ? new URLSearchParams(window.location.search).get("cover-hover") || undefined
    : undefined;
  if (!isProjectId(projectId) || projectId === "notebook") return null;
  return projectId;
}

function getInitialFolderCoverVersion(): FolderCoverVersion {
  if (typeof window === "undefined") return "stamp";
  return new URLSearchParams(window.location.search).get("folder-style") === "legacy"
    ? "legacy"
    : "stamp";
}

const cardById = new Map(workCards.map((card) => [card.id, card]));

const matPalettes = [
  {
    id: "bright-orange",
    label: "Bright orange",
    color: "#f06a27",
    line: "rgb(255 249 236 / 0.82)",
    major: "rgb(255 249 236 / 0.46)",
    minor: "rgb(255 249 236 / 0.14)",
    tag: "#1e1612",
  },
  {
    id: "warm-clay",
    label: "Dark clay",
    color: "#b9482f",
    line: "rgb(255 239 216 / 0.78)",
    major: "rgb(255 239 216 / 0.4)",
    minor: "rgb(255 239 216 / 0.12)",
    tag: "#21130f",
  },
  {
    id: "oxblood",
    label: "Oxblood",
    color: "#7b2632",
    line: "rgb(255 237 211 / 0.78)",
    major: "rgb(255 237 211 / 0.4)",
    minor: "rgb(255 237 211 / 0.12)",
    tag: "#f5efe3",
  },
  {
    id: "warm-ivory",
    label: "Smoked ivory",
    color: "#d8d0bd",
    line: "rgb(35 29 24 / 0.6)",
    major: "rgb(35 29 24 / 0.24)",
    minor: "rgb(35 29 24 / 0.1)",
    tag: "#1e1612",
  },
  {
    id: "dark-green",
    label: "Classic green",
    color: "#00332a",
    line: "rgb(229 229 90 / 0.38)",
    major: "rgb(229 229 90 / 0.2)",
    minor: "rgb(229 229 90 / 0.07)",
    tag: "#073d34",
  },
  {
    id: "blue",
    label: "Ink blue",
    color: "#173f8f",
    line: "rgb(244 248 255 / 0.78)",
    major: "rgb(244 248 255 / 0.34)",
    minor: "rgb(244 248 255 / 0.1)",
    tag: "#f5efe3",
  },
  {
    id: "purple",
    label: "Aubergine",
    color: "#3f245f",
    line: "rgb(253 241 255 / 0.78)",
    major: "rgb(253 241 255 / 0.34)",
    minor: "rgb(253 241 255 / 0.1)",
    tag: "#f5efe3",
  },
  {
    id: "violet",
    label: "Dark violet",
    color: "#542f88",
    line: "rgb(255 245 236 / 0.78)",
    major: "rgb(255 245 236 / 0.34)",
    minor: "rgb(255 245 236 / 0.1)",
    tag: "#f5efe3",
  },
  {
    id: "soft-black",
    label: "Soft black",
    color: "#191614",
    line: "rgb(255 241 213 / 0.74)",
    major: "rgb(255 241 213 / 0.34)",
    minor: "rgb(255 241 213 / 0.1)",
    tag: "#f5efe3",
  },
] as const;

const wizFileCoverVariants = {
  cobalt: {
    id: "cobalt",
    art: "/assets/new/wiz-file-cover-cobalt-matte-v2.png",
    deepTint: "#173c83",
    ink: "#fff0b8",
    tint: "#2d5fbc",
  },
  emerald: {
    id: "emerald",
    art: "/assets/new/wiz-file-cover-emerald-matte-v2.png",
    deepTint: "#124e3b",
    ink: "#f7edc5",
    tint: "#197a5b",
  },
  oxblood: {
    id: "oxblood",
    art: "/assets/new/wiz-file-cover-oxblood-matte-v2.png",
    deepTint: "#4d1423",
    ink: "#f8e7cb",
    tint: "#84283a",
  },
  saffron: {
    id: "saffron",
    art: "/assets/new/wiz-file-cover-saffron-matte-v2.png",
    deepTint: "#8a5d0c",
    ink: "#682635",
    tint: "#d79b16",
  },
  vermilion: {
    id: "vermilion",
    art: "/assets/new/wiz-file-cover-vermilion-matte-v2.png",
    deepTint: "#872619",
    ink: "#fff0cf",
    tint: "#cf482d",
  },
  violet: {
    id: "violet",
    art: "/assets/new/wiz-file-cover-violet-matte-v2.png",
    deepTint: "#3f286f",
    ink: "#f6efbe",
    tint: "#7252b7",
  },
} as const;

type MatPaletteId = (typeof matPalettes)[number]["id"];
type WizFileCoverVariant = (typeof wizFileCoverVariants)[keyof typeof wizFileCoverVariants];

const visualWorlds = [
  {
    id: "workbench",
    label: "Workbench",
    mat: "dark-green",
    note: "cutting mat / active files",
  },
  {
    id: "pond",
    label: "Specimen",
    mat: "soft-black",
    note: "rendered objects / night shift",
  },
  {
    id: "archive",
    label: "Archive",
    mat: "warm-ivory",
    note: "paper stock / release notes",
  },
] as const;

type VisualWorldId = (typeof visualWorlds)[number]["id"];

function getInitialVisualWorld(): VisualWorldId {
  if (typeof window === "undefined") return "workbench";
  try {
    const saved = window.localStorage.getItem("parosayshi:visual-world");
    return visualWorlds.some((world) => world.id === saved)
      ? saved as VisualWorldId
      : "workbench";
  } catch {
    return "workbench";
  }
}

const wizFileCoverByMat: Record<MatPaletteId, WizFileCoverVariant> = {
  "bright-orange": wizFileCoverVariants.cobalt,
  "warm-clay": wizFileCoverVariants.violet,
  oxblood: wizFileCoverVariants.emerald,
  "warm-ivory": wizFileCoverVariants.oxblood,
  "dark-green": wizFileCoverVariants.vermilion,
  blue: wizFileCoverVariants.saffron,
  purple: wizFileCoverVariants.saffron,
  violet: wizFileCoverVariants.emerald,
  "soft-black": wizFileCoverVariants.cobalt,
};

const projectFileCoverVariants: Partial<Record<ProjectId, WizFileCoverVariant>> = {
  "uber-kids": wizFileCoverVariants.saffron,
  "wiz-sales-data": wizFileCoverVariants.cobalt,
  "wiz-email-flows": wizFileCoverVariants.vermilion,
  farevv: wizFileCoverVariants.oxblood,
  kriyadex: wizFileCoverVariants.violet,
  curo: wizFileCoverVariants.emerald,
};

const annualCoverPalettes: Partial<Record<ProjectId, Record<AnnualPaletteMode, AnnualCoverPalette>>> = {
  "wiz-commerce": {
    current: {
      backing: "#f3dfa5",
      ink: "#3f111f",
      tabs: [
        { color: "#f3c95c", ink: "#4f2d13", label: "PAYMENTS" },
        { color: "#66a7e8", ink: "#132c53", label: "AI" },
        { color: "#a8de79", ink: "#1f4728", label: "SYSTEMS" },
      ],
      title: "#ffe6bd",
      underprint: "#56172b",
      tint: "#8f3048",
    },
    vivid: {
      backing: "#f6e3ae",
      ink: "#590b22",
      tabs: [
        { color: "#fff0bc", ink: "#590b22", label: "PAYMENTS" },
        { color: "#23a6a0", ink: "#082e31", label: "AI" },
        { color: "#7b102d", ink: "#fff0bc", label: "SYSTEMS" },
      ],
      title: "#fff0bc",
      underprint: "#760e2b",
      tint: "#b62a46",
    },
  },
  "uber-kids": {
    current: {
      backing: "#f7e8b4",
      ink: "#1b2942",
      tabs: [
        { color: "#f46e46", ink: "#4b1d18", label: "SAFETY" },
        { color: "#4e91e8", ink: "#102d5f", label: "FAMILY" },
        { color: "#9bd760", ink: "#23461b", label: "RIDES" },
      ],
      title: "#fff7d5",
      underprint: "#8b680d",
      tint: "#d8ad28",
    },
    vivid: {
      backing: "#f8e9b8",
      ink: "#17284f",
      tabs: [
        { color: "#fff3c1", ink: "#624600", label: "SAFETY" },
        { color: "#2d55b7", ink: "#fff3c1", label: "FAMILY" },
        { color: "#a86c00", ink: "#fff0bc", label: "RIDES" },
      ],
      title: "#fff3c1",
      underprint: "#9b6800",
      tint: "#edb817",
    },
  },
  "wiz-sales-data": {
    current: {
      backing: "#f4e2aa",
      ink: "#0a1d4e",
      tabs: [
        { color: "#d8ff3f", ink: "#25360c", label: "DATA" },
        { color: "#ee90b4", ink: "#4c1732", label: "SALES" },
        { color: "#f3c854", ink: "#4c3510", label: "TOOLS" },
      ],
      title: "#edf7ff",
      underprint: "#0c2d82",
      tint: "#2459cc",
    },
    vivid: {
      backing: "#eee3b3",
      ink: "#071c56",
      tabs: [
        { color: "#f2ffd0", ink: "#071c56", label: "DATA" },
        { color: "#f15b3c", ink: "#4f1208", label: "SALES" },
        { color: "#0a318e", ink: "#f2ffd0", label: "TOOLS" },
      ],
      title: "#f2ffd0",
      underprint: "#0a318e",
      tint: "#1d55d4",
    },
  },
  "wiz-email-flows": {
    current: {
      backing: "#f5dfa9",
      ink: "#5a1d19",
      tabs: [
        { color: "#f6d54a", ink: "#4b3510", label: "EMAIL" },
        { color: "#45a2eb", ink: "#12345b", label: "FLOWS" },
        { color: "#9bdc77", ink: "#1f4727", label: "SYSTEM" },
      ],
      title: "#fff0cd",
      underprint: "#922a20",
      tint: "#e25735",
    },
    vivid: {
      backing: "#f4e0aa",
      ink: "#74150c",
      tabs: [
        { color: "#f1ffcf", ink: "#74150c", label: "EMAIL" },
        { color: "#1599b0", ink: "#063746", label: "FLOWS" },
        { color: "#9b2012", ink: "#fff0c8", label: "SYSTEM" },
      ],
      title: "#f1ffcf",
      underprint: "#9b2012",
      tint: "#d94321",
    },
  },
  farevv: {
    current: {
      backing: "#f4e7bb",
      ink: "#3b245d",
      tabs: [
        { color: "#ff694f", ink: "#541c17", label: "WEB" },
        { color: "#54b6eb", ink: "#133d58", label: "PLAY" },
        { color: "#b9e46b", ink: "#334616", label: "META" },
      ],
      title: "#fff9e9",
      underprint: "#775fa9",
      tint: "#b5a1df",
    },
    vivid: {
      backing: "#f1e2b3",
      ink: "#2c124b",
      tabs: [
        { color: "#fff1c7", ink: "#2c124b", label: "WEB" },
        { color: "#b5d83b", ink: "#263407", label: "PLAY" },
        { color: "#59308d", ink: "#fff1c7", label: "META" },
      ],
      title: "#fff1c7",
      underprint: "#59308d",
      tint: "#8756ce",
    },
  },
  kriyadex: {
    current: {
      backing: "#f2e5b7",
      ink: "#173b25",
      tabs: [
        { color: "#efbe55", ink: "#4d3510", label: "BRAND" },
        { color: "#79a8eb", ink: "#17325d", label: "SYSTEM" },
        { color: "#e77d9b", ink: "#4f1d31", label: "LOGO" },
      ],
      title: "#efffe7",
      underprint: "#276c43",
      tint: "#5fa776",
    },
    vivid: {
      backing: "#ede6b6",
      ink: "#063a24",
      tabs: [
        { color: "#f1f9c8", ink: "#063a24", label: "BRAND" },
        { color: "#d6537d", ink: "#4d0b25", label: "SYSTEM" },
        { color: "#095f38", ink: "#f1f9c8", label: "LOGO" },
      ],
      title: "#f1f9c8",
      underprint: "#095f38",
      tint: "#168957",
    },
  },
  curo: {
    current: {
      backing: "#f4e7ba",
      ink: "#14394c",
      tabs: [
        { color: "#f05d45", ink: "#551d18", label: "MVP" },
        { color: "#345ba6", ink: "#eaf3ff", label: "LEARN" },
        { color: "#b8df6d", ink: "#314713", label: "BUILD" },
      ],
      title: "#fff6dc",
      underprint: "#2f7994",
      tint: "#68b7d0",
    },
    vivid: {
      backing: "#f3e3af",
      ink: "#07354b",
      tabs: [
        { color: "#fff0c8", ink: "#07354b", label: "MVP" },
        { color: "#e9573f", ink: "#53130a", label: "LEARN" },
        { color: "#075f80", ink: "#eaf8ce", label: "BUILD" },
      ],
      title: "#fff0c8",
      underprint: "#075f80",
      tint: "#158ebb",
    },
  },
};

const bookEditions: BookEdition[] = [
  {
    id: "periodic-table",
    number: "08",
    coverTitle: "Periodic Table",
    coverLine: "A reference tool, made browseable",
    coverArt: "/assets/periodic-table-specimen.svg",
    coverArtScale: "1",
    image: "/assets/periodic-table-specimen.svg",
    x: "calc(50% + min(390px, 31vw) - 205px)",
    y: "3860px",
    width: "430px",
    height: "575px",
    rotate: "-7deg",
    cover: "#d9c945",
    ink: "#1d211d",
    accent: "#6ca8d4",
    z: "13",
  },
  {
    id: "wiz-commerce",
    number: "01",
    coverTitle: "WizCommerce",
    coverLine: "Designing the operating layer for wholesale",
    coverArt: "/assets/new/book-covers/wiz-commerce-cover.png",
    coverArtScale: "1.13",
    image: "/assets/new/wizcommerce-frame32/uploads/wizpay-responsive-transactions.png",
    x: "calc(50% - min(390px, 31vw) - 260px)",
    y: "858px",
    width: "520px",
    height: "660px",
    rotate: "-11deg",
    cover: "#772739",
    ink: "#f9ead3",
    accent: "#f3a647",
    coverStyle: "translucent-annual",
    annualCover: {
      capsule: "PAROSAYSHI / PRODUCT DESIGN",
      embossMark: "WIZ 01",
      mark: "*",
      titleLines: ["WizCommerce"],
      titleSize: "9.2cqw",
      underprintText: "WIZ / 01",
      year: "2023–25",
    },
    z: "8",
  },
  {
    id: "uber-kids",
    number: "04",
    coverTitle: "Small riders, big rules",
    coverLine: "Designing a safer Uber Kids onboarding",
    coverArt: "/assets/new/book-covers/uber-kids-cover.png",
    coverArtScale: "1.13",
    image: "/assets/new/uber-kids/invite-hero.png",
    x: "calc(50% + min(390px, 31vw) - 190px)",
    y: "1309px",
    width: "485px",
    height: "649px",
    rotate: "12deg",
    cover: "#edc844",
    ink: "#1d2940",
    accent: "#f46e46",
    coverStyle: "translucent-annual",
    annualCover: {
      capsule: "PAROSAYSHI / PRODUCT DESIGN",
      embossMark: "KID 04",
      mark: "( )",
      titleLines: ["Small riders,", "big rules"],
      titleSize: "10.2cqw",
      underprintText: "04 / SAFE",
      year: "2024–25",
    },
    imagePosition: "center 38%",
    z: "7",
  },
  {
    id: "wiz-sales-data",
    number: "02",
    coverTitle: "Signals for the sales floor",
    coverLine: "Making product data useful in the moment",
    coverArt: "/assets/new/book-covers/wiz-sales-data-cover.png",
    coverArtScale: "1.12",
    image: "/assets/case-studies/f2MFjaGV3u8MAIXdzRO9fHE2wc.png",
    x: "calc(50% - min(390px, 31vw) - 230px)",
    y: "1749px",
    width: "520px",
    height: "664px",
    rotate: "11deg",
    cover: "#2459cc",
    ink: "#fff9e9",
    accent: "#d8ff3f",
    coverStyle: "translucent-annual",
    annualCover: {
      capsule: "PAROSAYSHI / PRODUCT DESIGN",
      embossMark: "DATA 02",
      mark: "*",
      titleLines: ["Signals for", "the sales floor"],
      titleSize: "9.7cqw",
      underprintText: "02 / DATA",
      year: "2023–24",
    },
    z: "12",
  },
  {
    id: "wiz-email-flows",
    number: "03",
    coverTitle: "The mailroom manual",
    coverLine: "Anything and everything about automated email",
    coverArt: "/assets/new/book-covers/wiz-email-flows-cover.png",
    coverArtScale: "1.1",
    image: "/assets/case-studies/7pNOxoU2UIQLghgLPRTMAgwU1AE.png",
    x: "calc(50% + min(390px, 31vw) - 280px)",
    y: "2189px",
    width: "460px",
    height: "600px",
    rotate: "-13deg",
    cover: "#eb623e",
    ink: "#231f1c",
    accent: "#f6d54a",
    coverStyle: "translucent-annual",
    annualCover: {
      capsule: "PAROSAYSHI / PRODUCT DESIGN",
      embossMark: "MAIL 03",
      mark: "*",
      titleLines: ["The mailroom", "manual"],
      titleSize: "10.3cqw",
      underprintText: "03 / MAIL",
      year: "2023–24",
    },
    z: "9",
  },
  {
    id: "notebook",
    number: "00",
    coverTitle: "Things that stayed in the notebook",
    coverLine: "Loose ideas, interface studies, and unfinished thoughts",
    coverArt: "/assets/new/notebook-cover-cutout-tight-v3.png",
    coverArtScale: "1",
    image: "/assets/new/notebook-cover-key-v2.png",
    x: "calc(50% - 225px)",
    y: "4439px",
    width: "450px",
    height: "675px",
    rotate: "1.5deg",
    cover: "#25211d",
    ink: "#f4ead7",
    accent: "#db4f39",
    z: "9",
  },
  {
    id: "farevv",
    number: "06",
    coverTitle: "Farevv.",
    coverLine: "An anti-portfolio, bound anyway",
    coverArt: "/assets/new/book-covers/farevv-cover.png",
    coverArtScale: "1.05",
    image: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png",
    x: "calc(50% - min(390px, 31vw) - 260px)",
    y: "2629px",
    width: "445px",
    height: "590px",
    rotate: "-11deg",
    cover: "#c8b9eb",
    ink: "#2f2350",
    accent: "#ff694f",
    coverStyle: "translucent-annual",
    annualCover: {
      capsule: "PAROSAYSHI / PRODUCT DESIGN",
      embossMark: "FARE 06",
      titleLines: ["Farevv."],
      titleSize: "12.2cqw",
      underprintText: "06 / FARE",
      year: "2022–24",
    },
    z: "10",
  },
  {
    id: "kriyadex",
    number: "05",
    coverTitle: "KriyaDex",
    coverLine: "A logo walks into a system",
    coverArt: "/assets/new/book-covers/kriyadex-cover.png",
    coverArtScale: "1.11",
    image: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png",
    x: "calc(50% + min(390px, 31vw) - 155px)",
    y: "3075px",
    width: "430px",
    height: "568px",
    rotate: "15deg",
    cover: "#b8d79e",
    ink: "#20351f",
    accent: "#27744d",
    coverStyle: "translucent-annual",
    annualCover: {
      capsule: "PAROSAYSHI / PRODUCT DESIGN",
      embossMark: "KDX 05",
      mark: "*",
      titleLines: ["KriyaDex"],
      titleSize: "11cqw",
      underprintText: "05 / KDX",
      year: "2022–23",
    },
    z: "11",
  },
  {
    id: "curo",
    number: "07",
    coverTitle: "Curo.",
    coverLine: "Learning in public / an MVP in progress",
    coverArt: "/assets/new/book-covers/curo-cover.png",
    coverArtScale: "1.11",
    image: "/assets/lREVKnbZDxTdgCdlTMAcEQXvxE.png",
    x: "calc(50% - min(390px, 31vw) - 285px)",
    y: "3509px",
    width: "450px",
    height: "594px",
    rotate: "-9deg",
    cover: "#a6d9e9",
    ink: "#183442",
    accent: "#f05d45",
    coverStyle: "translucent-annual",
    annualCover: {
      capsule: "PAROSAYSHI / PRODUCT DESIGN",
      embossMark: "CURO 07",
      titleLines: ["Curo."],
      titleSize: "12.5cqw",
      underprintText: "07 / CURO",
      year: "2024–26",
    },
    z: "6",
  },
];

const scrollLibraryItems: ProjectBrowseItem[] = bookEditions
  .filter((edition) => edition.id !== "notebook")
  .map((edition) => {
    const project = projects[edition.id];
    const card = cardById.get(edition.id);
    return {
      accent: edition.accent,
      id: edition.id,
      kind: card?.edition || project.edition || "Case file",
      number: edition.number,
      period: edition.annualCover?.year || "ONGOING",
      summary: edition.coverLine,
      tags: "meta" in project && Array.isArray(project.meta)
        ? project.meta.slice(0, 2)
        : [],
      title: edition.coverTitle,
    };
  });

const boardLibraryItems: ProjectBoardItem[] = scrollLibraryItems.map((item) => {
  const edition = bookEditions.find((candidate) => candidate.id === item.id);
  const presentation = projectFolderPresentations[item.id];
  const fallbackImage = edition?.image || edition?.coverArt || "";
  return {
    id: item.id,
    images: presentation?.legacyArtifacts || [
      { label: item.title, src: fallbackImage },
      { label: item.summary, src: fallbackImage },
      { label: item.kind, src: fallbackImage },
    ],
    kind: item.kind,
    number: item.number,
    period: item.period,
    summary: item.summary,
    title: item.title,
  };
});

function resolveAnnualCover(
  edition: BookEdition | undefined,
  paletteMode: AnnualPaletteMode,
  embossEnabled: boolean,
): AnnualCoverConfig | undefined {
  if (!edition?.annualCover) return undefined;
  const palette = annualCoverPalettes[edition.id]?.[paletteMode];
  if (!palette) return undefined;
  return { ...edition.annualCover, ...palette, embossEnabled };
}

function isProjectId(id: string | undefined): id is ProjectId {
  return Boolean(id && Object.prototype.hasOwnProperty.call(projects, id));
}

function getBookStyle(edition: BookEdition) {
  return {
    "--book-x": edition.x,
    "--book-y": edition.y,
    "--book-w": edition.width,
    "--book-h": edition.height,
    "--book-aspect": `${Number.parseFloat(edition.width)} / ${Number.parseFloat(edition.height)}`,
    "--book-ratio": Number.parseFloat(edition.width) / Number.parseFloat(edition.height),
    "--book-rotate": edition.rotate,
    "--book-hover-rotate": `${(Number.parseFloat(edition.rotate) || 0) * 0.52}deg`,
    "--book-cover": edition.cover,
    "--book-cover-art": `url(${edition.coverArt})`,
    "--book-cover-art-scale": edition.coverArtScale,
    "--book-ink": edition.ink,
    "--book-accent": edition.accent,
    "--book-z": edition.z,
    "--book-image-position": edition.imagePosition || "center",
  } as CSSProperties;
}

function CaseStudyDeskFile({
  cover,
  edition,
}: {
  cover: WizFileCoverVariant;
  edition: BookEdition;
}) {
  const isWizCommerce = edition.id === "wiz-commerce";

  return (
    <motion.span
      className="wiz-reader-source"
      data-cover-tone={cover.id}
      layoutId={isWizCommerce ? "wizcommerce-folder-shell" : undefined}
      style={{ "--wiz-cover-ink": cover.ink } as CSSProperties}
      transition={{ layout: { type: "spring", stiffness: 150, damping: 25, mass: 0.9 } }}
      aria-hidden="true"
    >
      <span className="wiz-reader-source-insert is-wizpay">
        <img
          src={isWizCommerce
            ? "/assets/new/wizcommerce-frame32/uploads/wizpay-responsive-transactions.png"
            : edition.image}
          alt=""
        />
      </span>
      <span className="wiz-reader-source-insert is-wizai">
        <img
          src={isWizCommerce
            ? "/assets/new/wizcommerce-frame32/uploads/wizai-product-assistant.png"
            : edition.coverArt}
          alt=""
        />
      </span>
      <span className="wiz-reader-source-insert is-notes" />

      <span className="wiz-reader-source-cover">
        <img
          className="wiz-reader-source-cover-art"
          src={cover.art}
          alt=""
          draggable={false}
        />
        <span className="wiz-reader-source-title">
          {isWizCommerce ? "Building a wholesale operating layer" : edition.coverTitle}
        </span>
      </span>
    </motion.span>
  );
}

function WizCommerceNotebook() {
  return (
    <motion.span
      className="wiz-notebook-source"
      layoutId="wizcommerce-folder-shell"
      transition={{ layout: { type: "spring", stiffness: 150, damping: 25, mass: 0.9 } }}
      aria-hidden="true"
    >
      <img src="/assets/new/notebook-cover-cutout-tight-v3.png" alt="" draggable={false} />
      <span className="wiz-notebook-source-band">
        <strong>Building a wholesale operating layer</strong>
      </span>
    </motion.span>
  );
}

function BookObject({
  annualEmbossEnabled,
  annualHoverPreview,
  annualPaletteMode,
  browseActive = false,
  browseMode = false,
  coverComparisonMode,
  edition,
  folderCoverVersion = "stamp",
  isExpanded,
  isReturning = false,
  isSlotted = false,
  openSlip,
  reducedMotion,
  wizFileCover = wizFileCoverVariants.emerald,
  wizObjectMode = "file",
}: {
  annualEmbossEnabled: boolean;
  annualHoverPreview: ProjectId | null;
  annualPaletteMode: AnnualPaletteMode;
  browseActive?: boolean;
  browseMode?: boolean;
  coverComparisonMode: CoverComparisonMode;
  edition: BookEdition;
  folderCoverVersion?: FolderCoverVersion;
  isExpanded: boolean;
  isReturning?: boolean;
  isSlotted?: boolean;
  openSlip: (card: HTMLElement) => void;
  reducedMotion: boolean;
  wizFileCover?: WizFileCoverVariant;
  wizObjectMode?: WizObjectMode;
}) {
  const [isFolderPreviewed, setIsFolderPreviewed] = useState(false);
  const card = cardById.get(edition.id);
  const folderPresentation = projectFolderPresentations[edition.id];
  const coverFormat = browseMode && edition.id !== "notebook"
    ? "file"
    : edition.id === "notebook"
    ? "notebook"
    : edition.id === "wiz-commerce"
      ? wizObjectMode
      : folderPresentation
        ? "folder"
        : "file";
  const isStampFolder = coverFormat === "folder" && folderCoverVersion === "stamp";
  const folderMotionState: ProjectFolderMotionState = isExpanded
    ? isReturning
      ? "returning"
      : "committed"
    : isFolderPreviewed || annualHoverPreview === edition.id
      ? "preview"
      : "rest";
  const isDeskObject = coverFormat !== "notebook";
  const annualCover = resolveAnnualCover(edition, annualPaletteMode, annualEmbossEnabled);
  const useAnnualCover = coverComparisonMode === "annual"
    && edition.coverStyle === "translucent-annual"
    && Boolean(annualCover)
    && isDeskObject
    && coverFormat === "file";
  const fileCover = edition.id === "wiz-commerce"
    ? wizFileCover
    : projectFileCoverVariants[edition.id] || wizFileCoverVariants.oxblood;
  const bookStyle = {
    ...getBookStyle(edition),
    ...(coverFormat === "folder"
      ? {
        "--project-folder-deep": fileCover.deepTint,
        "--project-folder-ink": fileCover.ink,
        "--project-folder-tint": fileCover.tint,
      }
      : {}),
  } as CSSProperties;

  return (
    <button
      className={`book-object${isSlotted ? " is-notebook-slot-cover" : ""}`}
      data-cover-format={coverFormat}
      data-cover-style={useAnnualCover ? "annual" : "original"}
      data-browse-mode={browseMode ? "true" : undefined}
      data-folder-version={coverFormat === "folder" ? folderCoverVersion : undefined}
      data-hover-preview={folderMotionState === "preview" ? "true" : undefined}
      data-format={edition.format || "portrait"}
      data-object-kind={edition.id === "notebook" ? "sketchbook" : "case-study"}
      data-project={edition.id}
      aria-haspopup={edition.id === "notebook" ? undefined : "dialog"}
      aria-expanded={isExpanded}
      aria-current={browseMode && browseActive ? "true" : undefined}
      aria-label={`Open ${card?.title || edition.coverTitle}`}
      tabIndex={browseMode && !browseActive ? -1 : undefined}
      onBlur={(event) => {
        if (!isStampFolder) return;
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
        setIsFolderPreviewed(false);
      }}
      onClick={(event) => {
        if (isStampFolder && !reducedMotion) setIsFolderPreviewed(true);
        openSlip(event.currentTarget);
      }}
      onFocus={() => {
        if (isStampFolder && !reducedMotion) setIsFolderPreviewed(true);
      }}
      onPointerEnter={(event) => {
        if (isStampFolder && !reducedMotion && event.pointerType !== "touch") {
          setIsFolderPreviewed(true);
        }
      }}
      onPointerLeave={() => {
        if (isStampFolder && !isExpanded) setIsFolderPreviewed(false);
      }}
      style={bookStyle}
      type="button"
    >
      {useAnnualCover && annualCover ? (
        <AnnualReportCover
          config={annualCover}
          descriptor={edition.coverLine}
          number={edition.number}
          projectId={edition.id}
        />
      ) : edition.id === "notebook" ? (
        <NotebookCover className="notebook-desk-cover" ariaHidden />
      ) : coverFormat === "folder" && folderPresentation ? (
        folderCoverVersion === "stamp" ? (
          <ProjectFolderCover
            deepTint={fileCover.deepTint}
            ink={fileCover.ink}
            motionState={folderMotionState}
            number={edition.number}
            presentation={folderPresentation}
            reducedMotion={reducedMotion}
            tint={fileCover.tint}
          />
        ) : (
          <LegacyProjectFolderCover
            artifacts={folderPresentation.legacyArtifacts}
            deepTint={fileCover.deepTint}
            ink={fileCover.ink}
            number={edition.number}
            owner={folderPresentation.owner}
            reducedMotion={reducedMotion}
            subtitle={folderPresentation.subtitle}
            tint={fileCover.tint}
          />
        )
      ) : edition.id === "wiz-commerce" ? (
        isExpanded
          ? null
          : wizObjectMode === "notebook"
            ? <WizCommerceNotebook />
            : <CaseStudyDeskFile cover={fileCover} edition={edition} />
      ) : (
        <CaseStudyDeskFile cover={fileCover} edition={edition} />
      )}
      {edition.id === "notebook" ? (
        <span className="book-open-label" aria-hidden="true">
          Open book <ArrowUpRightIcon size={12} weight="regular" />
        </span>
      ) : null}
    </button>
  );
}

export default function App() {
  const paperRef = useRef<HTMLElement | null>(null);
  const notebookTableRef = useRef<HTMLDivElement | null>(null);
  const slipRef = useRef<HTMLElement | null>(null);
  const notebookViewportRef = useRef<{
    left: number;
    previousScrollBehavior: string;
    top: number;
  } | null>(null);
  const [visualWorld, setVisualWorld] = useState<VisualWorldId>(getInitialVisualWorld);
  const activeWorld = visualWorlds.find((world) => world.id === visualWorld) || visualWorlds[0];
  const activeMatId: MatPaletteId = activeWorld.mat;
  const matHasShadow = true;
  const matHasVignette = false;
  const [coverComparisonMode] = useState<CoverComparisonMode>(getInitialCoverComparisonMode);
  const [annualPaletteMode] = useState<AnnualPaletteMode>(getInitialAnnualPaletteMode);
  const [annualEmbossEnabled] = useState(getInitialAnnualEmbossEnabled);
  const [annualHoverPreview] = useState<ProjectId | null>(getInitialAnnualHoverPreview);
  const [folderCoverVersion] = useState<FolderCoverVersion>(getInitialFolderCoverVersion);
  const [projectViewMode, setProjectViewMode] = useState<ProjectViewMode>(getInitialProjectViewMode);
  const [inlineNotebookOpen, setInlineNotebookOpen] = useState(false);
  const [playOpen, setPlayOpen] = useState(() => new URLSearchParams(window.location.search).get("page") === "play");
  const reducedMotion = useReducedMotion();

  const openPlay = useCallback(() => {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("page", "play");
    nextUrl.hash = "";
    window.history.pushState({ ...window.history.state, play: true }, "", nextUrl);
    window.scrollTo({ top: 0, behavior: "auto" });
    setPlayOpen(true);
  }, []);

  const closePlay = useCallback((hash?: string) => {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete("page");
    if (hash) nextUrl.hash = hash;
    window.history.replaceState({ ...window.history.state, play: false }, "", nextUrl);
    window.scrollTo({ top: 0, behavior: "auto" });
    setPlayOpen(false);
    if (hash) {
      window.requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: "auto", block: "start" }));
    }
  }, []);

  useEffect(() => {
    const syncPage = () => setPlayOpen(new URLSearchParams(window.location.search).get("page") === "play");
    window.addEventListener("popstate", syncPage);
    return () => window.removeEventListener("popstate", syncPage);
  }, []);
  const { activeProject, closeSlip, finishClose, focusSlip, openSlip, slipEntryTransform, slipState } = useSlip({
    paperRef,
    slipRef,
    reducedMotion,
  });
  const activeMat = matPalettes.find((palette) => palette.id === activeMatId) || matPalettes[0];
  const wizFileCover = wizFileCoverByMat[activeMatId];
  const notebookEdition = bookEditions.find((edition) => edition.id === "notebook");
  const activeEdition = bookEditions.find((edition) => edition.id === activeProject);
  const activeFileCover = activeProject === "wiz-commerce"
    ? wizFileCover
    : projectFileCoverVariants[activeProject || "wiz-commerce"] || wizFileCoverVariants.oxblood;
  const matStyle = {
    "--studio-table": activeMat.color,
    "--studio-mat": activeMat.color,
    "--studio-mat-ink": activeMat.line,
    "--studio-mat-major": activeMat.major,
    "--studio-mat-minor": activeMat.minor,
    "--studio-mat-black": activeMat.tag,
  } as CSSProperties;

  const preserveNotebookViewport = useCallback(() => {
    const root = document.documentElement;
    notebookViewportRef.current = {
      left: window.scrollX,
      previousScrollBehavior: root.style.scrollBehavior,
      top: window.scrollY,
    };
    root.style.scrollBehavior = "auto";
  }, []);

  useLayoutEffect(() => {
    const viewport = notebookViewportRef.current;
    if (!viewport) return;

    window.scrollTo({ left: viewport.left, top: viewport.top, behavior: "auto" });
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ left: viewport.left, top: viewport.top, behavior: "auto" });
      if (viewport.previousScrollBehavior) {
        document.documentElement.style.scrollBehavior = viewport.previousScrollBehavior;
      } else {
        document.documentElement.style.removeProperty("scroll-behavior");
      }
      notebookViewportRef.current = null;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [inlineNotebookOpen]);

  const closeInlineNotebook = useCallback((fromHistory = false) => {
    preserveNotebookViewport();
    setInlineNotebookOpen(false);
    if (!fromHistory && window.location.hash === "#notebook") {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.hash = "";
      window.history.replaceState(null, "", cleanUrl.href);
    }
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('.book-object[data-project="notebook"]')?.focus({ preventScroll: true });
    });
  }, [preserveNotebookViewport]);

  const openDeskObject = useCallback(
    (card: HTMLElement, pushState = true) => {
      if (card.dataset.project === "notebook") {
        preserveNotebookViewport();
        setInlineNotebookOpen(true);
        if (pushState) window.history.pushState({ inlineNotebook: true }, "", "#notebook");
        return;
      }
      setInlineNotebookOpen(false);
      openSlip(card, pushState);
    },
    [openSlip, preserveNotebookViewport],
  );

  const openScrollProject = useCallback((id: ProjectId) => {
    const card = document.querySelector<HTMLElement>(
      `.project-scroll-library .book-object[data-project="${id}"]`,
    );
    if (card) openDeskObject(card);
  }, [openDeskObject]);

  const changeProjectViewMode = useCallback((mode: ProjectViewMode) => {
    setProjectViewMode(mode);
    const nextUrl = new URL(window.location.href);
    if (mode === "archive") nextUrl.searchParams.delete("project-view");
    else nextUrl.searchParams.set("project-view", mode);
    window.history.replaceState(window.history.state, "", nextUrl);
  }, []);

  const cycleVisualWorld = useCallback(() => {
    setVisualWorld((current) => {
      const currentIndex = visualWorlds.findIndex((world) => world.id === current);
      const next = visualWorlds[(currentIndex + 1) % visualWorlds.length];
      try {
        window.localStorage.setItem("parosayshi:visual-world", next.id);
      } catch {
        // Persistence is a convenience; the visual control remains usable without it.
      }
      return next.id;
    });
  }, []);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!isProjectId(id)) return;
    const frame = window.requestAnimationFrame(() => {
      const book = document.querySelector<HTMLElement>(`[data-project="${id}"]`);
      if (book) openDeskObject(book, false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openDeskObject]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && inlineNotebookOpen) closeInlineNotebook();
    };
    const onPopState = () => {
      if (window.location.hash === "#notebook") setInlineNotebookOpen(true);
      else if (inlineNotebookOpen) closeInlineNotebook(true);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
    };
  }, [closeInlineNotebook, inlineNotebookOpen]);

  if (playOpen) {
    return (
      <>
        <SpotlightCursor reducedMotion={Boolean(reducedMotion)} />
        <PlayPage onClose={closePlay} />
      </>
    );
  }

  return (
    <LayoutGroup id="portfolio-books">
      <SpotlightCursor reducedMotion={Boolean(reducedMotion)} />
      <main
        aria-hidden={slipState !== "closed" ? true : undefined}
        className={`folio-scene${projectViewMode === "archive" ? " archive-garden-scene" : ""}`}
        data-cover-emboss={annualEmbossEnabled ? "on" : "off"}
        data-cover-palette={annualPaletteMode}
        data-cover-system={coverComparisonMode}
        data-mat-shadow={matHasShadow}
        data-project-view={projectViewMode}
        data-visual-world={visualWorld}
        inert={slipState !== "closed" ? true : undefined}
        style={matStyle}
      >
        {projectViewMode === "archive" ? (
          <>
            <InvoiceFolioHome
              onOpenPlay={openPlay}
              reducedMotion={Boolean(reducedMotion)}
            />
            {inlineNotebookOpen ? (
              <div aria-label="Field notes" aria-modal="true" className="archive-garden-notebook" role="dialog">
                <div className="inline-notebook-reader">
                  <Sketchbook autoOpen onClose={() => closeInlineNotebook()} variant="expanded" />
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <>
        <button
          aria-label={`Change visual world. Current world: ${activeWorld.label}`}
          className="visual-world-switcher"
          onClick={cycleVisualWorld}
          type="button"
        >
          <PaintBrushBroadIcon aria-hidden="true" size={15} weight="regular" />
          <span className="visual-world-switcher__label">{activeWorld.label}</span>
          <span className="visual-world-switcher__note">{activeWorld.note}</span>
        </button>

        <nav aria-label="Project presentation" className="project-view-toggle">
          <span>VIEW</span>
          {([
            ["current", "FOLDERS"],
            ["scroll", "SCROLL"],
            ["board", "BOARD"],
          ] as const).map(([mode, label]) => (
            <button
              aria-pressed={projectViewMode === mode}
              key={mode}
              onClick={() => changeProjectViewMode(mode)}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>

        <section className="book-table" aria-labelledby="library-title">
          <section className="publication-cover" ref={paperRef}>
            <div className="publication-cover__masthead">
              <span>PARTH JHA / PRODUCT DESIGNER</span>
              <span>AN IRREGULAR PUBLICATION</span>
              <span>ISSUE 01 / 2026</span>
            </div>

            <h1 className="publication-cover__title" id="library-title" aria-label="Paro Says Hi">
              <span>PARO</span>
              <span>SAYS</span>
              <span>HI</span>
            </h1>

            <motion.figure
              animate={{ opacity: 1, rotate: -3, scale: 1, y: 0 }}
              className="publication-cover__portrait"
              initial={reducedMotion ? false : { opacity: 0, rotate: 4, scale: 0.9, y: 70 }}
              transition={reducedMotion ? { duration: 0 } : { delay: 0.14, duration: 0.72, ease: [0.22, 0.72, 0.2, 1] }}
            >
              <img
                alt="Parth Jha laughing with a very friendly dog"
                src="/assets/new/hero.png"
              />
              <figcaption>PORTRAIT WITH COLLABORATOR / BANGALORE</figcaption>
            </motion.figure>

            <p className="publication-cover__manifesto">
              Making products, making evidence, and occasionally making a mess.
            </p>

            <div className="publication-cover__footnote" aria-hidden="true">
              <span>PRODUCTS</span>
              <span>SYSTEMS</span>
              <span>FIELD NOTES</span>
              <span>ODD JOBS</span>
            </div>

            <a className="publication-cover__enter" href="#contents">
              Open contents <span aria-hidden="true">↓</span>
            </a>
          </section>

          <div className="folio-scroll-ping" aria-hidden="true">
            <span>SCROLL</span>
            <i />
          </div>

          <div className="book-layer" aria-label="Case-study folders">
            {projectViewMode === "current" ? (
              <>
                <header className="publication-contents" id="contents">
                  <div className="publication-contents__meta">
                    <span>CONTENTS / ISSUE 01</span>
                    <span>8 STORIES + 1 NOTEBOOK</span>
                  </div>
                  <h2>Products have backstories.</h2>
                  <p>
                    Finished work, unfinished thinking, and the decisions hiding between them.
                  </p>
                </header>

                <div className="publication-issue-grid">
                  {bookEditions
                    .filter((edition) => edition.id !== "notebook")
                    .sort((a, b) => a.number.localeCompare(b.number))
                    .map((edition, index) => (
                    <button
                      aria-label={`Open issue ${edition.number}: ${edition.coverTitle}`}
                      className="publication-issue-card"
                      data-project={edition.id}
                      data-size={index === 0 || index === 3 ? "feature" : "standard"}
                      key={edition.id}
                      onClick={(event) => openDeskObject(event.currentTarget)}
                      style={{
                        "--issue-accent": edition.accent,
                        "--issue-cover": edition.cover,
                        "--issue-ink": edition.ink,
                      } as CSSProperties}
                      type="button"
                    >
                      <span className="publication-issue-card__meta">
                        <b>ISSUE {edition.number}</b>
                        <span>CASE STUDY / {index + 1} OF {bookEditions.length - 1}</span>
                      </span>
                      <span className="publication-issue-card__visual">
                        <img alt="" src={edition.image} />
                        <i aria-hidden="true">{edition.number}</i>
                      </span>
                      <span className="publication-issue-card__copy">
                        <strong>{edition.coverTitle}</strong>
                        <span>{edition.coverLine}</span>
                      </span>
                      <span className="publication-issue-card__open" aria-hidden="true">
                        READ <ArrowUpRightIcon size={17} weight="bold" />
                      </span>
                    </button>
                    ))}
                </div>
              </>
            ) : projectViewMode === "scroll" ? (
              <ProjectScrollLibrary
                items={scrollLibraryItems}
                onOpenItem={openScrollProject}
                reducedMotion={Boolean(reducedMotion)}
                renderBook={(item, state) => {
                  const edition = bookEditions.find((candidate) => candidate.id === item.id);
                  if (!edition) return null;
                  return (
                    <BookObject
                      annualEmbossEnabled={annualEmbossEnabled}
                      annualHoverPreview={annualHoverPreview}
                      annualPaletteMode={annualPaletteMode}
                      browseActive={state.isShelf || state.isActive}
                      browseMode
                      coverComparisonMode={coverComparisonMode}
                      edition={edition}
                      folderCoverVersion={folderCoverVersion}
                      isExpanded={activeProject === edition.id && slipState !== "closed"}
                      isReturning={activeProject === edition.id && slipState === "closing"}
                      openSlip={() => state.activate()}
                      reducedMotion={Boolean(reducedMotion)}
                      wizFileCover={wizFileCover}
                      wizObjectMode="file"
                    />
                  );
                }}
              />
            ) : (
              <ProjectBoardLibrary
                activeProject={activeProject}
                items={boardLibraryItems}
                onOpenItem={(_, trigger) => openDeskObject(trigger)}
              />
            )}
            <div className="notebook-table-surface" ref={notebookTableRef}>
              <SunlightShader active={matHasShadow} reducedMotion={reducedMotion} />
              <div className="mat-edge-vignette" data-active={matHasVignette} aria-hidden="true" />
              <TableStickerLayer
                containerRef={notebookTableRef}
                disabled={slipState !== "closed" || inlineNotebookOpen}
                reducedMotion={Boolean(reducedMotion)}
              />
              {notebookEdition ? (
                <div
                  className={`notebook-inline-slot${inlineNotebookOpen ? " is-open" : ""}`}
                  style={getBookStyle(notebookEdition)}
                >
                  <BookObject
                    annualEmbossEnabled={annualEmbossEnabled}
                    annualHoverPreview={annualHoverPreview}
                    annualPaletteMode={annualPaletteMode}
                    coverComparisonMode={coverComparisonMode}
                    edition={notebookEdition}
                    isExpanded={inlineNotebookOpen}
                    isSlotted
                    openSlip={openDeskObject}
                    reducedMotion={Boolean(reducedMotion)}
                  />
                  {inlineNotebookOpen ? (
                    <div className="inline-notebook-reader">
                      <Sketchbook autoOpen onClose={() => closeInlineNotebook()} variant="expanded" />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <EmbroideredFooter reducedMotion={reducedMotion} />
          </>
        )}
      </main>

      {slipState !== "closed" && activeProject ? (
        <div className="slip-overlay">
          <CaseStudyReader
              entryColors={{
                deep: activeFileCover.deepTint,
                ink: activeFileCover.ink,
                tint: activeFileCover.tint,
              }}
              entryShape="folder"
              entryTransform={slipEntryTransform}
              ref={slipRef}
              project={projects[activeProject]}
              caseNumber={activeEdition?.number || "00"}
              coverImage={activeEdition?.image || activeEdition?.coverArt || ""}
              coverLine={activeEdition?.coverLine || "A product design case study"}
              onClose={() => closeSlip()}
              onOpenAnimationComplete={focusSlip}
              reducedMotion={reducedMotion}
              slipState={slipState}
              onCloseAnimationComplete={finishClose}
            />
        </div>
      ) : null}
    </LayoutGroup>
  );
}
