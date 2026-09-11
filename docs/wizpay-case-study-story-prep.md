# WizPay case-study preparation

Prepared 9 September 2026. Research and editorial proposal, not approved portfolio copy. No site changes made.

## Recommendation

Lead with WizPay as a focused case study about turning a payment action into a reusable system for wholesale workflows. Assess CRM as a separate foundations story once Parth identifies the surfaces and decisions he owned. Keep the wider WizCommerce collection as an index of breadth.

WizPay currently has the clearest combination of an origin, a design mechanism, UI examples, and previously published outcome claims. CRM has potential to show information architecture and early product judgment, but its authorship and timeline are less established in the material reviewed.

## What the sources contribute

### Old portfolio

[WizCommerce collection](https://parthjha.framer.website/wiz-collection-2#wizpay)

The useful narrative is the evolution from Collect Payment to reusable payment blocks. The page includes invoice/payment-method compositions, recurring payments, links, authorization/void, refunds, and a production-video carousel. It reports 120+ customers and $5.3M+ monthly payment volume; these are portfolio claims, not independently verified metrics.

Editorial assessment: the page establishes breadth but spends too long on general industry problems before showing the design mechanism. The isolated UI crops demonstrate consistency without explaining exactly what stayed fixed, what changed, or which alternative was rejected. The production clips need a stated task and takeaway. The impact figures need dates and definitions.

Keep the origin, modularity, concrete UI and shipped evidence. Replace the six broad problem cards with a short situation the reader can follow. Avoid sweeping claims that conventional payment services cannot support wholesale; describe the actual gap in the team's workflow.

### Live WizPay product page

[WizPay](https://wizcommerce.com/product/b2b-payment-solution/)

The current marketing page emphasizes payments connected to wholesale orders: stored cards, staged collection, payment links, scheduling, and visibility. It helps explain the commercial context and what the product promises today. It does not establish which features Parth designed, when they shipped, or the effects of his decisions.

Editorial use: introduce the user problem in ordinary language, then use historical designs and contribution evidence to tell the design story. Do not reproduce the feature catalogue or comparison table as a case study.

### Official workflow documentation

[Payment workflows](https://knowledge.wizcommerce.com/payment-workflows) and [Payment methods](https://knowledge.wizcommerce.com/payment-methods)

Current documentation describes collection from order, customer and WizPay contexts, with shared payment methods. It also documents partial payments and statuses. This is useful corroboration for the idea of a common flow across entry points. The articles are dated July 2026, so they cannot establish historical implementation or authorship by themselves.

## Proposed narrative

Working title: **WizPay — One payment flow, many wholesale realities**

Alternative, closer to the original story: **From Collect Payment to WizPay**.

Draft opening, subject to contribution confirmation:

> A wholesale order doesn't always get paid in one go. There may be a deposit, a balance due later, or a refund after the order changes. I worked with the WizCommerce team to grow a simple payment action into a set of reusable flows that could handle these different situations.

The central question: **How could we support more payment scenarios while keeping the experience familiar?**

This is an editorial interpretation of the available material, not a recovered research finding. Confirm it against the actual project decisions.

## Chapter and media plan

| Chapter | Reader takeaway | Evidence/media | Still needed |
| --- | --- | --- | --- |
| 1. The product in use | Understand what WizPay lets someone do | One short, labelled production flow, followed by a transaction overview | Inspect all clips and choose a complete representative task |
| 2. Where the button stopped being enough | Understand the trigger for expanding scope | Original Collect Payment UI alongside two or three actual requirements | Original screen and the first requirement that broke the simple flow |
| 3. Finding the common structure | Understand the key design decision | Annotated base flow showing customer/context, amount, method and confirmation where supported by actual designs | Base wireframe, field/state map, alternatives considered |
| 4. One structure, different situations | See the system adapt | Three comparisons: collect now; schedule or send a link; authorize/void or refund | Pick three owned examples; explain which blocks and actions change |
| 5. Knowing what happened next | See operational clarity beyond submission | Transaction dashboard plus a specific payment/detail state | Explain actual status definitions, follow-up actions and any iteration |
| 6. The same task across devices | Understand a responsive decision | Existing desktop/mobile transaction media | Identify what was prioritized, moved or omitted on mobile and why |
| 7. What shipped and what changed | Establish contribution and result | Dated rollout summary, customer or team evidence, one contextual metric | Metric date/scope, responsibilities, collaborators and actual lessons |

Use the transaction dashboard once to establish context and again only if an annotated detail teaches something new. Avoid three nearly identical dashboard shots in sequence. Move the isolated block collage after the base-flow explanation so readers know what they are comparing.

For the variants, use captions that explain an interaction decision, not simply name a feature. Template: “For [situation], we kept [shared element] and changed [specific element], because [observed constraint].” Fill only from actual recollection or design records.

## Existing local material

Available under `public/assets/new/wizcommerce-frame32/uploads/`:

- `wizpay-transactions-dashboard.png`
- `wizpay-product-surface.png`
- `wizpay-responsive-transactions.png`
- `wizpay-carousel-1.png` through `wizpay-carousel-4.png`

`src/data/projects.ts` already references these assets and a production-video carousel. Their current labels identify recurring setup, upcoming status, refund selection and payment methods. Inspect images and full clips before treating those labels as sufficient evidence of their behavior. This research pass inspected the old page's invoice/method composition visually; it did not validate the complete video flows.

## CRM as a separate story

[Current WizCRM page](https://wizcommerce.com/product/ai-crm-for-distributors-and-wholesalers/)

The current page connects account context, follow-ups, deals and ordering, with AI assistance. That makes a possible foundations story: **Giving sales reps a useful starting point for every customer conversation.**

Candidate sequence, conditional on Parth's ownership: fragmented customer context → account structure → activity/history → next action → connection to sales work → implementation handoff and evolution.

The repo mentions customer dashboards, CRM tasks, activities and notes, but that is a lead for investigation rather than proof of scope. Do not equate the notification task-manager cards in the old collection with the later CRM task-management product. Do not attribute the current AI layer or full launch to foundational design work without confirmation.

If the work was mainly early structure, present it directly as CRM foundations. Strong early-stage work can be supported by the decisions, alternatives and handoff; it does not require an invented shipped-result story.

## Contribution and outcome checks

- Identify which payment flows Parth personally designed, which were shared, and the period covered.
- Ask for one real tradeoff: what simpler or broader alternative was considered, and why the chosen approach won.
- Reconcile $5.3M+ monthly volume in the old portfolio with $2M+ in the current experience copy. These could describe different dates or scopes; neither should silently replace the other.
- Establish whether 120+ refers to WizPay customers, all WizCommerce customers, or another denominator.
- Keep company ARR separate from payment volume and design-specific outcomes.
- Use current product pages as present-day context. Use dated designs, releases and recollection to establish the historical story.

## Next editorial input

The most useful raw material is an informal account of one turning point: the initial flow, the requirement that made it insufficient, what Parth changed, and what the team learned. That will make the middle of the case study specific. CRM additionally needs a list of owned surfaces and dates before its outline can become firm.
