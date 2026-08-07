import type { ReactNode } from "react";
import type { ProjectId } from "../types/project";

export interface WorkCardData {
  id: ProjectId;
  edition: "Case file" | "Dispatch" | "Field note" | "Prototype" | "Margin note";
  title: string;
  image: string;
  alt: string;
  body: ReactNode;
  tilt: number;
}

export const workCards: WorkCardData[] = [
  {
    id: "periodic-table",
    edition: "Prototype",
    title: "Periodic Table",
    image: "/assets/periodic-table-specimen.svg",
    alt: "Interactive periodic table prototype",
    body: "A small reference tool designed to make dense chemistry information feel browseable.",
    tilt: -0.7,
  },
  {
    id: "wiz-commerce",
    edition: "Case file",
    title: "WizCommerce product touchpoints",
    image: "/assets/new/wizcommerce-frame32/hero-dashboard.png",
    alt: "WizCommerce product touchpoints and dashboard surfaces",
    body: (
      <>
        An overview of products and systems designed while scaling WizCommerce to <strong>+$1.3M ARR</strong>.
      </>
    ),
    tilt: -1.8,
  },
  {
    id: "wiz-sales-data",
    edition: "Dispatch",
    title: "Helping sales reps make better decisions with data",
    image: "/assets/case-studies/f2MFjaGV3u8MAIXdzRO9fHE2wc.png",
    alt: "WizCommerce sales data case study cover",
    body: "Simplifying B2B product cards and recommendations to surface decision-critical data for sales reps.",
    tilt: 0.9,
  },
  {
    id: "wiz-email-flows",
    edition: "Field note",
    title: "Anything and everything about automating emails",
    image: "/assets/case-studies/7pNOxoU2UIQLghgLPRTMAgwU1AE.png",
    alt: "WizCommerce email automation case study cover",
    body: "Improving the existing methods and building a scalable org-wide system for handeling emails.",
    tilt: -1.1,
  },
  {
    id: "uber-kids",
    edition: "Case file",
    title: "Designing a safer Uber Kids onboarding",
    image: "/assets/new/uber-kids/invite-hero.png",
    alt: "Uber Kids child entering a ride illustration",
    body: "A child-facing onboarding flow around parent approvals, trusted places, safety codes, and fast help.",
    tilt: 0.7,
  },
  {
    id: "kriyadex",
    edition: "Dispatch",
    title: "KriyaDex",
    image: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png",
    alt: "KriyaDex brand mark",
    body: (
      <>
        <strong>Freelance</strong>
        <br />
        Logo design
        <br />
        Branding
      </>
    ),
    tilt: 1.2,
  },
  {
    id: "farevv",
    edition: "Margin note",
    title: "Farevv.",
    image: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png",
    alt: "Farevv fashion product exploration",
    body: <strong>Anti-portfolio</strong>,
    tilt: -0.8,
  },
  {
    id: "curo",
    edition: "Prototype",
    title: "Curo.",
    image: "/assets/lREVKnbZDxTdgCdlTMAcEQXvxE.png",
    alt: "Curo learning resources interface",
    body: <strong>MVP in progress</strong>,
    tilt: 1.6,
  },
];
