# WizPay — Figma source map

Reviewed 9 September 2026. Source: [Payments (Copy)](https://www.figma.com/design/PXhze2kkqINT375gFj0DdO/Payments--Copy-?node-id=8867-17942).

## Coverage and evidence

Navigated the file's 33 page entries and inspected their visible layer inventories; expanded selected payment branches. This is a page-level map, not an exhaustive review of every nested frame or prototype interaction. Guest browser access worked; the Figma metadata connectors did not grant inspection access. No designs were edited.

The seven screenshots supplied by Parth are the visual evidence used in the portfolio draft. His account establishes the early design chronology. Figma names show intended scope and variants, but do not establish authorship, implementation, or shipping status. “Ready for dev” is not evidence of release. “DONOT REFER”, “DNF”, and correction labels need to remain explicit during further selection.

## Narrative recommendation

Start with the PRD question: **where should payments live?** Show the existing customer → cart → quote → order sequence, then why upfront payments and invoice relationships complicated that sequence. Follow the evolution through entry-point experiments, the first payment-method modal, layered collection, a dedicated workspace, and customer history.

The clearest structural distinction in REVAMP is between **order payments with an invoice, order payments without an invoice, and direct customer payments**. This gives the case study an organizing principle beyond a catalogue of methods. REVAMP 2 adds visible credit-memo, authorization/surcharge, and recurring-payment branches. Keep those as supporting scope until their chronology and ownership are confirmed.

## Page inventory

| Page | Observed material / editorial use |
| --- | --- |
| OLD payments | Card capture, collection, payment links, offline recording, order confirmation, buyer dashboard, refund variants. Some refund sections explicitly need correction. |
| REVAMP | Order with invoice, order without invoice, direct customer payment, authorization, customer dashboard. Contains DONOT REFER sections. Primary architecture evidence. |
| REVAMP 2 | MASTER payment details, credit memo, authorization plus surcharge, recurring payments, mobile/tablet variants. Expanded branches confirm order and customer-selection variants. |
| New | Dated October/November 2025 changes, transaction adjustment against invoices, payment terms, buyer forms. Later work; attribution not assumed. |
| Customer search and add notes | Customer/address search, notes marked final November 2025, catalogue/navigation material. Mixed scope. |
| ACH | Multiple numbered sections and tablet frames. Requires frame-level inspection before describing behavior. |
| PCI | Web groups. Requires deeper inspection; no compliance claim inferred. |
| Subscription | MASTER, REFER for, DNF groups. Status needs confirmation. |
| timezones | List stacks, November 2024 screenshots, sync-related material. Mixed scope. |
| Customer payment proto | With-order, tablet and payment frames. Useful prototype candidate. |
| DUMP | DONOT REFER. Exclude from final-design evidence. |
| Page divider | Separator entry; no independently confirmed substantive content. |
| Payments - | Card capture, direct collection, invoices, links, failed/pending/successful outcomes, tap/swipe waiting. |
| Payments new | Credits and status variants. |
| Authorisation | Ready-for-dev badge; also contains do-not-refer grouping. Verify exact final branch. |
| ✅ Direct payment | Ready-for-dev badge, direct-payment prototype, tablet, address and confirmation variants. |
| FInix - system | Fee structures, homepage restructuring, final-page groups. Integration-related context, not a demonstrated outcome. |
| EMAIL STIORY | Receipt sharing and customer details mixed with catalogue/collection work. |
| Date filter | Date-filter alternatives, imports and exports. Supporting transaction-history detail. |
| PDF - terminals | Terminal one-pager PDF reference. External/reference material. |
| future payments | Wallet/credits, collection, transactions, per-transaction notes/reference IDs, order states, web/tablet. Exploration label retained. |
| POS | Partial payment, cancellation/refund, receipts, customer switching, tap/swipe waiting and failed/pending/successful states. Strong secondary story about continuity during collection. |
| Discount handover | Cart, quote and order discounts, errors, mobile/tablet notes. Adjacent scope. |
| Cart summary - discount | Assigned-payment summary, sticky cart and discount discussions. Entry-point context. |
| Payment Proto | Order/admin/review, refund and buyer-creation flows. |
| FUture payements researcg | Wallet exploration, transaction references and refund restriction note. Research notes are not verified product rules. |
| Orchid - invoice | Invoice-adjacent imported order forms, cart summaries and PDFs. |
| Cart - quote - discount - order | Invoice design, order drafts, cart and quote discounts. Original workflow context. |
| Payments research | Assigned/unassigned payment states, preferences, admin/sales-rep web and tablet flows, pending approval. Useful earliest-stage evidence. |
| Label - | Empty/separator entry. |
| Offline 2.0 | Online/offline sync phases, failures and image sync. Separate case-study candidate. |
| Wiz Pay website | Product marketing, online/in-person collection, saved cards, refunds, sales-rep/tradeshow scenarios. Product claims require corroboration. |
| Parth version website | Web and device wireframes, customer/product/cart material, February 2024 screenshots. |

## Draft media sequence

1. Order entry and tablet summary — screenshots 1 and 3.
2. First payment-method exploration — screenshot 4, explicitly identified by Parth as the first cut.
3. Method variants and layered collection — screenshots 2 and 5.
4. Dedicated payment workspace — screenshot 7.
5. Customer payment history — screenshot 6.

## Remaining evidence before a final published case study

- Identify the versions Parth directly designed and those that shipped, especially later-dated work.
- Confirm what prompted each revision: team input is established; usability testing is not.
- Explain one invoice-allocation example and one recovery state using confirmed final frames.
- Reconcile old portfolio payment-volume metrics with current portfolio claims before including either.
- Select clean exports of approved frames. The current local draft deliberately uses the supplied screenshots as process evidence.
