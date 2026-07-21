import type { ProjectsMap } from "../types/project";

export const projects = {
        "notebook": {
          edition: "field-note",
          kicker: "FIELD NOTEBOOK / ONGOING",
          title: "Things that stayed in the notebook",
          deck: "",
          body: []
        },
        "wiz-commerce": {
          edition: "case-file",
          figmaLayout: "frame32",
          mastheadDate: "05",
          mastheadBrand: "WIZCOMMERCE",
          mastheadLogo: "/assets/new/wizcommerce-frame32/sourcewiz-logo.png",
          kicker: "PRODUCT SYSTEM CASE STUDY / 2023—2025",
          title: "WizCommerce",
          deck: "Designing across the operating layer for wholesale: payments, field sales, customer communication, AI, product configuration, and the systems connecting them.",
          meta: ["Product design", "WizPay", "WizOrder", "WizShop", "WizAI"],
          leadImage: {
            type: "image",
            src: "/assets/new/wizcommerce-frame32/uploads/wizpay-responsive-transactions.png",
            alt: "WizPay transaction system across mobile and desktop",
            caption: "WizCommerce product system, 2023—2025"
          },
          leadCaption: "WizCommerce product system, 2023—2025",
          introColumns: [
            "Across two years I worked through a wide part of the product pipeline: framing problems, mapping workflows, designing product surfaces, iterating with engineering and product, and helping the work make sense when it reached customers and the market.",
            "This is not one isolated feature story. It is the record of a product becoming an operating system for wholesale teams across the office, the showroom, the trade-show floor, and the customer storefront."
          ],
          body: [
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "The operating context"
            },
            {
              type: "red-columns",
              columns: [
                {
                  strong: "Wholesale work does not happen in one clean funnel.",
                  text: " A sales rep may begin an order offline at a trade show, an operations team may enrich it through an ERP, a customer may pay later, and finance still needs a legible record of every state."
                },
                {
                  strong: "My work sat across that connected system.",
                  text: " The design challenge was to make dense, configurable software feel understandable without flattening the client-specific rules that made it useful."
                }
              ]
            },
            {
              type: "image",
              src: "/assets/new/wizcommerce-frame32/visuals-grid-111.png",
              alt: "WizCommerce system map connecting ERP, WizOrder, WizShop, WizAI and WizPay",
              caption: "System map: one record layer serving field sales, storefronts, payments, and intelligence."
            },
            {
              type: "screen-grid",
              screens: [
                {
                  label: "SURFACE 01",
                  title: "WizOrder",
                  body: "Order taking for reps working in showrooms, on the road, and at trade shows.",
                  notes: ["Web, iPad and mobile", "Offline and unreliable networks", "Orders, quotes, carts and catalogs"]
                },
                {
                  label: "SURFACE 02",
                  title: "WizShop",
                  body: "Configurable B2B storefronts that extend the same product and customer data to buyers.",
                  notes: ["Tenant-specific branding", "Leads, quotes and orders", "Pre-login and assisted buying"]
                },
                {
                  label: "SURFACE 03",
                  title: "WizPay",
                  body: "A payment layer embedded in orders, invoices, customer records, and accounting workflows.",
                  notes: ["Card, ACH and payment links", "Authorization, refund and credit", "Gateway and ERP constraints"]
                },
                {
                  label: "SURFACE 04",
                  title: "WizAI + CRM",
                  body: "Decision support built into product discovery, customer preparation, reporting, and follow-up.",
                  notes: ["Search and recommendations", "Customer summaries", "Tasks, activities and notes"]
                }
              ]
            },
            {
              type: "quote",
              text: "The recurring design question was: how do we preserve operational flexibility without making every screen feel like configuration software?"
            },
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "WizPay — from a button to an operating layer"
            },
            {
              type: "red-columns",
              columns: [
                {
                  strong: "A payment system for wholesale realities.",
                  text: " WizPay needed to handle messy B2B payment behavior: invoices, credits, links, authorizations, partial payments, and follow-ups without making reps feel like they were operating a finance tool."
                },
                {
                  strong: "The main problem was not only collection.",
                  text: " It was making every payment state visible enough for sales, operations, and accounting to trust what was happening across the lifecycle."
                }
              ]
            },
            {
              type: "image",
              src: "/assets/new/wizcommerce-frame32/uploads/wizpay-transactions-dashboard.png",
              alt: "WizPay transactions dashboard table",
              caption: " ~ WizPay, 2023-2025"
            },
            {
              type: "image",
              src: "/assets/new/wizcommerce-frame32/uploads/wizpay-product-surface.png",
              alt: "WizPay transaction table product surface",
              caption: " ~ WizPay product surface"
            },
            {
              type: "image",
              src: "/assets/new/wizcommerce-frame32/uploads/wizpay-responsive-transactions.png",
              alt: "WizPay responsive transactions views",
              caption: " ~ WizPay responsive states"
            },
            {
              type: "media-row",
              variant: "carousel-strip",
              columns: 3,
              caption: "Various scalable blocks that made it to PROD",
              items: [
                {
                  src: "/assets/new/wizcommerce-frame32/uploads/wizpay-carousel-1.png",
                  alt: "Recurring payment setup card"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/uploads/wizpay-carousel-2.png",
                  alt: "Upcoming payment status card"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/uploads/wizpay-carousel-3.png",
                  alt: "Refund transaction selection card"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/uploads/wizpay-carousel-4.png",
                  alt: "ACH and card payment methods card"
                }
              ]
            },
            {
              type: "video-carousel",
              items: [
                {
                  src: "/assets/case-study-videos/VLr3YMDqmMuPgol9ISVXPhH8vhQ.mp4"
                },
                {
                  src: "/assets/case-study-videos/kekMPLtuKhMqrAxEvSOAwrPRIc.mp4"
                },
                {
                  src: "/assets/case-study-videos/M8g5SwXWfGYpMYYQy1MpeqXz8M.mp4"
                },
                {
                  src: "/assets/case-study-videos/MLWPbW1dUQawJLhhun3dBwpgJak.mp4"
                }
              ]
            },
            {
              type: "screen-grid",
              screens: [
                {
                  label: "COLLECT",
                  title: "More than one way to get paid",
                  body: "The collection action expanded into cards on file, ACH, payment links, direct payments, split and recurring payments.",
                  notes: ["Card and ACH", "Payment links and virtual terminal", "Installments and recurring schedules"]
                },
                {
                  label: "CONTROL",
                  title: "Terms, fees and authorization",
                  body: "Wholesale payments needed tenant-level controls rather than one checkout assumption.",
                  notes: ["Pre-authorization", "Optional card capture by payment term", "Surcharge controls and L2/L3 data"]
                },
                {
                  label: "TRUST",
                  title: "Every state had to explain itself",
                  body: "Transactions needed a durable history across collection, failure, authorization, void, credit, and refund.",
                  notes: ["Status-aware transaction ledger", "Receipts and event emails", "Device versus all-transaction reconciliation"]
                },
                {
                  label: "INFRASTRUCTURE",
                  title: "Gateways changed; the workflow had to hold",
                  body: "The product had to absorb processor and PCI constraints without exposing that complexity to every user.",
                  notes: ["Stax to Finix migration", "Fortis, PayFabric, Worldpay and SensePass", "PCI vault tokenization"]
                }
              ]
            },
            {
              type: "small-note",
              text: "Release evidence: the August 2024 update recorded 11 customers live after the Finix migration. Keep the figure dated and verify personal attribution before publishing."
            },
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "Order taking where the work happens"
            },
            {
              type: "red-columns",
              columns: [
                {
                  strong: "The trade-show floor was a stress test for the whole product.",
                  text: " Shared iPads, unstable networks, large catalogs, multiple shipping locations, and several reps working for the same account turned small interaction gaps into operational problems."
                },
                {
                  strong: "The interface had to preserve momentum and accountability.",
                  text: " I worked on surfacing the right product data, keeping cart state safe, and making order ownership, tags, sync, and next actions easier to understand."
                }
              ]
            },
            {
              type: "image",
              src: "/assets/case-studies/f2MFjaGV3u8MAIXdzRO9fHE2wc.png",
              alt: "WizOrder product listing across order-taking devices",
              caption: "WizOrder product discovery: the starting point for many field-sales decisions."
            },
            {
              type: "image",
              src: "/assets/case-studies/mjRUy3TMmhpKrNoGXxSz8YAttg0.png",
              alt: "Before and after product cards showing more decision-critical information",
              caption: "Product cards evolved to surface stock, variants, tags, and inventory signals before a rep committed to an item."
            },
            {
              type: "screen-grid",
              screens: [
                {
                  label: "DISCOVER",
                  title: "Faster product decisions",
                  body: "Product cards and recommendations carried more of the data a rep needed during a live customer conversation.",
                  notes: ["Stock and restock signals", "Variant and inventory details", "Similar products and contextual cart search"]
                },
                {
                  label: "BUILD",
                  title: "Carts became working spaces",
                  body: "The cart had to support several simultaneous orders and preserve work through interruptions and complex product rules.",
                  notes: ["Multi-cart and cart grouping", "Persist edits and copy cart", "Custom pricing, discounts and notes"]
                },
                {
                  label: "TRACK",
                  title: "Ownership stayed visible",
                  body: "Operational metadata made the handoff after a show less dependent on memory and manual coordination.",
                  notes: ["Written by and written for", "Order tags and associated reps", "Order source, sync status and manual retry"]
                },
                {
                  label: "CONTINUE",
                  title: "The workflow survived weak networks",
                  body: "Offline behavior was treated as a core condition, not an exceptional empty state.",
                  notes: ["Data on device and auto-sync", "Offline card capture and physical count", "PDF download and Bluetooth printing"]
                }
              ]
            },
            {
              type: "media-row",
              variant: "carousel-strip",
              size: "full",
              columns: 2,
              caption: "Responsive product data and cart patterns across mobile and tablet.",
              items: [
                {
                  src: "/assets/case-studies/D14InoE2s4mg8mig0KcPU2ECg.png",
                  alt: "Previously bought product cards across devices"
                },
                {
                  src: "/assets/case-studies/bwgLKLSS6QzAfOwXLP5De3p1mTQ.png",
                  alt: "WizOrder cart presentation on tablet"
                }
              ]
            },
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "WizShop and the customer lifecycle"
            },
            {
              type: "red-columns",
              columns: [
                {
                  strong: "The storefront could not be a generic B2C template.",
                  text: " Each tenant brought its own visibility rules, pricing logic, lead approvals, payment preferences, product data, and integration constraints."
                },
                {
                  strong: "The relationship continued after sign-up and checkout.",
                  text: " Reordering, abandoned carts, assisted buying, CRM activity, and customer dashboards connected storefront behavior back to the sales team."
                }
              ]
            },
            {
              type: "screen-grid",
              screens: [
                {
                  label: "DISCOVER",
                  title: "Browse before the account was ready",
                  body: "Pre-login browsing and configurable pricing opened the storefront to different B2B and B2C acquisition models.",
                  notes: ["Show or hide price before login", "Tenant branding and mobile layouts", "Product tear sheets with or without price"]
                },
                {
                  label: "ONBOARD",
                  title: "Turn sign-up into an accountable lead",
                  body: "The storefront supported validation, approvals, customer-specific users, and exportable lead records.",
                  notes: ["Lead approval flow", "Bulk user invites", "Separate billing and shipping attributes"]
                },
                {
                  label: "CONVERT",
                  title: "Support the customer who did not self-serve",
                  body: "Quote requests, abandoned-cart recovery, and assisted buying let reps continue the conversation.",
                  notes: ["Request a quote", "Automated cart reminders", "Place an order on a buyer's behalf"]
                },
                {
                  label: "RETURN",
                  title: "Make the next order cheaper to place",
                  body: "Reordering and copy-cart flows reused the shipping, payment, and product context already on record.",
                  notes: ["Repeat past orders", "Copy cart into quote or order", "Customer dashboard and recent activity"]
                }
              ]
            },
            {
              type: "small-note",
              text: "The August 2024 release email reported more than $130,000 in orders for the first WizShop client. Treat this as dated company-release evidence until the source and attribution are cleared for publication."
            },
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "Communication became product infrastructure"
            },
            {
              type: "red-columns",
              columns: [
                {
                  strong: "A single email field exposed a system problem.",
                  text: " Recipients were easy to miss, different tenants wanted different triggers, and every order, quote, payment, cancellation, or lead created another communication state."
                },
                {
                  strong: "The solution grew from input UX into an org-wide model.",
                  text: " The flow connected recipient suggestions, user permissions, event configuration, templates, resend behavior, and a record of what happened."
                }
              ]
            },
            {
              type: "image",
              src: "/assets/case-studies/7pNOxoU2UIQLghgLPRTMAgwU1AE.png",
              alt: "Map of email touchpoints in the WizOrder sales journey",
              caption: "Mapping email touchpoints across the sales-rep journey revealed the system behind the field."
            },
            {
              type: "image",
              src: "/assets/case-studies/6BIBiTr3GZQDFXe6IvdilhHDs.png",
              alt: "Redesigned quote and order email checkpoint",
              caption: "The order and quote checkpoint made recipients visible without turning communication into a separate workflow."
            },
            {
              type: "screen-grid",
              screens: [
                {
                  label: "INPUT",
                  title: "Make completion unambiguous",
                  body: "The redesigned field clarified when an address was actually added and surfaced relevant suggestions.",
                  notes: ["Inline suggestions", "Explicit add feedback", "Fewer repeated entries"]
                },
                {
                  label: "TRIGGER",
                  title: "Configure the event, not each screen",
                  body: "The release archive describes 61 email triggers grouped across orders, payments, imports, integrations, and storefront events.",
                  notes: ["Automatic or manual send", "Role-based ability to suppress", "Resend from the order record"]
                },
                {
                  label: "RECIPIENT",
                  title: "Put people into reusable buckets",
                  body: "Recipient logic had to include customers, reps, admins, and editable ad-hoc addresses without rebuilding every flow.",
                  notes: ["Default recipient rules", "User buckets", "Editable recipient lists"]
                },
                {
                  label: "PAYMENT",
                  title: "Close the loop after money moved",
                  body: "Authorization, failure, void, and refund events gained emails and standardized receipts.",
                  notes: ["Transaction receipts", "Failure and authorization states", "Auto-email imported invoices"]
                }
              ]
            },
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "WizAI"
            },
            {
              type: "red-columns",
              columns: [
                {
                  strong: "AI needed to act like product infrastructure.",
                  text: " The useful direction was not a flashy assistant, but small AI surfaces that helped users retrieve, generate, and reason inside existing commerce workflows."
                },
                {
                  strong: "The interface had to stay grounded.",
                  text: " Every generated state needed context, constraints, and a clear next action so the product still felt like a practical workflow surface."
                }
              ]
            },
            {
              type: "image",
              src: "/assets/new/wizcommerce-frame32/uploads/wizai-product-assistant.png",
              alt: "WizAI assistant overlay on product listing",
              caption: " ~ WizAI, 2023-2025"
            },
            {
              type: "media-row",
              variant: "carousel-strip",
              columns: 3,
              caption: " ~ WizAI states",
              items: [
                {
                  src: "/assets/new/wizcommerce-frame32/uploads/wizai-carousel-1.png",
                  alt: "WizAI billing address response"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/uploads/wizai-carousel-2.png",
                  alt: "WizAI similar products and suggested actions"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/uploads/wizai-carousel-3.png",
                  alt: "WizAI product information response"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/uploads/wizai-carousel-4.png",
                  alt: "WizAI cart summary response"
                }
              ]
            },
            {
              type: "screen-grid",
              screens: [
                {
                  label: "FIND",
                  title: "Natural-language product discovery",
                  body: "A rep could describe what they needed, search by image, or ask for visually similar products without abandoning the catalog.",
                  notes: ["Prompted product search", "Image search and view similar", "Price-aware recommendations"]
                },
                {
                  label: "ACT",
                  title: "Move from an answer into work",
                  body: "Useful assistant responses connected to the existing objects people already understood.",
                  notes: ["Create carts, orders and catalogs", "Draft emails and tear sheets", "Suggest form values"]
                },
                {
                  label: "PREPARE",
                  title: "Bring customer context forward",
                  body: "Customer summaries and recommendations helped reps prepare for a meeting before opening several reports.",
                  notes: ["Recent activity summary", "Regional and behavioral picks", "Reorder and next-action cues"]
                },
                {
                  label: "QUERY",
                  title: "Ask the data a business question",
                  body: "Natural-language reporting translated questions about sales and accounts into structured results.",
                  notes: ["Text-to-SQL reporting", "Customer opportunity scoring", "Explainable sales insights"]
                }
              ]
            },
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "Modifiers"
            },
            {
              type: "red-columns",
              columns: [
                {
                  strong: "Modifiers turned product data into a decision surface.",
                  text: " Instead of hiding configuration behind dense forms, the work needed to make options, combinations, and product dependencies easier to understand."
                },
                {
                  strong: "The hard part was making complexity scan well.",
                  text: " Wholesale products carry attributes, constraints, images, inventory, and order logic; the interface needed to respect that density while staying readable."
                }
              ]
            },
            {
              type: "image",
              src: "/assets/new/wizcommerce-frame32/Modifier-intro.png",
              alt: "Modifiers product configuration overview",
              caption: " ~ Modifiers, 2023-2025"
            },
            {
              type: "media-row",
              variant: "carousel-strip",
              size: "full",
              columns: 2,
              caption: " ~ Modifier states",
              items: [
                {
                  src: "/assets/new/wizcommerce-frame32/modifiers-carousel-mod-1.png",
                  alt: "Modifiers configuration state"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/modifiers-carousel-mod-2.png",
                  alt: "Modifiers product option state"
                }
              ]
            },
            {
              type: "screen-grid",
              screens: [
                {
                  label: "MODEL",
                  title: "Configuration moved to the SKU",
                  body: "Different variants could expose different options, values, prices, quantities, images, and rules.",
                  notes: ["Variant-level modifier sets", "Formula-driven price and quantity", "Conditional show, filter and prefill rules"]
                },
                {
                  label: "FLOW",
                  title: "A form became a guided builder",
                  body: "The later Left Bank work replaced a dense dependency sheet with step-by-step configuration and live product feedback.",
                  notes: ["Typeform-style steps", "Real-time image and description updates", "Edit directly from cart"]
                },
                {
                  label: "CATALOG",
                  title: "Product data stayed editable",
                  body: "PIM improvements reduced repetitive work and made catalog corrections possible closer to their source.",
                  notes: ["Editable SKU and inventory", "Variant attribute and pricelist inheritance", "Image-only import and original/transformed export"]
                },
                {
                  label: "OUTPUT",
                  title: "Configured products survived downstream",
                  body: "Customizations had to remain legible in carts, orders, pricing, labels, exports, and product documents.",
                  notes: ["Discount customized lines", "Scan customizable SKUs", "Tear sheets and repeat label counts"]
                }
              ]
            },
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "Configurable by tenant, legible to humans"
            },
            {
              type: "red-columns",
              columns: [
                {
                  strong: "Enterprise flexibility accumulated quickly.",
                  text: " Every customer could bring different ERP values, roles, numbering formats, shipping rules, price visibility, fields, gateways, and data ownership expectations."
                },
                {
                  strong: "The design work was often about drawing a safe boundary.",
                  text: " Users needed enough control to do their jobs while the system prevented unsupported inputs, hidden data loss, broken sync, and accidental access."
                }
              ]
            },
            {
              type: "screen-grid",
              screens: [
                {
                  label: "ACCESS",
                  title: "Permissions followed the action",
                  body: "Controls became more granular as the platform moved into larger and more specialized teams.",
                  notes: ["Order export separate from SSRM", "Discount and customer deletion permissions", "Attribute-level create, update and delete rules"]
                },
                {
                  label: "FORMAT",
                  title: "Client data kept its own language",
                  body: "Numbering, addresses, tags, product fields, and ERP values needed configurable presentation and input rules.",
                  notes: ["Custom prefix, suffix and starting sequence", "Separate billing and shipping configuration", "Read ERP-only values; constrain new inputs"]
                },
                {
                  label: "SYNC",
                  title: "Integration state became visible",
                  body: "When external systems failed, teams needed to see what happened and recover without waiting for engineering.",
                  notes: ["Last-sync status and failure reason", "Manual retry and communication tracker", "Order-source filters"]
                },
                {
                  label: "CONNECT",
                  title: "One UI, many systems of record",
                  body: "The product connected orders, customers, products, inventory, invoices, shipments, and payments across different integration models.",
                  notes: ["NetSuite, Business Central and QuickBooks", "FTP, S3, Shopify, Fishbowl and open APIs", "Tenant switcher and offline/online continuity"]
                }
              ]
            },
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "The release trail"
            },
            {
              type: "eyebrow",
              text: "INTERNAL RELEASE ARCHIVE / JUNE 2024—SEPTEMBER 2025"
            },
            "The archive is useful because it shows the product as a sequence of operational decisions rather than a polished final screen. This ledger preserves the concrete release detail while the surrounding chapters explain the design argument.",
            {
              type: "screen-grid",
              screens: [
                {
                  label: "JUN 2024",
                  title: "The configurable foundation",
                  body: "The platform broadened the order model and the controls around it.",
                  notes: ["Cart grouping, signatures and shipment status", "Dynamic product cards and modifiers", "Multi-client reps, customer CRUD and address configuration", "Worldpay, QuickBooks, Shopify, NAV and open APIs"]
                },
                {
                  label: "AUG 2024",
                  title: "Storefront, payments and offline maturity",
                  body: "WizShop launched while WizPay and field-sales workflows became more production-ready.",
                  notes: ["First WizShop launch and tenant branding", "Finix migration, direct payment, pre-auth and L3", "Customer insights and opportunity scoring", "Offline auto-sync, backups and new offline capabilities"]
                },
                {
                  label: "LATE AUG 2024",
                  title: "Operational visibility",
                  body: "Release work made communication, ownership, customization, and integration health easier to follow.",
                  notes: ["Email trigger and recipient system", "Written by/for and order tags", "SKU-level modifiers and cart editing", "Sync status, pre-login shop and sales-list redesign"]
                },
                {
                  label: "FEB 2025",
                  title: "Consolidating the operating system",
                  body: "Navigation, data tables, offline work, storefront retention, and payment tooling moved together.",
                  notes: ["SSRM custom views, filters and new navigation", "Data on device and download manager", "Reordering, abandoned carts and assisted buying", "Recurring payments, receipts and PCI tokenization"]
                },
                {
                  label: "APR 2025",
                  title: "Speeding up the rep",
                  body: "The release centered on working multiple deals, acting from AI, and keeping commerce moving offline.",
                  notes: ["Multi-cart and discount engine", "Kai search, actions, reporting and smart forms", "Scanning, physical count and offline cards", "ACH, PayFabric, Fortis and PCI vault support"]
                },
                {
                  label: "MAY 2025",
                  title: "Customer intelligence and self-serve systems",
                  body: "The customer record became a more useful preparation and follow-up surface.",
                  notes: ["Customer dashboard, CRM tasks, activities and notes", "Kai summaries and regional recommendations", "Bulk product actions, PIM and WizShop leads", "PDF template builder, data model and infrastructure work"]
                },
                {
                  label: "AUG 2025",
                  title: "Removing everyday friction",
                  body: "Weekly releases targeted search, permissions, printing, shipping accuracy, configuration, and product data.",
                  notes: ["Contextual cart search and customer/contact actions", "ERP value handling, export permission and shipping recalculation", "Offline PDF/Bluetooth print and label controls", "Left Bank builder, PIM and image import/export"]
                },
                {
                  label: "SEP 2025",
                  title: "Making the system easier to clean and adapt",
                  body: "The final archived release simplified destructive actions, identifiers, repeat work, and cross-device search.",
                  notes: ["Delete orders from any status and manage users", "Custom order numbering and PIM inventory editing", "Copy cart and enhanced customer search", "Tenant-specific ordering, pricing, file and payment rules"]
                }
              ]
            },
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "Evidence, outcomes, and what still needs attribution"
            },
            {
              type: "screen-grid",
              screens: [
                {
                  label: "PAYMENTS",
                  title: "11 customers",
                  body: "Recorded as live on Finix in the August 2024 company release update.",
                  notes: ["Dated company evidence", "Validate source and design attribution"]
                },
                {
                  label: "STOREFRONT",
                  title: "$130K+ in orders",
                  body: "Reported for the first WizShop client after launch in the August 2024 update.",
                  notes: ["Client-specific outcome", "Confirm public-use permission"]
                },
                {
                  label: "PERFORMANCE",
                  title: "70% faster cart loading",
                  body: "The release archive also records user-database calls falling from roughly 300 to 50 per minute.",
                  notes: ["Engineering-owned measure", "Connect only to relevant design decisions"]
                },
                {
                  label: "ENABLEMENT",
                  title: "4× template build speed",
                  body: "The PDF template tool was reported to remove ₹6.3L per year in licensing cost; separate infrastructure work reported about 35% lower non-production cost.",
                  notes: ["Company-release evidence", "Do not present as personal impact without proof"]
                }
              ]
            },
            {
              type: "quote",
              text: "The value of the archive is not the number of features. It is the evidence that the design had to keep working as the product absorbed more states, more clients, more surfaces, and more responsibility."
            },
            {
              type: "small-note",
              text: "DRAFT SOURCE NOTE — Populated from an internal release-email archive. Before publishing: remove employee addresses and confidential client details; replace any source placeholders; verify personal ownership, dates, metrics, and permissions for every claim."
            },
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "Visual systems and the work around the product"
            },
            {
              type: "red-columns",
              columns: [
                {
                  strong: "The work did not stop at core product screens.",
                  text: " Product visuals, marketing assets, system images, and reusable visual treatments helped the platform feel more complete across customer touchpoints."
                },
                {
                  strong: "I worked through a lot of surrounding visual systems as well.",
                  text: " These product and marketing visuals sat around the main platform work and helped the product feel more consistent across touchpoints."
                }
              ]
            },
            {
              type: "media-row",
              variant: "carousel-strip",
              size: "peek",
              columns: 3,
              caption: " ~ Visuals and marketing systems",
              items: [
                {
                  src: "/assets/new/wizcommerce-frame32/visuals-grid-111.png",
                  alt: "Visual systems screen 111"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/visuals-grid-222.png",
                  alt: "Visual systems screen 222"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/visuals-grid-333.png",
                  alt: "Visual systems screen 333"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/visuals-grid-444.png",
                  alt: "Visual systems screen 444"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/visuals-grid-555.png",
                  alt: "Visual systems screen 555"
                },
                {
                  src: "/assets/new/wizcommerce-frame32/visuals-grid-666.png",
                  alt: "Visual systems screen 666"
                }
              ]
            },
            {
              type: "small-note",
              text: "Over time the work expanded beyond core screens into product storytelling, marketing assets, reusable visual systems, and the connective tissue that helped different teams explain what was shipping."
            }
          ]
        },
        "wiz-sales-data": {
          edition: "dispatch",
          kicker: "WIZORDER / SALES DATA",
          title: "Helping sales reps make better decisions with data",
          deck: "Simplifying B2B product cards & recommendations to surface decision-critical data for sales reps.",
          meta: ["Contribution: ~3 weeks", "WizOrder", "B2B order taking app"],
          leadCaption: "Initial product listing - WizOrder.",
          introColumns: [
            "Wizcommerce is an early-stage B2B e-commerce technology startup providing tailored marketplace solutions, inventory management, and seamless payment integrations to help retailers and brands optimize their online sales operations.",
            "Collaborated closely with product stakeholders to rapidly iterate and brainstorm solutions, while also partnering with the tech team to ensure seamless translation of designs into production."
          ],
          body: [
            {
              type: "image",
              src: "/assets/case-studies/f2MFjaGV3u8MAIXdzRO9fHE2wc.png",
              alt: "WizOrder product listing case study",
              caption: "Initial product listing - WizOrder."
            },
            {
              type: "eyebrow",
              text: "AN AI POWERED B2B ORDER TAKING APP"
            },
            "With all of the user insights/requests and a little researched it came to light that these extra parameters are crucial and play an important role for the Sales-Rep making the sale through the app.",
            {
              type: "heading",
              text: "Redesigning Product cards for better display of data at front"
            },
            "Showing more data upfront helps sales reps make faster, smarter decisions—reducing guesswork, speeding up conversations, and increasing confidence during every step of the sale.",
            "Problem: Reps not being able make quick informed decisions about what products to upsell in calls due to unavailability of relevant information on product card.",
            {
              type: "list",
              items: [
                "Stock availability.",
                "Restock timelines.",
                "Product tags.",
                "Inventory flags.",
                "Variant details."
              ]
            },
            {
              type: "image",
              src: "/assets/case-studies/mjRUy3TMmhpKrNoGXxSz8YAttg0.png",
              alt: "Before and after mobile product cards",
              caption: "Before and after mobile cards."
            },
            "Also the stepper action was made clearer with this, ie - if there were variants existing for a product, Add to Cart would first redirect them to a stepper, where the sales reps would then pick what variant to choose. This action was given more justice by iterating the CTA copy itself.",
            {
              type: "heading",
              text: "Redesigning for Data Visibility"
            },
            "Goal: Redesign the previously bought cards with product tags with relevant structure across devices - tabs, mobile and web views.",
            {
              type: "image",
              src: "/assets/case-studies/D14InoE2s4mg8mig0KcPU2ECg.png",
              alt: "Previously bought cards across devices",
              caption: "Two different variations of previously bought cards."
            },
            {
              type: "video",
              src: "/assets/case-study-videos/BwRAO1OSGcYos4nj7C2oVbZVnqU.mp4",
              caption: "Product listing card redesign interaction."
            },
            {
              type: "heading",
              text: "Redesigning the data propagation"
            },
            "Goal: Embed subtle, context-aware data cues within key UI components to support informed decisions in the order taking flow.",
            {
              type: "list",
              items: [
                "Similar component strip visualising total quantities added as well as other product details.",
                "Product detail page, a detailed description of the product, enabling user to retrieve information about its properties and stock availability.",
                "Variant bottom sheets for mobile and tab.",
                "Tab presentation of cart.",
                "Product detail pages with the updated inventory chip."
              ]
            },
            {
              type: "image",
              src: "/assets/case-studies/YDdrpKIBIJpXs3NXrnDsMyiRCs.png",
              alt: "Redesigned components for mobile product data",
              caption: "Redesigned components (mobile)."
            },
            {
              type: "image",
              src: "/assets/case-studies/SyyORqB93SswjjJG6q71NSLGAcs.png",
              alt: "Recommended rails exploration",
              caption: "Rethinking grouping pattens for B2B."
            },
            {
              type: "video",
              src: "/assets/case-study-videos/i9aHmYoD3N1Ot6g1bRiPvQEAs.mp4",
              caption: "Variant bottom sheets and mobile data propagation."
            },
            {
              type: "video",
              src: "/assets/case-study-videos/x11yyhNBdVBuDR6TlR9u7cx3mQA.mp4",
              caption: "Variant detail interaction."
            },
            {
              type: "heading",
              text: "Rethinking the product recommendations rails"
            },
            "Recommendation rails are dynamic product suggestions powered by AI—tailored to user behaviuor, purchase patterns, or product context.",
            "Initially these were an array of product cards linearly stacked through, the sales reps then had a choice to upsell these products to retailer customers.",
            "These grouping patterns are frequently used in B2C settings, where it facilitates a bigger cart size either by suggesting complementary category types or just upselling more of the same.",
            {
              type: "image",
              src: "/assets/case-studies/LITf2qV3BudTI6j9R0EKNZRw8.png",
              alt: "WizOrder product recommendations rail screen",
              caption: "Recommended rails."
            },
            {
              type: "image",
              src: "/assets/case-studies/eA59Pqsg8D5s5ENx5SmSnk9sbs.png",
              alt: "WizOrder product recommendations grouping exploration",
              caption: "The problem identification."
            },
            {
              type: "image",
              src: "/assets/case-studies/YT4RV61yi2NWptKe5hdAvL2bI.png",
              alt: "WizOrder B2B recommendation grouping patterns",
              caption: "Grouping patterns and decision making made easier."
            },
            {
              type: "image",
              src: "/assets/case-studies/62oPsO639ObwEOKMcUfIu9Nw6jo.png",
              alt: "WizOrder redesigned recommendation rails",
              caption: "Redesigned rails."
            },
            {
              type: "image",
              src: "/assets/case-studies/td5wQCphnrWbGJsPM0zOLlbQ6k.png",
              alt: "WizOrder redesigned rail detail",
              caption: "Rethinking grouping pattens for B2B."
            },
            {
              type: "image",
              src: "/assets/case-studies/DDrRUrz1RWwPMSEbtSSdIf7BT4.png",
              alt: "WizOrder redesigned product data view",
              caption: "Redesigning for Data Visibility."
            },
            {
              type: "image",
              src: "/assets/case-studies/40jiGsguVDmfxdFXalA24RUhd0Y.png",
              alt: "WizOrder product detail page data visibility",
              caption: "Product detail pages with the updated inventory chip."
            },
            {
              type: "video",
              src: "/assets/case-study-videos/5SAMxID24o6X18FSLqFTeE3Uc.mp4",
              caption: "Recommendations rail interaction."
            },
            {
              type: "image",
              src: "/assets/case-studies/McUrLVhSU1cq2sfd8mIdushhb8.png",
              alt: "WizOrder variant bottom sheet data propagation",
              caption: "Variant bottom sheets (mobile and Tab)."
            },
            {
              type: "image",
              src: "/assets/case-studies/zm1oGOVKsMbTYn3MqlF2n0FiUA.png",
              alt: "WizOrder cart and product quantity data strip",
              caption: "Similar component strip visualising total quantities added as well as other product details."
            },
            {
              type: "image",
              src: "/assets/case-studies/bwgLKLSS6QzAfOwXLP5De3p1mTQ.png",
              alt: "WizOrder tab cart presentation",
              caption: "Tab presentation of cart."
            },
            {
              type: "image",
              src: "/assets/case-studies/zXDL82lRB7csbtjbLEvd0QbZ7o.png",
              alt: "WizOrder final learnings and impact visual",
              caption: "Learnings and impact."
            },
            {
              type: "heading",
              text: "Learnings and impact"
            },
            "Functioning at the core of a 8 member product team, assisting devs and handling conversations with product stakeholders - doing it all seems a lil overwhelming, but surely rewarding enough to see things being implemented and making the way to the screens and business and its ethics.",
            "What we build here might not be perfect at the start but surely it has come a long way, understanding the market needs and constantly iterating."
          ]
        },
        "wiz-email-flows": {
          edition: "field-note",
          kicker: "WIZORDER / COMMUNICATION",
          title: "Anything and everything about automating emails",
          deck: "Communication through email shapes the B2B wholesale experience in WizOrder.",
          meta: ["Email input method", "Email touchpoints", "Org settings"],
          leadCaption: "Email nudges in user journey of a sales rep.",
          introColumns: [
            "Communication through email shapes the B2B wholesale experience in WizOrder.",
            "Improving the existing methods and building a scalable, org-wide system for handeling emails more efficiently."
          ],
          body: [
            {
              type: "image",
              src: "/assets/case-studies/7pNOxoU2UIQLghgLPRTMAgwU1AE.png",
              alt: "WizOrder email automation journey",
              caption: "Email nudges in user journey of a sales rep."
            },
            {
              type: "eyebrow",
              text: "WIZORDER - AN ALL IN ONE B2B ORDER TAKING APP"
            },
            "In the B2B wholesale space, companies often rely on external sales reps and multiple vendors to manage orders.",
            "A typical deal involves 8–12 email exchanges, and well-timed email nudges are critical.",
            {
              type: "heading",
              text: "Rethinking the Email Input method"
            },
            "Problem: Entering the email flow creates a false sense of completion and lacks clear feedback, causing users to skip adding the email. This leads to skipped logs of mails and unintended communication gaps.",
            "Goal: Improve the email input experience to prevent ambiguity around whether entries have been successfully added.",
            "Typing a valid email creates the impression that it’s been added, but the need to click a separate “+ Add” action is often missed.",
            {
              type: "list",
              items: [
                "Introduced inline email suggestions.",
                "Explicit “+ Add” CTA with implicit feedback.",
                "Minimized total clicks."
              ]
            },
            {
              type: "image",
              src: "/assets/case-studies/75yucgvtB4hxLkV9N4mgK74PSQ.png",
              alt: "Redesigned email input method",
              caption: "Redesigned Input method."
            },
            {
              type: "heading",
              text: "Rethinking Email Touchpoints"
            },
            "Problem: Email recipients were frequently left out during quote and order creation resulting in missed updates, fragmented visibility, and broken communication loops.",
            "This led to broken communication loops across the organization, causing key stakeholders to miss out on important deal information and updates.",
            {
              type: "quote",
              text: "The UX correction of this email flow did not come easy at first."
            },
            {
              type: "list",
              items: [
                "Merely enhancing the visual hierarchy did no good, cause there was no friction introduced in the flow.",
                "Here we did provide a considerable amount of friction but this still wasn't seamless but more irritating.",
                "Turning email checkpoint into a necessary and intuitive step, ensuring it's never missed without adding unnecessary friction."
              ]
            },
            {
              type: "image",
              src: "/assets/case-studies/6BIBiTr3GZQDFXe6IvdilhHDs.png",
              alt: "Redesigned UX for order and quote submission",
              caption: "Redesigned UX for order / quote submission."
            },
            "Prefilled emails are tucked behind a secondary layer, keeping the interface clean while giving reps full control when they choose to engage with it.",
            "Sales reps see relevant email suggestions instantly thus helping them move faster without having to look up or type each contact.",
            {
              type: "image",
              src: "/assets/case-studies/Wb0UEhRUMQUIE2mktg9AY8oKdA.png",
              alt: "Nested sheet interaction for web and mobile",
              caption: "Nested sheet interaction for web and adapting the redesigned email flow for mobile."
            },
            {
              type: "video",
              src: "/assets/case-study-videos/cxxkp77wWnMZYIqpdbmRY2wmRzU.mp4",
              caption: "Redesigned email input method interaction."
            },
            {
              type: "video",
              src: "/assets/case-study-videos/SxciRrsy5tBoUtVNs6ik6Wb3QSM.mp4",
              caption: "Redesigned UX for order / quote submission interaction."
            },
            {
              type: "video",
              src: "/assets/case-study-videos/A0YyjmS9ykYFg1kF1tUgE0SHzRQ.mp4",
              caption: "Nested sheet interaction for web."
            },
            {
              type: "heading",
              text: "Org settings for emails"
            },
            "Building a scalable email management system is challenging when different clients keep asking for custom workflows.",
            "Some teams want automatic emails for every transaction to ensure clear communication with customers, while others may prefer to minimise email traffic.",
            "Goal: Create org setting for handeling multiple email triggers and recipient lists.",
            {
              type: "heading",
              text: "Email catagorization"
            },
            "61 unique email triggers. Then further on we divided these email triggers on the basis of the modules they were assosiated. For example - Payments, import-export, integration emails etc.",
            {
              type: "image",
              src: "/assets/case-studies/7eYazQ2i9NhdtTZ7KoR6AAvOQ.png",
              alt: "Settings home page for emails",
              caption: "Settings home page for emails."
            },
            {
              type: "heading",
              text: "Trigger handelling"
            },
            "Since back then it was not possible for us to have an in-line HTML editor for emails, we used the template structures for the same.",
            {
              type: "heading",
              text: "The concept of User buckets"
            },
            "Grouping concept need: role-based grouping system.",
            {
              type: "image",
              src: "/assets/case-studies/ZQai9EjZdtNRPj0E8lLhsRNBHc.png",
              alt: "Recipient selection based on user buckets",
              caption: "Recipient selection state based on user buckets."
            },
            {
              type: "heading",
              text: "What's next?"
            },
            "We’ve started building and iterating the remaining link in the ecosystem, an HTML editor enhanced with a layer of AI. The idea extends to automatically retrieving the required data based on the subject and prompt, generating a structured email draft ready for publishing.",
            {
              type: "video",
              src: "/assets/case-study-videos/h7mdlJOFPaJKVACROrgpKU8SODw.mp4",
              caption: "Future integrations with AI and HTML editor."
            },
            {
              type: "image",
              src: "/assets/case-studies/dP22tW3uwxY8CYZpcevc5GB8RFw.png",
              alt: "Future integrations with AI and HTML editor",
              caption: "Future integrations with AI and HTML editor."
            },
            {
              type: "image",
              src: "/assets/case-studies/AaJdbGZvSQV0Bg6XDlr3sQ6JE.png",
              alt: "WizOrder email flow supporting screen",
              caption: "Redesigned Input method."
            },
            {
              type: "image",
              src: "/assets/case-studies/cQoRwvFm4gv6SyYsIev2x6jqBU.png",
              alt: "WizOrder quote and order email touchpoint screen",
              caption: "Observe the current order creation journey for a sales rep."
            },
            {
              type: "image",
              src: "/assets/case-studies/OsdoaUdcg9xrPe1bWmOcwLqkA9s.png",
              alt: "WizOrder email touchpoint wall of the dead exploration",
              caption: "Wall of the dead."
            },
            {
              type: "image",
              src: "/assets/case-studies/MvJkiI3jRrOijXFdWXIB4h1Q.png",
              alt: "WizOrder redesigned email flow for mobile",
              caption: "Adapting the redesigned email flow for mobile."
            },
            {
              type: "image",
              src: "/assets/case-studies/2KPskyMzYLiLOMgtBkRAuKR8iDU.png",
              alt: "WizOrder email trigger handling screen",
              caption: "Trigger handelling."
            },
            {
              type: "image",
              src: "/assets/case-studies/7QYmgy2CYWMSwnesHoBlksi19Yw.png",
              alt: "WizOrder user buckets grouping screen",
              caption: "The concept of User buckets."
            },
            {
              type: "image",
              src: "/assets/case-studies/zXDL82lRB7csbtjbLEvd0QbZ7o.png",
              alt: "WizOrder email case study closing visual",
              caption: "Learnings and impact."
            },
            {
              type: "heading",
              text: "Learnings and impact"
            },
            "What started as a simple email field redesign grew into a robust communication architecture."
          ]
        },
        "uber-kids": {
          edition: "case-file",
          kicker: "UBER KIDS / CHILD ONBOARDING",
          title: "Designing a safer Uber Kids onboarding",
          deck: "A child-facing onboarding concept that explains who is in control, where the child can go, and what to do when a ride feels unsafe.",
          meta: ["Mobile onboarding", "Safety", "Family accounts"],
          leadImage: {
            type: "image",
            src: "/assets/new/uber-kids-lead.svg",
            alt: "Uber Kids onboarding, places, safety code, and SOS screen previews",
            caption: "Figma Section 9 frames: invite, parent-approved places, safety code, and SOS help."
          },
          leadCaption: "Figma Section 9 frames: invite, parent-approved places, safety code, and SOS help.",
          introColumns: [
            "Section 9 frames Uber Kids as a child-facing flow that needs to feel safe without becoming scary. The child is invited by a parent or guardian, then taught the rules of the account in plain language.",
            "The design system has to do two things at once: make the child feel empowered to request rides, and make the parent's control visible enough that the boundaries feel trustworthy."
          ],
          body: [
            {
              type: "image",
              src: "/assets/new/uber-kids-lead.svg",
              alt: "Uber Kids four screen flow preview",
              caption: "A compact map of the onboarding arc from account invite to help escalation."
            },
            {
              type: "asset-grid",
              caption: "Extracted PNG assets from Figma Section 9.",
              items: [
                {
                  src: "/assets/new/uber-kids/invite-hero.png",
                  alt: "Child entering an Uber ride illustration",
                  label: "Invite hero"
                },
                {
                  src: "/assets/new/uber-kids/map-bengaluru.png",
                  alt: "Bengaluru map tile used in Uber Kids location screens",
                  label: "Approved places map"
                },
                {
                  src: "/assets/new/uber-kids/icon-approve.png",
                  alt: "Approved trip request icon",
                  label: "Trip approval"
                },
                {
                  src: "/assets/new/uber-kids/icon-pay.png",
                  alt: "Payment card icon",
                  label: "Parent pays"
                },
                {
                  src: "/assets/new/uber-kids/icon-track.png",
                  alt: "Tracking location pin icon",
                  label: "Live tracking"
                },
                {
                  src: "/assets/new/uber-kids/place-home.png",
                  alt: "Home place icon",
                  label: "Home"
                },
                {
                  src: "/assets/new/uber-kids/place-swimming.png",
                  alt: "Swimming place icon",
                  label: "Swimming"
                },
                {
                  src: "/assets/new/uber-kids/place-music-class.png",
                  alt: "Music class place icon",
                  label: "Music class"
                }
              ]
            },
            {
              type: "eyebrow",
              text: "ONBOARDING THESIS"
            },
            "This onboarding sets the tone for a safe, clear, and empowering experience: guiding the child with simple visuals and direct actions under parental setup.",
            "The selected Figma section shows four core moments. First, the child accepts an invite from a parent or guardian. Next, the flow explains that only parent-added places are available. Then it teaches the child to check a safety code before entering the car. Finally, it gives a clear help state with parent call and SOS language.",
            {
              type: "screen-grid",
              screens: [
                {
                  label: "Invite",
                  title: "You're invited to Uber kids",
                  body: "Accept the invite from Nancy Drew to get your Uber Kids account and use it with your parent or guardian.",
                  notes: ["Approve trip requests", "Pay for trips", "Track requests in real time"]
                },
                {
                  label: "Boundaries",
                  title: "Go to places your parent adds",
                  body: "Only your parent can choose where you can ride.",
                  notes: ["Home", "Swimming", "Music class"]
                },
                {
                  label: "Pre-ride safety",
                  title: "Check the safety code with your driver",
                  body: "Only get in the car if the code matches.",
                  notes: ["Safety code", "Match before ride starts", "XXXX"]
                },
                {
                  label: "Escalation",
                  title: "Need help? Call your parent or SOS",
                  body: "You can call if you feel unsafe or need help anytime.",
                  notes: ["Unexpected route", "Call Mom", "Get started"]
                }
              ]
            },
            {
              type: "heading",
              text: "The child should understand the agreement before the product asks for trust."
            },
            "The first screen is not just an invite acceptance. It is the contract. It states who invited the child, what kind of account is being created, and what the parent can do. The three permission cards make parental control concrete: approve trip requests, pay for trips, and track requests in real time.",
            "The kid badge is small but important. It makes the account mode visible inside the headline instead of hiding the premise in body copy.",
            {
              type: "heading",
              text: "Parent-approved places turn maps into boundaries."
            },
            "The second screen changes the mental model from open-ended ride booking to a set of safe destinations. Places like Home, Swimming, and Music class are framed as parent-added objects, so the child learns that the product is usable, but not unrestricted.",
            "The purple route line gives the screen a playful sense of movement, while the copy keeps the rule simple: only your parent can choose where you can ride.",
            {
              type: "heading",
              text: "Safety instructions need to be remembered under pressure."
            },
            "The safety-code step is deliberately concrete. It does not ask the child to understand risk models or ride verification abstractions. It gives one test: match this code with the driver before the ride starts.",
            "The code block sits over the map like a field prompt, making the verification moment feel part of the ride rather than a separate warning modal.",
            {
              type: "heading",
              text: "The emergency state should feel available, not hidden."
            },
            "The final screen makes help legible. If the route feels unexpected or unsafe, the child sees a direct parent-call action and clear SOS language. The screen is direct enough for a stressful moment without overloading the child with choices.",
            {
              type: "list",
              items: [
                "Child-friendly copy with one clear idea per screen.",
                "Parent authority shown as a helpful safety layer, not a threat.",
                "Known-place constraints before the child begins requesting rides.",
                "Safety-code education before the first ride moment.",
                "A visible help path for unexpected-route scenarios."
              ]
            },
            {
              type: "quote",
              text: "The product should not simply tell the child that the ride is safe. It should teach the child how safety will show up."
            }
          ]
        },
        "kriyadex": {
          edition: "dispatch",
          kicker: "KRIYADEX / FREELANCE",
          title: "Logo design, branding, and a V0-MVP for KriyaDex",
          deck: "A compact freelance build from Jan 2023: brand direction, logo language, and the first product shell for KriyaDex.",
          meta: ["Freelance", "Logo design", "Branding"],
          leadCaption: "KriyaDex brand mark and wordmark.",
          introColumns: [
            "KriyaDex was a compact freelance case: logo design, branding, and a first MVP pass.",
            "The work stays intentionally small but complete, moving from identity choices into a product shell."
          ],
          body: [
            {
              type: "image",
              src: "/assets/kAPxEEfqmcF1Prw6YnmQHHaYVpY.png",
              alt: "KriyaDex logo",
              caption: "KriyaDex brand mark and wordmark."
            },
            {
              type: "eyebrow",
              text: "V0-MVP of KriyaDex - 2023 Jan"
            },
            "KriyaDex sits in the Play section of the current portfolio as a compact freelance case: logo design, branding, and a first MVP pass. The work is intentionally shown as a small but complete identity-to-interface exercise.",
            {
              type: "list",
              items: [
                "Defined the early visual identity and logo direction.",
                "Created a brand base that could stretch into product screens.",
                "Held the MVP as a fast, useful first expression instead of a heavy launch."
              ]
            }
          ]
        },
        "farevv": {
          edition: "margin-note",
          kicker: "FAREVV / ANTI-PORTFOLIO",
          title: "The next fashion revolution",
          deck: "An anti-portfolio entry: less polished case-study, more directional note for a fashion product idea still asking to become real.",
          meta: ["Anti-portfolio", "Fashion", "Concept"],
          leadCaption: "Fashion product flow exploration from the portfolio export.",
          introColumns: [
            "Farevv is a fragment around the next fashion revolution, held as a directional note rather than a fully polished case study.",
            "The useful tension sits between commerce, identity, and fashion tooling."
          ],
          body: [
            {
              type: "image",
              src: "/assets/4tXbamARId1GtIkEXTPtvkZgry8.png",
              alt: "Fashion product flow screen",
              caption: "Fashion product flow exploration from the portfolio export."
            },
            {
              type: "eyebrow",
              text: "Farevv."
            },
            "Farevv. is listed as an anti-portfolio piece on the current site: a fragment around the next fashion revolution. For now the newspaper sheet keeps that mood intact rather than pretending the work is more finished than it is.",
            {
              type: "quote",
              text: "The next fashion revolution."
            },
            "The useful direction here is the tension between commerce, identity, and fashion tooling: a product surface that can feel opinionated without becoming over-explained."
          ]
        },
        "curo": {
          edition: "prototype",
          kicker: "CURO / MVP IN PROGRESS",
          title: "Your AI Learning Companion",
          deck: "A learning-product MVP around paths, resources, and AI-guided understanding.",
          meta: ["MVP", "AI learning", "Edtech"],
          leadCaption: "Resource discovery and learning-path surface.",
          introColumns: [
            "Curo is framed as an AI Learning Companion: a product that helps learners move from curiosity into a structured path.",
            "The case-study header leads with the learner promise rather than a generic systems label."
          ],
          body: [
            {
              type: "image",
              src: "/assets/lREVKnbZDxTdgCdlTMAcEQXvxE.png",
              alt: "Curo learning resources interface",
              caption: "Resource discovery and learning-path surface."
            },
            {
              type: "eyebrow",
              text: "MVP in progress"
            },
            "Curo. is framed on the current site as an AI Learning Companion. The case-study header should therefore lead with the learner promise rather than a generic systems label.",
            {
              type: "image",
              src: "/assets/QZDLAFRGxs00xycurq0DyWxc.png",
              alt: "Curo generative AI learning path",
              caption: "A generated learning path view for Generative AI."
            },
            {
              type: "list",
              items: [
                "Help learners move from a topic to a structured path.",
                "Bring useful resources into the flow instead of sending people searching.",
                "Use AI as a companion for orientation, not just as a chat layer."
              ]
            }
          ]
        }
      } satisfies ProjectsMap;
