import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { LayoutGroup, motion } from "motion/react";
import {
  AnnualReportCover,
  type AnnualCoverConfig,
  type AnnualCoverPalette,
  type AnnualCoverStructure,
} from "./components/AnnualReportCover";
import { ProjectFolderCover, type ProjectFolderArtifact } from "./components/ProjectFolderCover";
import { NotebookCover, Sketchbook } from "./components/Sketchbook";
import { SunlightShader } from "./components/SunlightShader";
import { CaseStudyReader } from "./components/WizCommerceReader";
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
    label: "Studio green",
    color: "#0d5d45",
    line: "rgb(255 235 171 / 0.84)",
    major: "rgb(255 235 171 / 0.46)",
    minor: "rgb(255 235 171 / 0.14)",
    tag: "#19372b",
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

interface ProjectFolderPresentation {
  artifacts: [ProjectFolderArtifact, ProjectFolderArtifact, ProjectFolderArtifact];
  owner: string;
  subtitle: string;
}

const projectFolderPresentations: Partial<Record<ProjectId, ProjectFolderPresentation>> = {
  "wiz-commerce": {
    owner: "WIZCOMMERCE",
    subtitle: "PRODUCT SYSTEM / 2024",
    artifacts: [
      { label: "WIZPAY / TRANSACTIONS", position: "center 34%", src: "/assets/new/wizcommerce-frame32/uploads/wizpay-responsive-transactions.png" },
      { label: "WIZAI / ASSISTANT", position: "center 38%", src: "/assets/new/wizcommerce-frame32/uploads/wizai-product-assistant.png" },
      { label: "SYSTEM / OVERVIEW", position: "center", src: "/assets/new/wizcommerce-frame32/visuals-grid-111.png" },
    ],
  },
  "uber-kids": {
    owner: "UBER KIDS",
    subtitle: "SAFETY SYSTEM / 2025",
    artifacts: [
      { label: "INVITE / ONBOARDING", position: "center", src: "/assets/new/uber-kids/invite-hero.png" },
      { label: "PLACES / BENGALURU", position: "center", src: "/assets/new/uber-kids/map-bengaluru.png" },
      { label: "SAFETY / FLOW", position: "center", src: "/assets/new/uber-kids-lead.svg" },
    ],
  },
  "wiz-sales-data": {
    owner: "WIZ SALES DATA",
    subtitle: "SALES TOOLS / 2024",
    artifacts: [
      { label: "PRODUCT / LISTING", position: "center", src: "/assets/case-studies/f2MFjaGV3u8MAIXdzRO9fHE2wc.png" },
      { label: "CARDS / BEFORE-AFTER", position: "center", src: "/assets/case-studies/mjRUy3TMmhpKrNoGXxSz8YAttg0.png" },
      { label: "DATA / VISIBILITY", position: "center", src: "/assets/case-studies/D14InoE2s4mg8mig0KcPU2ECg.png" },
    ],
  },
  "wiz-email-flows": {
    owner: "WIZ EMAIL FLOWS",
    subtitle: "COMMUNICATION / 2024",
    artifacts: [
      { label: "JOURNEY / AUTOMATION", position: "center", src: "/assets/case-studies/7pNOxoU2UIQLghgLPRTMAgwU1AE.png" },
      { label: "INPUT / METHOD", position: "center", src: "/assets/case-studies/75yucgvtB4hxLkV9N4mgK74PSQ.png" },
      { label: "TOUCHPOINTS / FLOW", position: "center", src: "/assets/case-studies/6BIBiTr3GZQDFXe6IvdilhHDs.png" },
    ],
  },
  farevv: {
    owner: "FAREVV",
    subtitle: "FASHION CONCEPT / 2023",
    artifacts: [
      { label: "PRODUCT / FLOW", position: "center", src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png" },
      { label: "DIRECTION / COVER", position: "center", src: "/assets/new/book-covers/farevv-cover.png" },
      { label: "COMMERCE / IDENTITY", position: "right center", src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png" },
    ],
  },
  kriyadex: {
    owner: "KRIYADEX",
    subtitle: "BRAND + MVP / 2023",
    artifacts: [
      { label: "IDENTITY / MARK", position: "center", src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png" },
      { label: "BRAND / COVER", position: "center", src: "/assets/new/book-covers/kriyadex-cover.png" },
      { label: "MVP / SYSTEM", position: "left center", src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png" },
    ],
  },
  curo: {
    owner: "CURO",
    subtitle: "LEARNING MVP / 2024",
    artifacts: [
      { label: "RESOURCES / DISCOVERY", position: "center", src: "/assets/lREVKnbZDxTdgCdlTMAcEQXvxE.png" },
      { label: "PATH / GENERATIVE AI", position: "center", src: "/assets/QZDLAFRGxs00xycurq0DyWxc.png" },
      { label: "MVP / COVER", position: "center", src: "/assets/new/book-covers/curo-cover.png" },
    ],
  },
};

type MatPaletteId = (typeof matPalettes)[number]["id"];
type WizFileCoverVariant = (typeof wizFileCoverVariants)[keyof typeof wizFileCoverVariants];

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
    id: "wiz-commerce",
    number: "01",
    coverTitle: "WizCommerce",
    coverLine: "Designing the operating layer for wholesale",
    coverArt: "/assets/new/book-covers/wiz-commerce-cover.png",
    coverArtScale: "1.13",
    image: "/assets/new/wizcommerce-frame32/uploads/wizpay-responsive-transactions.png",
    x: "calc(50% - min(390px, 31vw) - 260px)",
    y: "960px",
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
    y: "1300px",
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
    y: "1850px",
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
    y: "2190px",
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
    y: "4550px",
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
    y: "2740px",
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
    y: "3070px",
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
    y: "3620px",
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
  coverComparisonMode,
  edition,
  isExpanded,
  isSlotted = false,
  openSlip,
  reducedMotion,
  wizFileCover = wizFileCoverVariants.emerald,
  wizObjectMode = "file",
}: {
  annualEmbossEnabled: boolean;
  annualHoverPreview: ProjectId | null;
  annualPaletteMode: AnnualPaletteMode;
  coverComparisonMode: CoverComparisonMode;
  edition: BookEdition;
  isExpanded: boolean;
  isSlotted?: boolean;
  openSlip: (card: HTMLElement) => void;
  reducedMotion: boolean;
  wizFileCover?: WizFileCoverVariant;
  wizObjectMode?: WizObjectMode;
}) {
  const card = cardById.get(edition.id);
  const folderPresentation = projectFolderPresentations[edition.id];
  const coverFormat = edition.id === "notebook"
    ? "notebook"
    : edition.id === "wiz-commerce"
      ? wizObjectMode
      : folderPresentation
        ? "folder"
        : "file";
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
      data-hover-preview={annualHoverPreview === edition.id ? "true" : undefined}
      data-format={edition.format || "portrait"}
      data-object-kind={edition.id === "notebook" ? "sketchbook" : "case-study"}
      data-project={edition.id}
      aria-haspopup={edition.id === "notebook" ? undefined : "dialog"}
      aria-expanded={isExpanded}
      aria-label={`Open ${card?.title || edition.coverTitle}`}
      onClick={(event) => openSlip(event.currentTarget)}
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
        <ProjectFolderCover
          artifacts={folderPresentation.artifacts}
          deepTint={fileCover.deepTint}
          ink={fileCover.ink}
          number={edition.number}
          owner={folderPresentation.owner}
          reducedMotion={reducedMotion}
          subtitle={folderPresentation.subtitle}
          tint={fileCover.tint}
        />
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
  const slipRef = useRef<HTMLElement | null>(null);
  const notebookViewportRef = useRef<{
    left: number;
    previousScrollBehavior: string;
    top: number;
  } | null>(null);
  const activeMatId: MatPaletteId = "dark-green";
  const matHasShadow = true;
  const matHasVignette = false;
  const wizObjectMode: WizObjectMode = "folder";
  const [coverComparisonMode] = useState<CoverComparisonMode>(getInitialCoverComparisonMode);
  const [annualPaletteMode] = useState<AnnualPaletteMode>(getInitialAnnualPaletteMode);
  const [annualEmbossEnabled] = useState(getInitialAnnualEmbossEnabled);
  const [annualHoverPreview] = useState<ProjectId | null>(getInitialAnnualHoverPreview);
  const [inlineNotebookOpen, setInlineNotebookOpen] = useState(false);
  const reducedMotion = useReducedMotion();
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

  return (
    <LayoutGroup id="portfolio-books">
      <main
        aria-hidden={slipState !== "closed" ? true : undefined}
        className="folio-scene"
        data-cover-emboss={annualEmbossEnabled ? "on" : "off"}
        data-cover-palette={annualPaletteMode}
        data-cover-system={coverComparisonMode}
        data-mat-shadow={matHasShadow}
        inert={slipState !== "closed" ? true : undefined}
        style={matStyle}
      >
        <SunlightShader active={matHasShadow} reducedMotion={reducedMotion} />
        <div className="mat-edge-vignette" data-active={matHasVignette} aria-hidden="true" />

        <header className="studio-header">
          <a className="holo-brand-sticker" href="/" aria-label="Parosayshi home">
            <img src="/assets/new/parosayshi-wordmark.svg" alt="Parosayshi" />
          </a>
          <nav aria-label="Portfolio links">
            <a href="https://drive.google.com/file/d/1t2szuLpJstQ-ktsZ5rvWYJ8svIZWmhT2/view?usp=sharing" target="_blank" rel="noopener noreferrer">
              RESUME <ArrowUpRightIcon aria-hidden="true" size={12} weight="regular" />
            </a>
            <a href="mailto:hello@parosayshi.com">
              SAY HELLO <ArrowUpRightIcon aria-hidden="true" size={12} weight="regular" />
            </a>
          </nav>
        </header>

        {/*
          Presentation controls are parked for now. The fixed composition keeps:
          - Studio green cutting mat
          - Shade on
          - Edge vignette off

          <div className="mat-switcher" aria-label="Cutting mat color">
            <span>MAT</span>
            {matPalettes.map((palette) => (
              <button
                key={palette.id}
                aria-label={`Use ${palette.label} mat`}
                aria-pressed={palette.id === activeMatId}
                onClick={() => setActiveMatId(palette.id)}
                style={{ "--swatch-color": palette.color } as CSSProperties}
                type="button"
              />
            ))}
            <button
              aria-label={matHasShadow ? "Turn mat shadows off" : "Turn mat shadows on"}
              aria-pressed={matHasShadow}
              className="mat-shadow-toggle"
              onClick={() => setMatHasShadow((current) => !current)}
              type="button"
            >
              SHADE
            </button>
            <button
              aria-label={matHasVignette ? "Turn edge vignette off" : "Turn edge vignette on"}
              aria-pressed={matHasVignette}
              className="mat-shadow-toggle mat-vignette-toggle"
              onClick={() => setMatHasVignette((current) => !current)}
              type="button"
            >
              EDGE
            </button>
          </div>

          The FILE / FOLDER / NOTEBOOK comparison is also parked. Folder remains
          the fixed cover format for every case study.

          <div className="object-switcher" aria-label="WizCommerce cover style">
            <span>WIZ</span>
            <button onClick={() => setWizObjectMode("file")} type="button">FILE</button>
            <button aria-pressed type="button">FOLDER</button>
            <button onClick={() => setWizObjectMode("notebook")} type="button">NOTEBOOK</button>
          </div>
        */}

        <section className="book-table" aria-labelledby="library-title">
          <div className="folio-fold-stage">
            <span className="folio-flight-shadow" aria-hidden="true" />
            <motion.article
              animate={{
                opacity: 1,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                x: 0,
                y: 0,
              }}
              className="folio-sheet"
              initial={reducedMotion ? false : {
                opacity: 0,
                rotateX: 17,
                rotateY: -11,
                rotateZ: 4,
                scale: 0.945,
                x: 96,
                y: -168,
              }}
              ref={paperRef}
              transition={reducedMotion ? { duration: 0 } : {
                opacity: { duration: 0.38, ease: "easeOut" },
                rotateX: { type: "spring", stiffness: 54, damping: 14, mass: 1.1 },
                rotateY: { type: "spring", stiffness: 58, damping: 15, mass: 1.05 },
                rotateZ: { type: "spring", stiffness: 60, damping: 15, mass: 1 },
                scale: { type: "spring", stiffness: 62, damping: 15, mass: 1.05 },
                x: { type: "spring", stiffness: 58, damping: 14, mass: 1.05 },
                y: { type: "spring", stiffness: 54, damping: 13, mass: 1.05 },
              }}
            >
              <div className="sheet-kicker">
                <span>PARTH JHA / PRODUCT DESIGNER</span>
                <span>INDIA — 2026</span>
              </div>
              <h1 id="library-title">“I will keep designing for fun even in this economy”</h1>
              <p className="sheet-byline">
                says Parth Jha, an AI optimist who believes <strong>intentmaxxxing</strong> is the solution.
              </p>
              <div className="sheet-columns">
                <p>
                  A <strong>technical product designer</strong> wanting to make sense to himself goes all out on
                  platforms like i ask, i explore, i tinker—designing to make technology feel more human.
                </p>
                <p>
                  Product strategy, systems thinking, slightly obsessive prototyping, and a few notes from the margins.
                  Pick up a book to read the full story.
                </p>
              </div>
              <div className="sheet-colophon">
                <span>CURRENTLY AT<br />[@AIRTRIBE]</span>
                <span>SYSTEMS THINKING<br />PROTOTYPING + PLAY</span>
                <span>HELLO@PAROSAYSHI.COM</span>
              </div>
            </motion.article>
          </div>

          <div className="book-layer" aria-label="Case-study books">
            {bookEditions.filter((edition) => edition.id !== "notebook").map((edition) => (
              <BookObject
                annualEmbossEnabled={annualEmbossEnabled}
                annualHoverPreview={annualHoverPreview}
                annualPaletteMode={annualPaletteMode}
                coverComparisonMode={coverComparisonMode}
                edition={edition}
                isExpanded={activeProject === edition.id && slipState !== "closed"}
                key={edition.id}
                openSlip={openDeskObject}
                reducedMotion={Boolean(reducedMotion)}
                wizFileCover={wizFileCover}
                wizObjectMode={wizObjectMode}
              />
            ))}
            <div className="notebook-library-heading">
              <span>FIELD NOTES / ONGOING</span>
              <h2>Things that stayed in the notebook.</h2>
            </div>
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
        </section>

        <footer className="studio-footer">
          <span>THE LIBRARY WILL KEEP CHANGING.</span>
          <span>© 2026 PAROSAYSHI</span>
        </footer>
      </main>

      {slipState !== "closed" && activeProject ? (
        <div className="slip-overlay">
          <CaseStudyReader
              bookmarks={activeProject === "wiz-commerce"}
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
