import type { ProjectId } from "../types/project";

export interface ProjectFolderAsset {
  label: string;
  position?: string;
  src: string;
}

export interface ProjectFolderBoard {
  assets: ProjectFolderAsset[];
  label: string;
}

export interface ProjectFolderPresentation {
  boards: [ProjectFolderBoard, ProjectFolderBoard];
  legacyArtifacts: [ProjectFolderAsset, ProjectFolderAsset, ProjectFolderAsset];
  owner: string;
  revealDirection: "left" | "right";
  subtitle: string;
}

export const projectFolderPresentations: Partial<Record<ProjectId, ProjectFolderPresentation>> = {
  "wiz-commerce": {
    owner: "WIZCOMMERCE",
    subtitle: "PRODUCT SYSTEM / 2024",
    revealDirection: "right",
    boards: [
      {
        label: "SYSTEM / OVERVIEW",
        assets: [
          { label: "System map", src: "/assets/new/wizcommerce-frame32/visuals-grid-111.png" },
          { label: "WizAI", src: "/assets/new/wizcommerce-frame32/uploads/wizai-product-assistant.png" },
          { label: "Modifiers", src: "/assets/new/wizcommerce-frame32/Modifier-intro.png" },
          { label: "Visual system", src: "/assets/new/wizcommerce-frame32/visuals-grid-444.png" },
          { label: "Assistant state", src: "/assets/new/wizcommerce-frame32/uploads/wizai-carousel-2.png" },
          { label: "Configuration", src: "/assets/new/wizcommerce-frame32/modifiers-carousel-mod-1.png" },
        ],
      },
      {
        label: "WIZPAY / FIELD SYSTEM",
        assets: [
          { label: "Transactions", src: "/assets/new/wizcommerce-frame32/uploads/wizpay-responsive-transactions.png" },
          { label: "Dashboard", src: "/assets/new/wizcommerce-frame32/uploads/wizpay-transactions-dashboard.png" },
          { label: "Product surface", src: "/assets/new/wizcommerce-frame32/uploads/wizpay-product-surface.png" },
          { label: "Payment state", src: "/assets/new/wizcommerce-frame32/uploads/wizpay-carousel-1.png" },
          { label: "Mobile flow", src: "/assets/new/wizcommerce-frame32/uploads/wizpay-carousel-3.png" },
          { label: "Field detail", src: "/assets/new/wizcommerce-frame32/uploads/wizpay-carousel-4.png" },
        ],
      },
    ],
    legacyArtifacts: [
      {
        label: "WIZPAY / TRANSACTIONS",
        position: "center 34%",
        src: "/assets/new/wizcommerce-frame32/uploads/wizpay-responsive-transactions.png",
      },
      {
        label: "WIZAI / ASSISTANT",
        position: "center 38%",
        src: "/assets/new/wizcommerce-frame32/uploads/wizai-product-assistant.png",
      },
      {
        label: "SYSTEM / OVERVIEW",
        position: "center",
        src: "/assets/new/wizcommerce-frame32/visuals-grid-111.png",
      },
    ],
  },
  "uber-kids": {
    owner: "UBER KIDS",
    subtitle: "SAFETY SYSTEM / 2025",
    revealDirection: "left",
    boards: [
      {
        label: "PLACES / ROUTES",
        assets: [
          { label: "Bengaluru map", src: "/assets/new/uber-kids/map-bengaluru.png" },
          { label: "Home", src: "/assets/new/uber-kids/place-home.png" },
          { label: "Swimming", src: "/assets/new/uber-kids/place-swimming.png" },
          { label: "Music class", src: "/assets/new/uber-kids/place-music-class.png" },
          { label: "Track", src: "/assets/new/uber-kids/icon-track.png" },
          { label: "Approve", src: "/assets/new/uber-kids/icon-approve.png" },
        ],
      },
      {
        label: "SAFETY / ONBOARDING",
        assets: [
          { label: "Invite", src: "/assets/new/uber-kids/invite-hero.png" },
          { label: "Safety flow", src: "/assets/new/uber-kids-lead.svg" },
          { label: "Pay", src: "/assets/new/uber-kids/icon-pay.png" },
          { label: "Approve", src: "/assets/new/uber-kids/icon-approve.png" },
          { label: "Track", src: "/assets/new/uber-kids/icon-track.png" },
          { label: "Places", src: "/assets/new/uber-kids/map-bengaluru.png" },
        ],
      },
    ],
    legacyArtifacts: [
      {
        label: "INVITE / ONBOARDING",
        position: "center",
        src: "/assets/new/uber-kids/invite-hero.png",
      },
      {
        label: "PLACES / BENGALURU",
        position: "center",
        src: "/assets/new/uber-kids/map-bengaluru.png",
      },
      {
        label: "SAFETY / FLOW",
        position: "center",
        src: "/assets/new/uber-kids-lead.svg",
      },
    ],
  },
  "wiz-sales-data": {
    owner: "WIZ SALES DATA",
    subtitle: "SALES TOOLS / 2024",
    revealDirection: "right",
    boards: [
      {
        label: "PRODUCT / LISTING",
        assets: [
          { label: "Product listing", src: "/assets/case-studies/f2MFjaGV3u8MAIXdzRO9fHE2wc.png" },
          { label: "Before and after", src: "/assets/case-studies/mjRUy3TMmhpKrNoGXxSz8YAttg0.png" },
          { label: "Data visibility", src: "/assets/case-studies/D14InoE2s4mg8mig0KcPU2ECg.png" },
          { label: "Sales surface", src: "/assets/case-studies/YDdrpKIBIJpXs3NXrnDsMyiRCs.png" },
          { label: "Dashboard", src: "/assets/case-studies/SyyORqB93SswjjJG6q71NSLGAcs.png" },
          { label: "Decision view", src: "/assets/case-studies/LITf2qV3BudTI6j9R0EKNZRw8.png" },
        ],
      },
      {
        label: "DATA / DECISIONS",
        assets: [
          { label: "Data state", src: "/assets/case-studies/eA59Pqsg8D5s5ENx5SmSnk9sbs.png" },
          { label: "Sales view", src: "/assets/case-studies/YT4RV61yi2NWptKe5hdAvL2bI.png" },
          { label: "Comparison", src: "/assets/case-studies/62oPsO639ObwEOKMcUfIu9Nw6jo.png" },
          { label: "Detail", src: "/assets/case-studies/td5wQCphnrWbGJsPM0zOLlbQ6k.png" },
          { label: "Summary", src: "/assets/case-studies/DDrRUrz1RWwPMSEbtSSdIf7BT4.png" },
          { label: "Signal", src: "/assets/case-studies/40jiGsguVDmfxdFXalA24RUhd0Y.png" },
        ],
      },
    ],
    legacyArtifacts: [
      {
        label: "PRODUCT / LISTING",
        position: "center",
        src: "/assets/case-studies/f2MFjaGV3u8MAIXdzRO9fHE2wc.png",
      },
      {
        label: "CARDS / BEFORE-AFTER",
        position: "center",
        src: "/assets/case-studies/mjRUy3TMmhpKrNoGXxSz8YAttg0.png",
      },
      {
        label: "DATA / VISIBILITY",
        position: "center",
        src: "/assets/case-studies/D14InoE2s4mg8mig0KcPU2ECg.png",
      },
    ],
  },
  "wiz-email-flows": {
    owner: "WIZ EMAIL FLOWS",
    subtitle: "COMMUNICATION / 2024",
    revealDirection: "left",
    boards: [
      {
        label: "TOUCHPOINTS / FLOW",
        assets: [
          { label: "Journey", src: "/assets/case-studies/7pNOxoU2UIQLghgLPRTMAgwU1AE.png" },
          { label: "Input method", src: "/assets/case-studies/75yucgvtB4hxLkV9N4mgK74PSQ.png" },
          { label: "Touchpoints", src: "/assets/case-studies/6BIBiTr3GZQDFXe6IvdilhHDs.png" },
          { label: "Flow state", src: "/assets/case-studies/Wb0UEhRUMQUIE2mktg9AY8oKdA.png" },
          { label: "Automation", src: "/assets/case-studies/7eYazQ2i9NhdtTZ7KoR6AAvOQ.png" },
          { label: "Communication", src: "/assets/case-studies/ZQai9EjZdtNRPj0E8lLhsRNBHc.png" },
        ],
      },
      {
        label: "METHOD / STATES",
        assets: [
          { label: "State", src: "/assets/case-studies/dP22tW3uwxY8CYZpcevc5GB8RFw.png" },
          { label: "Detail", src: "/assets/case-studies/AaJdbGZvSQV0Bg6XDlr3sQ6JE.png" },
          { label: "Touchpoint", src: "/assets/case-studies/cQoRwvFm4gv6SyYsIev2x6jqBU.png" },
          { label: "Configuration", src: "/assets/case-studies/OsdoaUdcg9xrPe1bWmOcwLqkA9s.png" },
          { label: "Delivery", src: "/assets/case-studies/MvJkiI3jRrOijXFdWXIB4h1Q.png" },
          { label: "Result", src: "/assets/case-studies/2KPskyMzYLiLOMgtBkRAuKR8iDU.png" },
        ],
      },
    ],
    legacyArtifacts: [
      {
        label: "JOURNEY / AUTOMATION",
        position: "center",
        src: "/assets/case-studies/7pNOxoU2UIQLghgLPRTMAgwU1AE.png",
      },
      {
        label: "INPUT / METHOD",
        position: "center",
        src: "/assets/case-studies/75yucgvtB4hxLkV9N4mgK74PSQ.png",
      },
      {
        label: "TOUCHPOINTS / FLOW",
        position: "center",
        src: "/assets/case-studies/6BIBiTr3GZQDFXe6IvdilhHDs.png",
      },
    ],
  },
  farevv: {
    owner: "FAREVV",
    subtitle: "FASHION CONCEPT / 2023",
    revealDirection: "right",
    boards: [
      {
        label: "PRODUCT / FLOW",
        assets: [
          { label: "Flow left", position: "left center", src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png" },
          { label: "Flow center", position: "center", src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png" },
          { label: "Flow right", position: "right center", src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png" },
          { label: "Cover", src: "/assets/new/book-covers/farevv-cover.png" },
        ],
      },
      {
        label: "DIRECTION / IDENTITY",
        assets: [
          { label: "Cover", src: "/assets/new/book-covers/farevv-cover.png" },
          { label: "Direction one", position: "15% center", src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png" },
          { label: "Direction two", position: "50% center", src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png" },
          { label: "Direction three", position: "85% center", src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png" },
        ],
      },
    ],
    legacyArtifacts: [
      {
        label: "PRODUCT / FLOW",
        position: "center",
        src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png",
      },
      {
        label: "DIRECTION / COVER",
        position: "center",
        src: "/assets/new/book-covers/farevv-cover.png",
      },
      {
        label: "COMMERCE / IDENTITY",
        position: "right center",
        src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png",
      },
    ],
  },
  kriyadex: {
    owner: "KRIYADEX",
    subtitle: "BRAND + MVP / 2023",
    revealDirection: "left",
    boards: [
      {
        label: "IDENTITY / MARK",
        assets: [
          { label: "Identity left", position: "left center", src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png" },
          { label: "Identity center", position: "center", src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png" },
          { label: "Identity right", position: "right center", src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png" },
          { label: "Cover", src: "/assets/new/book-covers/kriyadex-cover.png" },
        ],
      },
      {
        label: "BRAND / MVP",
        assets: [
          { label: "Cover", src: "/assets/new/book-covers/kriyadex-cover.png" },
          { label: "System one", position: "12% center", src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png" },
          { label: "System two", position: "50% center", src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png" },
          { label: "System three", position: "88% center", src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png" },
        ],
      },
    ],
    legacyArtifacts: [
      {
        label: "IDENTITY / MARK",
        position: "center",
        src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png",
      },
      {
        label: "BRAND / COVER",
        position: "center",
        src: "/assets/new/book-covers/kriyadex-cover.png",
      },
      {
        label: "MVP / SYSTEM",
        position: "left center",
        src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png",
      },
    ],
  },
  curo: {
    owner: "CURO",
    subtitle: "LEARNING MVP / 2024",
    revealDirection: "right",
    boards: [
      {
        label: "LEARNING / PATHS",
        assets: [
          { label: "Discovery", position: "left center", src: "/assets/lREVKnbZDxTdgCdlTMAcEQXvxE.png" },
          { label: "Learning path", position: "center", src: "/assets/QZDLAFRGxs00xycurq0DyWxc.png" },
          { label: "Discovery detail", position: "right center", src: "/assets/lREVKnbZDxTdgCdlTMAcEQXvxE.png" },
          { label: "Cover", src: "/assets/new/book-covers/curo-cover.png" },
        ],
      },
      {
        label: "GENERATIVE AI / MVP",
        assets: [
          { label: "Cover", src: "/assets/new/book-covers/curo-cover.png" },
          { label: "Path one", position: "15% center", src: "/assets/QZDLAFRGxs00xycurq0DyWxc.png" },
          { label: "Path two", position: "50% center", src: "/assets/QZDLAFRGxs00xycurq0DyWxc.png" },
          { label: "Path three", position: "85% center", src: "/assets/QZDLAFRGxs00xycurq0DyWxc.png" },
        ],
      },
    ],
    legacyArtifacts: [
      {
        label: "RESOURCES / DISCOVERY",
        position: "center",
        src: "/assets/lREVKnbZDxTdgCdlTMAcEQXvxE.png",
      },
      {
        label: "PATH / GENERATIVE AI",
        position: "center",
        src: "/assets/QZDLAFRGxs00xycurq0DyWxc.png",
      },
      {
        label: "MVP / COVER",
        position: "center",
        src: "/assets/new/book-covers/curo-cover.png",
      },
    ],
  },
};
