import type { ProjectId } from "../types/project";

export interface HomeProject {
  id: ProjectId;
  title: string;
  eyebrow: string;
  description: string;
  year: string;
  image: string;
  hoverImage?: string;
  alt: string;
  layout: "wide" | "tall" | "standard";
  tone: "cobalt" | "orange" | "ink" | "paper" | "sage";
}

export const homeProjects: HomeProject[] = [
  {
    id: "wiz-commerce",
    title: "WizCommerce",
    eyebrow: "Product systems / B2B commerce",
    description: "Two years spent making dense wholesale software easier to trust, use, and ship.",
    year: "2023—25",
    image: "/assets/new/wizcommerce-frame32/hero-dashboard.png",
    hoverImage: "/assets/new/wizcommerce-frame32/visuals-grid-111.png",
    alt: "WizCommerce product surfaces across payments, ordering, AI, and commerce",
    layout: "wide",
    tone: "paper",
  },
  {
    id: "superr-ai",
    title: "Superr.ai",
    eyebrow: "Technical product design / Edtech",
    description: "Product workflows for a young education company moving unusually fast.",
    year: "2025",
    image: "/assets/invoice-folio/superr-official-logo.svg",
    alt: "Superr.ai hand mark",
    layout: "tall",
    tone: "orange",
  },
  {
    id: "kriyadex",
    title: "KriyaDEX",
    eyebrow: "Identity / Product language",
    description: "A small identity system for a large, technical idea.",
    year: "2024",
    image: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png",
    alt: "KriyaDEX identity mark",
    layout: "standard",
    tone: "ink",
  },
  {
    id: "periodic-table",
    title: "Periodic Table",
    eyebrow: "Interaction prototype / Reference tool",
    description: "A compact interface for wandering through chemistry one element at a time.",
    year: "2024",
    image: "/assets/periodic-table-specimen.svg",
    alt: "Interactive periodic table interface",
    layout: "standard",
    tone: "cobalt",
  },
  {
    id: "curo",
    title: "Curo.",
    eyebrow: "Learning tools / Work in progress",
    description: "A stubborn little experiment in making learning resources feel less institutional.",
    year: "Now",
    image: "/assets/lREVKnbZDxTdgCdlTMAcEQXvxE.png",
    alt: "Curo learning resources interface",
    layout: "wide",
    tone: "sage",
  },
];

export const homeExperiments: HomeProject[] = [
  {
    id: "wiz-email-flows",
    title: "Mailroom manual",
    eyebrow: "Systems note / Email automation",
    description: "The rules, exceptions, and infrastructure behind emails that should feel simple.",
    year: "2024",
    image: "/assets/case-studies/7pNOxoU2UIQLghgLPRTMAgwU1AE.png",
    alt: "WizCommerce email automation workflow",
    layout: "standard",
    tone: "paper",
  },
  {
    id: "uber-kids",
    title: "Small riders, big rules",
    eyebrow: "Product concept / Safety",
    description: "A child-facing onboarding concept built around approvals, trusted places, and help.",
    year: "2025",
    image: "/assets/new/uber-kids/invite-hero.png",
    alt: "Uber Kids onboarding illustration",
    layout: "standard",
    tone: "cobalt",
  },
  {
    id: "farevv",
    title: "Farevv.",
    eyebrow: "Anti-portfolio / Fashion",
    description: "A deliberately unfinished place for visual experiments that refused a case study.",
    year: "Ongoing",
    image: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png",
    alt: "Farevv fashion product exploration",
    layout: "standard",
    tone: "ink",
  },
];
