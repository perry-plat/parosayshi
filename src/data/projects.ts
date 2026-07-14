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
          kicker: "CASE STUDY",
          title: "WizCommerce",
          deck: "",
          meta: ["WizPay", "WizAI", "Modifiers", "Visual systems"],
          leadImage: {
            type: "image",
            src: "/assets/new/wizcommerce-frame32/hero-dashboard.png",
            alt: "WizCommerce product dashboard and commerce operations interface",
            caption: " ~ Wizcommerce , 2023-2025"
          },
          leadCaption: " ~ Wizcommerce , 2023-2025",
          introColumns: [
            "Over the last 2 years I have had the liberty and opportunity to touch almost the entire product pipeline from ideation to product thinking to building this and then figuring out the marketing strategies with the respective teams.",
            "WizCommerce became a playground to shape payment systems, AI surfaces, modifiers, visuals, and a lot more tiny product decisions that made wholesale software feel more usable."
          ],
          body: [
            {
              type: "divider"
            },
            {
              type: "heading",
              text: "WizPay"
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
              type: "divider"
            },
            {
              type: "heading",
              text: "Visuals and lot more."
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
              text: "With time i had the liberty and opportunity to touch almost the entire product pipeline from ideation to product thinking to building this and then figuring out the marketing strategies with the respective."
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
