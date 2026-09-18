import type { CSSProperties } from "react";
import type { ProjectCarouselMedia } from "../components/ProjectMediaCarousel";

export type FolioProjectId =
  | "superr"
  | "superr-paper"
  | "wizpay"
  | "wiz-commerce"
  | "journal-desk"
  | "uber-kids"
  | "periodic-table"
  | "kriyadex"
  | "curo"
  | "farevv";

export type FolioProjectMedia = ProjectCarouselMedia & {
  /** Opt image media into the animated click-to-expand overlay. */
  expandable?: boolean;
  /** Static alternative for animated images when reduced motion is requested. */
  reducedMotionSrc?: string;
  caption?: string;
  introduction?: { heading: string; body: string };
  playbackRate?: number;
  presentation?: "activity-section";
  aspectRatio?: CSSProperties["aspectRatio"];
  ratio: "landscape" | "portrait" | "square";
};

export interface FolioProjectNote {
  mentions?: readonly { title: string; excerpt: string }[];
  launchPost?: { label: string; href: string };
  emphasis?: string;
  link?: { label: string; href: string };
  body: string;
  heading: string;
  id: string;
  kind: "note";
}

export interface FolioProjectSketch {
  kind: "sketch";
  id: string;
  label: string;
  steps: readonly string[];
}

export interface FolioProjectMediaGroup {
  introduction?: { heading: string; body: string };
  layout?: "comparison";
  sketch?: FolioProjectSketch;
  paymentTimelineAfterParagraph?: number;
  challenge?: { heading: string; body: string };
  captions?: readonly string[];
  callouts?: readonly { title: string; body: string }[];
  id: string;
  kind: "group";
  heading: string;
  description?: string;
  textSections?: readonly { heading: string; body: string; highlight?: string; bullets?: readonly string[] }[];
  solutionDetails?: readonly { heading: string; body: string }[];
  emphasis?: string;
  media: readonly FolioProjectMedia[];
}

export type FolioProjectStoryItem = FolioProjectMedia | FolioProjectNote | FolioProjectMediaGroup | FolioProjectSketch;

export interface FolioFolderPreview {
  color: CSSProperties["backgroundColor"];
  label: string;
  position?: CSSProperties["objectPosition"];
  src?: string;
}

export interface FolioProject {
  introMedia?: readonly FolioProjectMedia[];
  overview?: {
    companyIntro?: { heading: string; body: string };
    pullQuote?: string;
    context: string;
    contribution: string;
    facts: readonly { label: string; value: string }[];
  };
  heroImage?: { src: string; alt: string; expandable?: boolean; width?: number; height?: number };
  cardMeta: string;
  cardTitle: string;
  description: string;
  externalLabel?: string;
  externalUrl?: string;
  folderPreviews: readonly FolioFolderPreview[];
  id: FolioProjectId;
  logo?: string;
  media: readonly FolioProjectStoryItem[];
  previewMedia: readonly ProjectCarouselMedia[];
  services: readonly string[];
  title: string;
  headline?: string;
  tone: "charcoal" | "cobalt";
  year: string;
}

const superrPreviewMedia = [
  { alt: "Open Superr library book", background: "#fff9f7", fit: "contain", kind: "image", ratio: "square", src: "/assets/invoice-folio/superr-book-yohoo.png" },
  { ariaLabel: "Superr green interaction demonstration", background: "#a8e971", fit: "cover", kind: "video", poster: "/assets/invoice-folio/superr-green-poster.jpg", ratio: "square", src: "/assets/invoice-folio/superr-green-square.mp4" },
  { ariaLabel: "Superr search interaction demonstration", background: "#f6f3ed", fit: "contain", kind: "video", poster: "/assets/invoice-folio/superr-search-poster.jpg", ratio: "portrait", src: "/assets/invoice-folio/superr-search-scene.mp4" },
  { alt: "Superr stretching canvas interface", background: "#efeae2", fit: "cover", kind: "image", ratio: "landscape", src: "/assets/invoice-folio/superr-stretching.png" },
  { alt: "Profile icons designed for kids", background: "#faf4ec", fit: "contain", kind: "image", ratio: "square", src: "/assets/invoice-folio/superr-profile-icons.png" },
  { alt: "Superr science crossword activity", background: "#e6eef0", fit: "cover", kind: "image", ratio: "landscape", src: "/assets/invoice-folio/superr-crossword.png" },
] as const satisfies readonly FolioProjectMedia[];

const superrStory = [
  {
    id: "intro",
    kind: "group",
    heading: "Meet SuperrBook",
    media: [
      { ariaLabel: "Reasons to love SuperrBook", aspectRatio: "1080 / 1536", background: "#fffcf8", fit: "contain", kind: "video", poster: "/assets/invoice-folio/superr-case-study/creation-scene-4-poster.jpg", ratio: "landscape", src: "/assets/invoice-folio/superr-case-study/creation-scene-4.mp4" },
      { presentation: "activity-section", ariaLabel: "SuperrBook interactive crossword activity", aspectRatio: "16 / 9", background: "#000000", fit: "contain", kind: "video", poster: "/assets/invoice-folio/superr-case-study/activity-poster.jpg", ratio: "landscape", src: "/assets/invoice-folio/superr-case-study/activity.mp4" },
    ],
  },
  {
    id: "search",
    kind: "group",
    heading: "From handwritten notes to finding answers",
    media: [
      { ariaLabel: "Superr notebook and folder animation", playbackRate: 0.7, aspectRatio: "2 / 1", background: "#fffbf7", fit: "cover", kind: "video", position: "center", poster: "/assets/invoice-folio/superr-case-study/notebook-flipbook-cream-poster.png", ratio: "landscape", src: "/assets/invoice-folio/superr-case-study/notebook-flipbook-cream.mp4" },
      { alt: "Superr My Notes library with colorful notebooks and folders", aspectRatio: "728 / 809", background: "#fffcf8", fit: "contain", kind: "image", ratio: "portrait", src: "/assets/invoice-folio/superr-case-study/figma-frame-1.png" },
      { alt: "Superr Photosynthesis handwriting recognition and handwritten notebook pages", aspectRatio: "728 / 1077", background: "#fffcf8", fit: "contain", kind: "image", ratio: "portrait", src: "/assets/invoice-folio/superr-case-study/figma-frame-3.png" },
      { alt: "Superr recent searches for Theory of relativity, Photosynthesis, and Laws of motion", aspectRatio: "1456 / 1388", background: "#ffffff", fit: "contain", kind: "image", ratio: "square", src: "/assets/invoice-folio/superr-case-study/recent-searches-v2.png" },
      { alt: "Superr Photosynthesis search results across Notes, Superr Chat, and Library", aspectRatio: "728 / 1219", background: "#fffcf8", fit: "contain", kind: "image", ratio: "portrait", src: "/assets/invoice-folio/superr-case-study/figma-182-6125.png" },
      { ariaLabel: "Superr Green product demonstration", background: "#ffffff", fit: "contain", kind: "video", poster: "/assets/invoice-folio/superr-case-study/green-poster.jpg", ratio: "square", src: "/assets/invoice-folio/superr-case-study/search-trimmed-v2.mp4" },
    ],
  },
  {
    id: "profiles",
    kind: "group",
    heading: "A little personality for every learner",
    media: [
      { ariaLabel: "Animated profile icons designed for kids", aspectRatio: "2 / 1", background: "#ffffff", fit: "contain", kind: "video", poster: "/assets/invoice-folio/superr-case-study/pfp-pop-loop-v3-poster.png", ratio: "landscape", src: "/assets/invoice-folio/superr-case-study/pfp-pop-loop-v4.mp4" },
      { alt: "SuperrBook cover selection with a personalized notebook and thirteen cover options", aspectRatio: "1440 / 904", fit: "contain", kind: "image", ratio: "landscape", src: "/assets/invoice-folio/superr-case-study/superr-website-figma-8404-17805.png" },
    ],
  },
  {
    id: "details",
    kind: "group",
    heading: "The joy is in the details",
    media: [
      { alt: "Sketch your day calendar design with a yellow February page, hand-drawn flowers, and colourful stacked sheets", aspectRatio: "728 / 861", fit: "contain", kind: "image", ratio: "portrait", src: "/assets/invoice-folio/superr-case-study/superr-figma-211-2908.png" },
      { alt: "Superr cookie banner with a bitten cookie illustration, playful copy, and Reject and Accept buttons", aspectRatio: "728 / 382", fit: "contain", kind: "image", ratio: "landscape", src: "/assets/invoice-folio/superr-case-study/superr-figma-150-3132.png" },
      { ariaLabel: "Superr screen recording demonstration", aspectRatio: "1600 / 896", fit: "contain", kind: "video", poster: "/assets/invoice-folio/superr-case-study/superr-footer-trimmed-poster.jpg", ratio: "landscape", src: "/assets/invoice-folio/superr-case-study/superr-footer-trimmed.mp4" },
    ],
  },
] as const satisfies readonly FolioProjectStoryItem[];

const journalMedia = [
  { ariaLabel: "Journal Desk writing interaction", background: "#11191b", fit: "contain", kind: "video", poster: "/assets/invoice-folio/project-two-poster.jpg", ratio: "landscape", src: "/assets/invoice-folio/project-two-preview.mp4" },
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

const wizPayStory = [
{
  "kind": "group",
  "id": "payment-space",
  "heading": "Payment blocks",
  "description": "Each payment action used the blocks it needed, giving us a shared structure that could grow with new scenarios.",
  "media": []
},
{
  "kind": "group",
  "id": "invoice-payments",
  "heading": "Payments against invoices",
  "description": "We introduced invoices to link payments to an order, a quote, or a customer.",
  "media": []
},
{
  "kind": "group",
  "id": "recurring-payments",
  "heading": "Recurring payments",
  "description": "Teams could set up recurring collections and keep track of them through a payment schedule.",
  "media": []
},
{
  "kind": "group",
  "id": "payment-credits",
  "heading": "Customer credits",
  "description": "Teams could add customer credits from the dashboard and use them for future payments.",
  "media": []
},
{
  "kind": "group",
  "id": "payment-form",
  "heading": "Bringing it all together",
  "description": "These pieces came together in one payment form—a standalone module that could work within existing workflows or on its own.",
  "media": [{
    "kind": "image",
    "src": "/assets/invoice-folio/wizpay-case-study/payment-form.png?v=2",
    "alt": "Complete standalone payment form bringing together customer details, invoice collection, charges, payment methods and available credits",
    "aspectRatio": "1386 / 2322",
    "ratio": "portrait",
    "expandable": true
  }]
},
{
  "kind": "group",
  "id": "collaboration",
  "heading": "Dashboards - most b2b-ish thingy to exist",
  "description": "Taking a payment was one part. Teams also needed a place to track what happened next.",
  "media": [
  {
    "kind": "image",
    "src": "/assets/invoice-folio/wizpay-case-study/transactions-web.png?v=3",
    "alt": "Web transaction view showing payment statuses and transaction details",
    "aspectRatio": "1504 / 683",
    "ratio": "landscape",
    "expandable": true
  }
  ]
},
{
  "kind": "group",
  "id": "responsive-transactions",
  "heading": "Same payments, smaller screens",
  "description": "That big table couldn’t simply shrink to fit every screen. We needed the layout to make sense across breakpoints without losing any payment details. On tablet, we made the rows expandable. On mobile, we turned each row into an expandable card, keeping the key information visible and the rest a tap away.",
  "media": [
  {
    "kind": "image",
    "src": "/assets/invoice-folio/wizpay-case-study/transactions-tablet.png",
    "alt": "Tablet transaction view showing payment statuses and transaction details",
    "aspectRatio": "1193 / 883",
    "ratio": "landscape",
    "expandable": true
  },
  {
    "kind": "image",
    "src": "/assets/invoice-folio/wizpay-case-study/transactions-mobile.png?v=2",
    "alt": "Mobile transaction view showing payment statuses and transaction details",
    "aspectRatio": "360 / 843",
    "ratio": "portrait",
    "expandable": true
  }
]
},
  {
    "kind": "group",
    "id": "org-settings",
    "heading": "Giving wholesalers control over how they get paid",
    "description": "Every wholesaler had their own way of collecting payments. Organisation settings let them choose the methods they accepted and define payment terms that worked for their business.",
    "media": []
  },
  {
    "kind": "group",
    "id": "impact",
    "heading": "Impact",
    "media": []
  },
] as const satisfies readonly FolioProjectStoryItem[];

const superrProject: FolioProject = {
    cardMeta: "AI / EdTech / Product systems", cardTitle: "Superr",
    description: "Superr builds tools that make learning more engaging, bringing together writing, exploration, and interactive activities. SuperrBook brings that idea to a familiar notebook.\n\nI worked with the team across a range of products and experiences. Here’s a small selection of what I helped shape.\n\nMy work spans product design, visual design, animation, and AI-led frontend development. Everything here came together with the Superr team.",
    externalLabel: "Reach out", externalUrl: "mailto:hello@parosayshi.com?subject=Superr%20work%20walkthrough",
    folderPreviews: [
      { color: "#f4efe6", label: "Library", position: "center 24%", src: "/assets/invoice-folio/superr-project-placeholder-5.png?v=1" },
      { color: "#a8e971", label: "Make", src: "/assets/invoice-folio/superr-green-poster.jpg" },
      { color: "#f7f1e8", label: "Activities", src: "/assets/invoice-folio/superr-crossword.png" },
    ],
    id: "superr", logo: "/assets/invoice-folio/superr-current-mark.svg", media: superrStory, previewMedia: superrPreviewMedia,
    services: ["Visual execution", "Animation", "AI & code"], title: "Superr", tone: "cobalt", year: "2025—26",
  };

export const folioProjects: Record<FolioProjectId, FolioProject> = {
  superr: superrProject,
  "superr-paper": {
    ...superrProject,
    id: "superr-paper",
    cardTitle: "Superr — paper version",
    cardMeta: "Paper case study / Preview",
    overview: {
      context: superrProject.description.split("\n\n")[0],
      contribution: superrProject.description.split("\n\n").slice(1).join("\n\n"),
      facts: [],
    },
  },
  wizpay: {
    overview: {
      context: "It’s not every day you get to design the core flow of a B2B payments system from scratch. Wizpay was that chance for me, and these are some of the small stories, endless questions and little victories along the way.",
      contribution: "",
      companyIntro: {
        heading: "What does WizCommerce do?",
        body: "WizCommerce brings wholesale selling into one connected platform—from showing products and building quotes to taking orders and collecting payments. Sales reps and buyers work with the same customer, pricing, and inventory information, whether they’re at a trade show, in the field, or ordering online.",
      },
      facts: [],
    },
    heroImage: { expandable: true, src: "/assets/invoice-folio/wizpay-case-study/hero-338-25712.png", width: 1568, height: 1295, alt: "WizPay transaction dashboard with payment details, upcoming payments, invoice collection and refunds" },
    id: "wizpay", cardTitle: "WizPay", cardMeta: "Payments / Product design",
    title: "WizPay", year: "Oct 2024–Mar 2025", tone: "charcoal",
    headline: "Designing Wizpay\nB2B payments solution for wholesalers",
    description: "WizCommerce is a B2B commerce platform for wholesalers. It brings product browsing, order taking, quotes and payments into one place, helping sales reps work with retailers through the sales process.",
    services: ["Product design", "Payment workflows", "Cross-device design"],
    media: wizPayStory, folderPreviews: [],
    previewMedia: [{kind: "image", alt: "WizPay payment interface", src: "/assets/new/wizcommerce-frame32/wizpay-table.png", fit: "contain"}],
  },
  "wiz-commerce": {
    cardMeta: "B2B commerce", cardTitle: "WizCommerce", id: "wiz-commerce",
    title: "WizCommerce", year: "2023—25", tone: "charcoal",
    headline: "Building tools for B2B wholesale — a collection",
    logo: "/assets/invoice-folio/wizcommerce-current-mark.svg",
    description: "Helping wholesale teams make clearer product decisions and keep customers informed.",
    overview: {
      context: "WizCommerce brings product discovery, quotes and orders into one workflow for wholesale sales teams.",
      contribution: "We redesigned product information and explored recommendations, then worked on email entry, order touchpoints and organization-wide email settings with product and engineering.",
      facts: [],
    },
    services: ["Product design", "Product discovery", "Customer communication"], folderPreviews: [],
    previewMedia: [wizCommerceMedia[0]],
    media: [
      { kind: "group", id: "product-data", heading: "1. Redesigning Product cards on listing page helping reps make informed decisions during sale.",
        description: "Sales reps use the product listing page during customer calls to browse the catalogue, recommend products, and add items to an order. Product cards bring together the information they need to decide what to offer.",
        textSections: [
          { heading: "The problem", highlight: "reps couldn’t quickly make informed decisions about which products to upsell", body: "During sales calls, reps couldn’t quickly make informed decisions about which products to upsell because the listing cards didn’t surface the information they needed." },
          { heading: "Identifying what to show", body: "Conversations with the product team and early customers helped identify the information reps needed on product cards:", bullets: ["Stock availability", "Restock timelines", "Variant details", "Promotional information"] },
          { heading: "The solution", body: "We redesigned the product cards to make key information easier to scan and the next action clearer. The design also needed to accommodate different product states and work across desktop, tablet, and mobile." }
        ],
        solutionDetails: [
          { heading: "More options, one card", body: "Similar variants were grouped together to help reps offer more options during a sale. The count beneath “Add to cart” makes that grouping explicit: “+3 products” means three additional variants, while this example shows two. Selecting the CTA opens the variant selection step before adding to the cart." },
          { heading: "Extra information when relevant", body: "Optional scrolling tags for promotions." }
        ],
        media: [{ kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/product-cards.png", aspectRatio: "2264 / 1556", alt: "Redesigned product cards with stock and variant information", fit: "contain", ratio: "landscape", expandable: true }] },
      { kind: "group", id: "tables", heading: "2. Turning saved table views into daily workflows",
        description: "We enabled sales reps to save views of the tables they worked with. They could apply filters, save the view, and return to it later.\n\nIt seemed like a small ask, but we saw it become something much more useful. Reps at our customers’ businesses started using saved views like a scratchpad—turning them into to-do lists and lists of line items to track.",
        captions: ["Saved table views.", "Actions for a saved view.", "Choosing a global filter.", "Right-side table controls."],
        media: [
          { kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/tables/saved-views-full.png", aspectRatio: "1535 / 485", alt: "Customer table with All Customers, To do, Archived, Next Week and Priority views", fit: "contain", ratio: "landscape", expandable: true },
          { kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/tables/view-actions-full.png", aspectRatio: "1532 / 489", alt: "To do view menu with delete, duplicate, edit, default and rename actions", fit: "contain", ratio: "landscape", expandable: true },
          { kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/tables/global-filter-full.png", aspectRatio: "1538 / 541", alt: "Customer table with the global filter field menu open", fit: "contain", ratio: "landscape", expandable: true },
          { kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/tables/global-filter-full.png", aspectRatio: "1538 / 541", alt: "Right-side controls on the customer table", fit: "contain", ratio: "landscape", expandable: true },
        ] },
      { kind: "group", id: "notifications", heading: "3. Tracking background tasks without interrupting work",
        description: "Updates such as price changes and modifier approvals were scattered across tools and email threads. Users had to leave the task to understand its context.\n\nWe structured notification cards around category, state and action: what happened, its current status, and what the user could do next. The same structure carried through desktop hover actions and mobile action bars.",
        media: [
          { kind: "image", src: "/assets/case-studies/wW4SVPDeec1uQCfQzsVHps8sxzA.png", aspectRatio: "2704 / 1832", alt: "Notification card anatomy: category, status, summary and action", fit: "contain", ratio: "landscape", expandable: true },
          { kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/notifications-desktop.png", aspectRatio: "1439 / 983", alt: "Desktop notifications panel with exported inventory, collections, documents and quote downloads", caption: "Large exports trigger an email and an in-app notification when ready.", fit: "contain", ratio: "landscape", expandable: true },
          { kind: "image", src: "/assets/case-studies/MoruwIByXULy13qj1FasE6MtC40.png", aspectRatio: "5408 / 3320", alt: "Notification action bars on mobile", caption: "Track progress, retry failed exports, and download files—all from mobile notifications.", fit: "contain", ratio: "landscape", expandable: true }
        ] },
      { kind: "group", id: "discovery", heading: "4. Turning purchase history into product recommendations",
        description: "We extended these data cues into previously bought cards, variant sheets and cart review across devices. Recommendation explorations grouped related products to support discovery and upselling; these were still work in progress.",
        media: [{ kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/recommendations.png", aspectRatio: "1509 / 950", alt: "Product recommendation grouping exploration", fit: "contain", ratio: "landscape", expandable: true }, { kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/kai-smart-picks.png", aspectRatio: "1024 / 768", alt: "Kai’s smart picks with personalized product groups, previously ordered products, categories and collections", fit: "contain", ratio: "landscape", expandable: true }] },
      { kind: "group", id: "offline", heading: "5. Redefining offline mode",
        description: "Offline mode lets sales reps browse downloaded data and take orders without an internet connection at trade shows. But the initial sync often ran to several hundred GB, with multiple images for each product. In the worst cases, it took almost 20–30 minutes, blocking reps from getting started.",
        emphasis: "Offline mode lets sales reps browse downloaded data and take orders without an internet connection at trade shows.",
        media: [
          { kind: "image", src: "/assets/case-studies/QUw1WXKgCUja2aez716hxK52wwA.png", aspectRatio: "2598 / 1560", alt: "Sync split into stages by data type", introduction: { heading: "Sync essentials first", body: "We split the download into stages: customers and orders first, heavier product images later. Reps could start working with the essentials while the rest continued syncing." }, fit: "contain", ratio: "landscape", expandable: true },
          { kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/offline-primary-card.png", aspectRatio: "329 / 440", alt: "Separate data and media sync, with primary images downloading", caption: "Data and media sync separately.", fit: "contain", ratio: "portrait", expandable: true },
          { kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/offline-all-images-card.png", aspectRatio: "329 / 440", alt: "Customer, order and product data synced while remaining images continue downloading", caption: "Data is ready while the remaining images sync.", fit: "contain", ratio: "portrait", expandable: true }
        ],
        solutionDetails: [{ heading: "Results & impact", body: "Incremental sync saved 15–30+ minutes. Active usage of offline mode increased by 40% after the sync updates." }] },
      { kind: "group", id: "visuals", heading: "6. Designing beyond product",
        description: "As a team of two designers, we worked at the intersection of product, marketing and engineering. Our visual work spanned emailers, website interfaces, Google ads, App Store artwork and presentation decks.\n\nWe also designed the pitch deck used for WizCommerce’s $8 million Series A fundraise.",
        emphasis: "We also designed the pitch deck used for WizCommerce’s $8 million Series A fundraise.",
        media: [
          { kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/google-ads/google-ads.gif", reducedMotionSrc: "/assets/invoice-folio/wizcommerce-case-study/google-ads/google-ads-poster.png", alt: "Google display ads designed for WizCommerce in four formats", fit: "contain", ratio: "landscape", aspectRatio: "3 / 2", caption: "Google display ads, adapted across four formats." },
          { kind: "image", src: "/assets/new/wizcommerce-frame32/visuals-grid-111.png", alt: "WizCommerce presentation design", fit: "contain", ratio: "landscape", expandable: true },
          { kind: "image", src: "/assets/new/wizcommerce-frame32/visuals-grid-222.png", alt: "Wholesale market presentation slide", fit: "contain", ratio: "landscape", expandable: true },
          { kind: "image", src: "/assets/new/wizcommerce-frame32/visuals-grid-333.png", alt: "WizCommerce visual communication", fit: "contain", ratio: "landscape", expandable: true },
          { kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/app-store/ipad-slides.gif", reducedMotionSrc: "/assets/invoice-folio/wizcommerce-case-study/app-store/ipad-poster.png", alt: "WizCommerce iPad App Store visuals", ratio: "landscape", aspectRatio: "17 / 12", fit: "contain", caption: "iPad App Store visuals designed for WizCommerce." },
          { kind: "image", src: "/assets/invoice-folio/wizcommerce-case-study/email-headers/email-headers.gif?v=3", reducedMotionSrc: "/assets/invoice-folio/wizcommerce-case-study/email-headers/email-headers-poster.png", alt: "Email headers designed for WizCommerce customer communications", ratio: "landscape", aspectRatio: "17 / 11", fit: "contain", caption: "Email headers designed for customer communications." }
        ] },
      { kind: "note", id: "reflection", heading: "Want to see more?",
        body: "There’s more to share on discounts, CRM and email communication. Reach out for a walkthrough.",
        },
    ],
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
  "superr", "superr-paper", "wizpay", "wiz-commerce", "journal-desk", "uber-kids",
];
